import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/src/lib/auth/authConfig';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all reviews with user and game information
    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        content: true,
        rating: true,
        isEdited: true,
        createdAt: true,
        updatedAt: true,
        gameId: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            isBanned: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 