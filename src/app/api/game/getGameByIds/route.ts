import { NextRequest, NextResponse } from 'next/server';
import { fetchGameDetailsByIds } from '@/src/services/igdbServices/getGameByIds';

export async function POST(request: NextRequest) {
    try {
        const { gameIds } = await request.json();

        if (!gameIds || !Array.isArray(gameIds) || gameIds.length === 0) {
            return NextResponse.json(
                { error: 'Game IDs array is required' },
                { status: 400 }
            );
        }

        // Limit the number of game IDs to prevent abuse
        if (gameIds.length > 50) {
            return NextResponse.json(
                { error: 'Too many game IDs requested' },
                { status: 400 }
            );
        }

        const games = await fetchGameDetailsByIds(gameIds);

        return NextResponse.json(games);

    } catch (error) {
        console.error('Error fetching game details:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 