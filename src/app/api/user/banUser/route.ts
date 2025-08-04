import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth/authConfig';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logAdminAction, AdminActions, getClientIP, getUserAgent } from '@/src/utils/adminLogger';

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/**
 * Input validation schema for user banning
 * Ensures required fields are present and properly formatted
 */
const banUserSchema = z.object({
  userId: z.string().uuid(),        // Must be a valid UUID
  reason: z.string().min(1).max(500) // Ban reason with length constraints
});

/**
 * POST endpoint for banning users (Admin only)
 * Permanently bans a user and removes all their data from the system
 * Includes comprehensive security checks and audit logging
 * 
 * @param request - HTTP request containing user ID and ban reason
 * @returns JSON response indicating success or failure
 */
export async function POST(request: Request) {
  try {
    // Verify user authentication
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = banUserSchema.parse(body);

    // Verify current user has admin privileges
    // Only administrators can perform user banning operations
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // Verify target user exists and get their current status
    const targetUser = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { id: true, role: true, isBanned: true }
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Prevent banning other administrators
    // Admins cannot ban other admins for security reasons
    if (targetUser.role === 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Cannot ban admin users' }, { status: 400 });
    }

    // Prevent banning already banned users
    if (targetUser.isBanned) {
      return NextResponse.json({ success: false, error: 'User is already banned' }, { status: 400 });
    }

    // Execute ban operation in a database transaction
    // Ensures data consistency by deleting user data and updating ban status atomically
    await prisma.$transaction([
      // Delete all reviews by the user to maintain data integrity
      prisma.review.deleteMany({
        where: { userId: validatedData.userId }
      }),
      // Delete all game statuses by the user
      prisma.userGameStatus.deleteMany({
        where: { userId: validatedData.userId }
      }),
      // Mark user as banned
      prisma.user.update({
        where: { id: validatedData.userId },
        data: { isBanned: true }
      })
    ]);

    // Log the administrative action for audit purposes
    // Validate adminId is a valid UUID before logging to prevent errors
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

    // Return success response
    return NextResponse.json({ success: true, message: 'User banned successfully' });
  } catch (error) {
    // Handle validation errors from Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid input data' }, { status: 400 });
    }
    
    // Handle unexpected errors
    console.error('Error banning user:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  } finally {
    // Ensure database connection is properly closed
    await prisma.$disconnect();
  }
} 