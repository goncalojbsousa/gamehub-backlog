'use server';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { getUserRole } from '@/src/lib/auth/getUserRoleServerAction';
import { logAdminAction, AdminActions, getClientIP, getUserAgent } from '@/src/utils/adminLogger';
import { auth } from '@/src/lib/auth/authConfig';

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    // Get session for admin email
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user role for admin verification
    const userRole = await getUserRole();
    const isAdmin = userRole === 'ADMIN';

    // Extract game ID from URL parameters
    const url = new URL(request.url);
    const gameId = url.searchParams.get('gameId');

    // Validate game ID
    if (gameId === null) {
      return NextResponse.json({ error: 'gameId parameter is missing' }, { status: 400 });
    }

    const gameIdSchema = z.string().regex(/^\d+$/, 'Invalid gameId format');
    try {
      gameIdSchema.parse(gameId);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid gameId format' }, { status: 400 });
    }

    // For admin users, gameId can be 0 (we'll use reviewId instead)
    if (!isAdmin && gameId === '0') {
      return NextResponse.json({ error: 'Invalid gameId for non-admin users' }, { status: 400 });
    }

    // Check if user has a review for this game (only for non-admin users)
    if (!isAdmin) {
      const existingReview = await prisma.review.findFirst({
        where: {
          userId: userId,
          gameId: parseInt(gameId, 10)
        }
      });

      if (!existingReview) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }
    }

    // Delete the review
    if (isAdmin) {
      // Admin can delete any review for this game
      // But we need to get the specific review ID from the request body
      let body;
      let reviewId;
      
      try {
        body = await request.json();
        reviewId = body.reviewId;
      } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
      }
      
      if (!reviewId) {
        return NextResponse.json({ error: 'Review ID is required for admin deletion' }, { status: 400 });
      }

      // Validate reviewId is a number
      const reviewIdNum = parseInt(reviewId, 10);
      if (isNaN(reviewIdNum)) {
        return NextResponse.json({ error: 'Invalid review ID format' }, { status: 400 });
      }
      
      // Get review details before deletion for logging
      const reviewToDelete = await prisma.review.findUnique({
        where: { id: reviewIdNum },
        include: { user: { select: { name: true, email: true } } }
      });
      
      if (!reviewToDelete) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }
      
      await prisma.review.delete({
        where: {
          id: reviewIdNum
        }
      });

      // Log the admin action
      // Validate adminId is a valid UUID before logging
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (userId && uuidRegex.test(userId)) {
        // For review deletion, we don't need to pass targetId since it's not a UUID
        await logAdminAction({
          action: AdminActions.REVIEW_DELETED,
          adminId: userId,
          adminEmail: session.user.email || 'unknown',
          targetType: 'REVIEW',
          details: `Review deleted by admin. User: ${reviewToDelete.user.name}, Game ID: ${reviewToDelete.gameId}, Review ID: ${reviewId}`,
          ipAddress: getClientIP(request),
          userAgent: getUserAgent(request)
        });
      } else {
        console.warn('Invalid adminId format, skipping admin log. userId:', userId, 'type:', typeof userId);
      }
    } else {
      // Regular user can only delete their own review
      await prisma.review.deleteMany({
        where: {
          userId: userId,
          gameId: parseInt(gameId, 10)
        }
      });
    }

    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 