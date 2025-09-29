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

    // Get current date and first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all statistics in parallel
    const [
      totalUsers,
      bannedUsers,
      totalReviews,
      totalGames,
      averageRating,
      reviewsThisMonth,
      usersThisMonth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.review.count(),
      prisma.userGameStatus.groupBy({
        by: ['gameId'],
        _count: { gameId: true }
      }),
      prisma.review.aggregate({
        _avg: { rating: true }
      }),
      prisma.review.count({
        where: { createdAt: { gte: firstDayOfMonth } }
      }),
      prisma.user.count({
        where: { createdAt: { gte: firstDayOfMonth } }
      })
    ]);

    const stats = {
      totalUsers,
      bannedUsers,
      activeUsers: totalUsers - bannedUsers,
      totalReviews,
      totalGames: totalGames.length,
      averageRating: averageRating._avg.rating || 0,
      reviewsThisMonth,
      usersThisMonth
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 