'use server';

import { auth } from '@/src/lib/auth/authConfig';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const banUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(1).max(500)
});

export async function banUser(userId: string, reason: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate input
    const validatedData = banUserSchema.parse({ userId, reason });

    // Check if current user is admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { id: true, role: true, isBanned: true }
    });

    if (!targetUser) {
      return { success: false, error: 'User not found' };
    }

    // Prevent banning other admins
    if (targetUser.role === 'ADMIN') {
      return { success: false, error: 'Cannot ban admin users' };
    }

    // Prevent banning already banned users
    if (targetUser.isBanned) {
      return { success: false, error: 'User is already banned' };
    }

    // Ban the user and delete all their data
    await prisma.$transaction([
      // Delete all reviews by the user
      prisma.review.deleteMany({
        where: { userId: validatedData.userId }
      }),
      // Delete all game statuses by the user
      prisma.userGameStatus.deleteMany({
        where: { userId: validatedData.userId }
      }),
      // Ban the user
      prisma.user.update({
        where: { id: validatedData.userId },
        data: { isBanned: true }
      })
    ]);

    return { success: true, message: 'User banned successfully' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data' };
    }
    
    console.error('Error banning user:', error);
    return { success: false, error: 'Internal server error' };
  } finally {
    await prisma.$disconnect();
  }
} 