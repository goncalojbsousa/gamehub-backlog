'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { validateReviewContent } from '@/src/utils/sanitizeReview';

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/**
 * Input validation schema for review creation
 * Ensures data integrity and prevents malicious input
 */
const createReviewSchema = z.object({
  gameId: z.number().int().positive(), // Must be a positive integer
  rating: z.number().int().min(1).max(5), // Rating must be between 1-5
  content: z.string().max(2000, "Review content cannot exceed 2000 characters").optional() // Optional review text
});

/**
 * POST endpoint for creating new game reviews
 * Allows authenticated users to submit reviews and ratings for games
 * 
 * @param request - The incoming HTTP request containing review data
 * @returns JSON response with created review or error message
 */
export async function POST(request: Request) {
  try {
    // Verify user authentication and get user ID
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    // Validate and sanitize review content if provided
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

    // Check if user already has a review for this game
    // Prevents duplicate reviews from the same user
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: validatedData.gameId
        }
      }
    });

    if (existingReview) {
      return NextResponse.json({ error: 'User already has a review for this game' }, { status: 409 });
    }

    // Create the new review in the database
    const review = await prisma.review.create({
      data: {
        userId: userId,
        gameId: validatedData.gameId,
        rating: validatedData.rating,
        content: validatedData.content
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

    // Return successful response with created review data
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    // Handle validation errors from Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }
    
    // Handle unexpected errors
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Ensure database connection is properly closed
    await prisma.$disconnect();
  }
} 