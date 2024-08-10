'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // EXTRACT GAME ID FROM URL PARAMETERS
  const url = new URL(request.url);
  const gameId = url.searchParams.get('gameId');

  // VALIDATE GAME ID
  if (gameId === null) {
    return NextResponse.json({ error: 'gameId parameter is missing' }, { status: 400 });
  }

  const gameIdSchema = z.string().regex(/^\d+$/, 'Invalid gameId format');
  try {
    gameIdSchema.parse(gameId);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid gameId format' }, { status: 400 });
  }

  // CHECK AUTHENTICATION
  const isAuthenticated = checkIsAuthenticated();
  const userId = await getUserId();

  if (!userId || !isAuthenticated) {
    return NextResponse.json({ error: 'Please authenticate' }, { status: 401 });
  }

  try {
    // FETCH USER GAME STATUS
    const status = await prisma.userGameStatus.findFirst({
      where: {
        userId: userId,
        gameId: parseInt(gameId, 10)
      },
      select: {
        status: true,
        progress: true
      }
    });

    return NextResponse.json(status || null, { status: 200 });
  } catch (error) {
    console.error('Error fetching user game status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
