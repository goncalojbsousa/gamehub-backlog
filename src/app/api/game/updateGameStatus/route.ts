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
 * Input validation schema for game status updates
 * Ensures data integrity and prevents malicious input
 */
const inputSchema = z.object({
  gameId: z.number().positive(), // Must be a positive integer
  status: z.string().max(20) // Status string with max length
});

/**
 * POST endpoint for updating user game status
 * Allows authenticated users to update their progress and status for games
 * 
 * @param request - The incoming HTTP request containing game status data
 * @returns JSON response with updated game status or error message
 */
export async function POST(request: Request) {
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
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Upsert game status - create new record or update existing one
    const result = await prisma.userGameStatus.upsert({
      where: {
        userId_gameId: {
          userId: userId as string,
          gameId: validatedInput.gameId,
        },
      },
      update: {
        status: validatedInput.status,
        updatedAt: new Date(), // Update timestamp
      },
      create: {
        userId: userId as string,
        gameId: validatedInput.gameId,
        status: validatedInput.status,
      },
    });

    // Return successful response with updated data
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating game status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}