import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/src/lib/auth/authConfig';
import { z } from 'zod';
import { logAdminAction, AdminActions, getClientIP, getUserAgent } from '@/src/utils/adminLogger';

const prisma = new PrismaClient();

const unbanUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID')
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = unbanUserSchema.parse(body);

    // Check if user exists and is banned
    const targetUser = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { id: true, isBanned: true }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!targetUser.isBanned) {
      return NextResponse.json({ error: 'User is not banned' }, { status: 400 });
    }

    // Unban the user
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: { isBanned: false }
    });

    // Log the admin action
    // Validate adminId is a valid UUID before logging
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(user.id)) {
      await logAdminAction({
        action: AdminActions.USER_UNBANNED,
        adminId: user.id,
        adminEmail: session.user.email || '',
        targetId: validatedData.userId, // This is a UUID, so it's safe to pass
        targetType: 'USER',
        details: 'User unbanned',
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request)
      });
    } else {
      console.warn('Invalid adminId format, skipping admin log:', user.id);
    }

    return NextResponse.json({ 
      success: true,
      message: 'User unbanned successfully'
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 