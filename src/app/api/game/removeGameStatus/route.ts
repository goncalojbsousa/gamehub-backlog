'use server'

import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { prisma } from '@/src/lib/prisma';

/**
 * Input validation schema for game status removal
 * Ensures data integrity and prevents malicious input
 */
const inputSchema = z.object({
  gameId: z.number().positive(), // Must be a positive integer
});

/**
 * DELETE endpoint for removing user game status
 * Allows authenticated users to remove their status for games
 * 
 * @param request - The incoming HTTP request containing game ID
 * @returns JSON response with success or error message
 */
export async function DELETE(request: Request) {
  // Verify user authentication before processing request
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  }

  // Extract client IP address for rate limiting
  const headersList = await headers();
  const clientIp = headersList.get('x-forwarded-for') || 'unknown';

  // Validate IP address format and presence
  if (typeof clientIp !== 'string') {
    throw new Error('Access temporarily blocked. Try again later.');
  }

  if (clientIp === 'unknown') {
    throw new Error('Access temporarily blocked. Try again later.');
  }

  // Check rate limiting to prevent abuse
  if (!(await checkRateLimit(clientIp))) {
    throw new Error('Rate limit exceeded. Try again later.');
  }

  // Parse and validate request body
  const body = await request.json();
  const validatedInput = inputSchema.parse(body);

  // Get current user ID from session
  const userId = await getUserId();
  if (userId === undefined) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Delete the game status record
    const result = await prisma.userGameStatus.deleteMany({
      where: {
        userId: userId,
        gameId: validatedInput.gameId,
      },
    });

    // Return successful response
    return NextResponse.json({ 
      message: 'Game status removed successfully',
      deletedCount: result.count 
    }, { status: 200 });
  } catch (error) {
    console.error('Error removing game status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
