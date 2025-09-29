'use server';

import { auth } from '@/src/lib/auth/authConfig';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkUserBanned() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return { isBanned: false, error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isBanned: true }
    });

    if (!user) {
      return { isBanned: false, error: 'User not found' };
    }

    return { isBanned: user.isBanned };
  } catch (error) {
    console.error('Error checking user ban status:', error);
    return { isBanned: false, error: 'Internal server error' };
  } finally {
    await prisma.$disconnect();
  }
} 