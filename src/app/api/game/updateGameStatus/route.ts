'use server'

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';

const prisma = new PrismaClient();

const inputSchema = z.object({
  userId: z.string().uuid(),
  gameId: z.number().positive(),
  status: z.string().max(20),
  progress: z.string().max(20)
});

export async function POST(request: Request) {
  // CHECK IS AUTHENTICATED
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    redirect("/auth/sign-in")
  }

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

  // VALIDATE INPUT
  const body = await request.json();
  const validatedInput = inputSchema.parse(body);

  const userId = await getUserId();
  if (userId === undefined) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (validatedInput.userId !== userId) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const result = await prisma.userGameStatus.upsert({
      where: {
        userId_gameId: {
          userId: validatedInput.userId,
          gameId: validatedInput.gameId,
        },
      },
      update: {
        status: validatedInput.status,
        progress: validatedInput.progress,
        updatedAt: new Date(),
      },
      create: {
        userId: validatedInput.userId,
        gameId: validatedInput.gameId,
        status: validatedInput.status,
        progress: validatedInput.progress,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating game status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}