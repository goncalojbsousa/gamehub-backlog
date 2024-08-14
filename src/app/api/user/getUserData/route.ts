'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // EXTRACT USERNAME FROM URL PARAMETERS
  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is missing' }, { status: 401 });
  }

  try {
    // FETCH USER DATA
    const userData = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
        username: true,
      }
    });

    return NextResponse.json(userData || null, { status: 200 });
  } catch (error) {
    console.error('Error fetching user game status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
