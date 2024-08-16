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

    // VALIDATE PARAMETERS
    const paramsSchema = z.object({
        userId: z.string().uuid(),
    });

    try {
        paramsSchema.parse({ userId });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
    }

    try {
        // FETCH ALL USER GAME STATUSES
        const userGameStatuses = await prisma.userGameStatus.findMany({
            where: { userId: userId! },
            select: {
                gameId: true,
                status: true,
                progress: true,
            },
        });

        // FETCH ALL GAME DETAILS FROM IGDB FOR ALL GAME IDS AT ONCE
        const gameIds = userGameStatuses.map(status => status.gameId);
        const gameDetails = await fetchGameDetailsByIds(gameIds);

        // COMBINE GAME STATUSES WITH GAME DETAILS
        const combinedData = userGameStatuses.map((status) => ({
            ...status,
            gameDetails: gameDetails.find((game: any) => game.id === status.gameId) || null,
        }));

        return NextResponse.json(combinedData, { status: 200 });
    } catch (error) {
        console.error('Error fetching user game statuses or game details:', error);
        return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }
}