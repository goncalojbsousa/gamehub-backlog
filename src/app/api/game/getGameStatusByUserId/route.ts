'use server';

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

    if (typeof clientIp !== 'string') {
        throw new Error('Access temporarily blocked. Try again later.');
    }

    if (clientIp === 'unknown') {
        throw new Error('Access temporarily blocked. Try again later.');
    }

    if (!(await checkRateLimit(clientIp))) {
        throw new Error('Limit rate exceeded. Try again later.');
    }

    // EXTRACT USER ID FROM URL PARAMETERS
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    // VALIDATE USER ID
    const userIdSchema = z.string().uuid();
    try {
        userIdSchema.parse(userId);
    } catch (error) {
        return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    try {
        // FETCH USER GAME STATUS
        const userGameStatuses = await prisma.userGameStatus.findMany({
            where: {
                userId: userId!,
            },
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
            gameDetails: gameDetails.find((game: Game) => game.id === status.gameId) || null,
        }));

        return NextResponse.json(combinedData, { status: 200 });
    } catch (error) {
        console.error('Error fetching user game statuses or game details:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}