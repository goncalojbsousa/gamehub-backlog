import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth/authConfig';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ isBanned: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isBanned: true }
    });

    if (!user) {
      return NextResponse.json({ isBanned: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ isBanned: user.isBanned });
  } catch (error) {
    console.error('Error checking user ban status:', error);
    return NextResponse.json({ isBanned: false, error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 