import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { fetchGameDetailsByIds } from '@/src/services/igdbServices/getGameByIds';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Optional params for initial views
    const gameStatus = searchParams.get('status') || 'Played';
    const gamePage = parseInt(searchParams.get('gamePage') || '1');
    const gameLimit = parseInt(searchParams.get('gameLimit') || '48');

    const reviewPage = parseInt(searchParams.get('reviewPage') || '1');
    const reviewLimit = parseInt(searchParams.get('reviewLimit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1) Fetch counts for user game statuses (to build sidebar and auto-select category)
    const statusGroups = await prisma.userGameStatus.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    });

    const statusCounts: Record<string, number> = {};
    statusGroups.forEach(g => { statusCounts[g.status] = g._count.status; });

    // 2) Fetch paginated user games for selected status (only ids/progress/status)
    const gameSkip = (gamePage - 1) * gameLimit;

    const totalGamesForStatus = await prisma.userGameStatus.count({
      where: { userId, status: gameStatus },
    });

    const userGameStatuses = await prisma.userGameStatus.findMany({
      where: { userId, status: gameStatus },
      select: { gameId: true, status: true, progress: true },
      skip: gameSkip,
      take: gameLimit,
    });

    // 3) Fetch paginated user reviews
    const reviewSkip = (reviewPage - 1) * reviewLimit;

    const totalReviews = await prisma.review.count({ where: { userId } });

    const reviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { [sortBy]: sortOrder },
      skip: reviewSkip,
      take: reviewLimit,
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    });

    // 4) Build the union of game IDs from both sources
    const gameIdsSet = new Set<number>();
    userGameStatuses.forEach(g => gameIdsSet.add(g.gameId));
    reviews.forEach(r => gameIdsSet.add(r.gameId));

    const gameIds = Array.from(gameIdsSet);

    // 5) Single IGDB request for all needed games
    const gameDetails = gameIds.length > 0
      ? await fetchGameDetailsByIds(gameIds)
      : [];

    // Map details for fast lookup
    const detailsById: Record<number, any> = {};
    for (const g of gameDetails) {
      detailsById[g.id] = g;
    }

    // 6) Compose response
    const combinedGames = userGameStatuses.map(s => ({
      ...s,
      gameDetails: detailsById[s.gameId] || null,
    }));

    return NextResponse.json({
      statusCounts,
      games: {
        items: combinedGames,
        pagination: {
          currentPage: gamePage,
          totalPages: Math.ceil(totalGamesForStatus / gameLimit),
          totalItems: totalGamesForStatus,
        },
        selectedStatus: gameStatus,
      },
      reviews: {
        items: reviews,
        pagination: {
          currentPage: reviewPage,
          totalPages: Math.ceil(totalReviews / reviewLimit),
          totalReviews,
          hasNextPage: reviewPage < Math.ceil(totalReviews / reviewLimit),
          hasPreviousPage: reviewPage > 1,
        },
        sortBy,
        sortOrder,
      },
      gameDetailsById: detailsById,
    });
  } catch (error) {
    console.error('Error in getInitialData:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
