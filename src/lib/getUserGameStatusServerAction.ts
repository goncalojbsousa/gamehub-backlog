'use server'

import { PrismaClient } from '@prisma/client'
import { getUserId } from "@/src/lib/auth/getUserIdServerAction";
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';

const prisma = new PrismaClient()

export async function fetchUserGameStatus(gameId: string) {
  try {
    const isAuthenticated = checkIsAuthenticated();

    const userId = await getUserId();

    if (!userId || !isAuthenticated) {
      console.warn('Please authenticate');
      return null;
    }

    const status = await prisma.userGameStatus.findFirst({
      where: {
        userId: userId,
        gameId: parseInt(gameId)
      },
      select: {
        status: true,
        progress: true
      }
    });
    return status || null;
  } catch (error) {
    console.error('Error fetching user game status:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}