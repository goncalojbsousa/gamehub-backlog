import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    // GET CLIENT IP
    const headersList = await headers();
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
        // Check if user has any games in any status
        const totalCount = await prisma.userGameStatus.count({
            where: {
                userId: userId!
            },
        });

        // Get count by status for better UX
        const statusCounts = await prisma.userGameStatus.groupBy({
            by: ['status'],
            where: {
                userId: userId!
            },
            _count: {
                status: true
            }
        });

        const statusCountMap = statusCounts.reduce((acc, item) => {
            acc[item.status] = item._count.status;
            return acc;
        }, {} as Record<string, number>);

        return NextResponse.json({
            hasGames: totalCount > 0,
            totalGames: totalCount,
            statusCounts: statusCountMap
        }, { status: 200 });
    } catch (error) {
        console.error('Error checking user games:', error);
        return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }
} 