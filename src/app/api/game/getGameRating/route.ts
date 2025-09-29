import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const gameId = url.searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    // Get average rating and count of reviews
    const result = await prisma.review.aggregate({
      where: {
        gameId: parseInt(gameId, 10)
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    const averageRating = result._avg.rating || 0;
    const reviewCount = result._count.rating || 0;

    return NextResponse.json({
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount,
      hasReviews: reviewCount > 0
    });
  } catch (error) {
    console.error('Error fetching game rating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 