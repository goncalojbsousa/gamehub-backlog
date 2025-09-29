'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get user ID from session
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract game ID from URL parameters
    const url = new URL(request.url);
    const gameId = url.searchParams.get('gameId');

    // Validate game ID
    if (gameId === null) {
      return NextResponse.json({ error: 'gameId parameter is missing' }, { status: 400 });
    }

    const gameIdSchema = z.string().regex(/^\d+$/, 'Invalid gameId format');
    try {
      gameIdSchema.parse(gameId);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid gameId format' }, { status: 400 });
    }

    // Fetch user's review for the game
    const review = await prisma.review.findUnique({
      where: {
        userId_gameId: {
          userId: userId,
          gameId: parseInt(gameId, 10)
        }
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

    return NextResponse.json(review || null, { status: 200 });
  } catch (error) {
    console.error('Error fetching user review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 