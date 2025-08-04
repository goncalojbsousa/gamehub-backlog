import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth/authConfig';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logAdminAction, AdminActions, getClientIP, getUserAgent } from '@/src/utils/adminLogger';

const prisma = new PrismaClient();

const banUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(1).max(500)
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const validatedData = banUserSchema.parse(body);

    // Check if current user is admin
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { id: true, role: true, isBanned: true }
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Prevent banning other admins
    if (targetUser.role === 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Cannot ban admin users' }, { status: 400 });
    }

    // Prevent banning already banned users
    if (targetUser.isBanned) {
      return NextResponse.json({ success: false, error: 'User is already banned' }, { status: 400 });
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

    // Log the admin action
    // Validate adminId is a valid UUID before logging
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(adminUser.id)) {
      await logAdminAction({
        action: AdminActions.USER_BANNED,
        adminId: adminUser.id,
        adminEmail: session.user.email,
        targetId: validatedData.userId, // This is a UUID, so it's safe to pass
        targetType: 'USER',
        details: `User banned. Reason: ${validatedData.reason}`,
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request)
      });
    } else {
      console.warn('Invalid adminId format, skipping admin log:', adminUser.id);
    }

    return NextResponse.json({ success: true, message: 'User banned successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid input data' }, { status: 400 });
    }
    
    console.error('Error banning user:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 