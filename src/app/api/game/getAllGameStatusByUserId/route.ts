import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { z } from 'zod';
import { fetchGameDetailsByIds } from '@/src/services/igdbServices/getGameByIds';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    // GET CLIENT IP
    const headersList = headers();
    const clientIp = headersList.get('x-forwarded-for') || 'unknown';

    if (typeof clientIp !== 'string' || clientIp === 'unknown') {
        return NextResponse.json({ message: 'Access temporarily blocked. Try again later.' }, { status: 403 });
    }

    if (!(await checkRateLimit(clientIp))) {
        return NextResponse.json({ message: 'Limit rate exceeded. Try again later.' }, { status: 429 });
    }

    // EXTRACT PARAMETERS FROM URL
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 48;

    // VALIDATE PARAMETERS
    const paramsSchema = z.object({
        userId: z.string().uuid(),
        status: z.string(),
        page: z.number().int().positive(),
    });

    try {
        paramsSchema.parse({ userId, status, page });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
    }

    try {
        const skip = (page - 1) * limit;

        const userGameStatuses = await prisma.userGameStatus.findMany({
            where: {
                userId: userId!,
                status: status!
            },
            select: {
                gameId: true,
                status: true,
                progress: true,
            },
            skip: skip,
            take: limit,
        });

        const gameIds = userGameStatuses.map(status => status.gameId);
        const gameDetails = await fetchGameDetailsByIds(gameIds);

        const combinedData = userGameStatuses.map((status) => ({
            ...status,
            gameDetails: gameDetails.find((game: any) => game.id === status.gameId) || null,
        }));

        const totalCount = await prisma.userGameStatus.count({
            where: {
                userId: userId!,
                status: status!
            },
        });

        return NextResponse.json({
            games: combinedData,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user game statuses or game details:', error);
        return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }

}