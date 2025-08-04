'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
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

    // Fetch reviews for the game
    const reviews = await prisma.review.findMany({
      where: {
        gameId: parseInt(gameId, 10)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isProfilePublic: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching game reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 