'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // EXTRACT GAME ID AND USER ID FROM URL PARAMETERS
  const url = new URL(request.url);
  const gameId = url.searchParams.get('gameId');
  const userId = url.searchParams.get('userId');

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

  // VALIDATE USER ID
  if (userId === null) {
    return NextResponse.json({ error: 'userId parameter is missing' }, { status: 400 });
  }
  
  const uuidSchema = z.string().uuid();
  try {
    uuidSchema.parse(userId);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
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