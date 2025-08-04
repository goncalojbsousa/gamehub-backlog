'use server'

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { redirect } from 'next/navigation';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';

const prisma = new PrismaClient();

export async function GET() {
  // CHECK IS AUTHENTICATED
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  }

  const userId = await getUserId();
  if (userId === undefined) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // FETCH CURRENT USER DATA
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        isProfilePublic: true,
        image: true,
      }
    });

    if (!userData) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userData);

  } catch (error) {
    console.error('Error fetching current user data:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch user data' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 