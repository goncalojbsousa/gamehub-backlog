'use server'

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { z } from 'zod';

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

    return NextResponse.json(userGameStatuses, { status: 200 });
  } catch (error) {
    console.error('Error fetching user game statuses:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}