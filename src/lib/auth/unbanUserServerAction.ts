'use server';

import { auth } from '@/src/lib/auth/authConfig';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const unbanUserSchema = z.object({
  userId: z.string().uuid()
});

export async function unbanUser(userId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    // Validate input
    const validatedData = unbanUserSchema.parse({ userId });

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
      select: { id: true, isBanned: true }
    });

    if (!targetUser) {
      return { success: false, error: 'User not found' };
    }

    // Check if user is actually banned
    if (!targetUser.isBanned) {
      return { success: false, error: 'User is not banned' };
    }

    // Unban the user
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: { isBanned: false }
    });

    return { success: true, message: 'User unbanned successfully' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data' };
    }
    
    console.error('Error unbanning user:', error);
    return { success: false, error: 'Internal server error' };
  } finally {
    await prisma.$disconnect();
  }
} 