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

    if (userData) {
      // Garantir que a data de criação seja válida
      let validCreatedAt = userData.createdAt;
      
      // Se a data for nula ou inválida, usar a data atual
      if (!validCreatedAt || isNaN(new Date(validCreatedAt).getTime())) {
        console.log(`Invalid createdAt for user ${username}:`, validCreatedAt);
        validCreatedAt = new Date();
      }
      
      // Retornar os dados com a data validada
      return NextResponse.json({
        ...userData,
        createdAt: validCreatedAt
      }, { status: 200 });
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error('Error fetching user game status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
