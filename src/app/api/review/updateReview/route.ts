'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { validateReviewContent } from '@/src/utils/sanitizeReview';

const prisma = new PrismaClient();

const updateReviewSchema = z.object({
  gameId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  content: z.string().max(2000, "Review content cannot exceed 2000 characters").optional()
});

export async function PUT(request: Request) {
  try {
    // Get user ID from session
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const validatedData = updateReviewSchema.parse(body);

    // Validate and sanitize review content
    if (validatedData.content) {
      const validation = validateReviewContent(validatedData.content);
      if (!validation.isValid) {
        return NextResponse.json({ 
          error: 'Invalid review content', 
          details: validation.errors 
        }, { status: 400 });
      }
      validatedData.content = validation.sanitizedContent;
    }

    // Check if user has a review for this game
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: validatedData.gameId
        }
      }
    });

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Update the review
    const review = await prisma.review.update({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: validatedData.gameId
        }
      },
      data: {
        rating: validatedData.rating,
        content: validatedData.content,
        isEdited: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 