'use server'

import { NextResponse } from 'next/server';
import { checkIsAuthenticated } from '@/src/lib/auth/checkIsAuthenticated';
import { getUserId } from '@/src/lib/auth/getUserIdServerAction';
import { z } from 'zod';
import { prisma } from '@/src/lib/prisma';

/**
 * Input validation schema for multiple game status requests
 * Ensures data integrity and prevents malicious input
 */
const inputSchema = z.object({
  gameIds: z.array(z.number().positive()).max(100) // Maximum 100 games per request
});

/**
 * POST endpoint for getting multiple game statuses at once
 * Allows authenticated users to get their status for multiple games efficiently
 * 
 * @param request - The incoming HTTP request containing game IDs
 * @returns JSON response with game statuses or error message
 */
export async function POST(request: Request) {
  // Verify user authentication before processing request
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Skip rate limiting for internal API calls
  // This API is called by our own components, not external clients

  // Parse and validate request body
  const body = await request.json();
  const validatedInput = inputSchema.parse(body);

  // Get current user ID from session
  const userId = await getUserId();
  if (userId === undefined) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get game statuses for the provided game IDs
    const gameStatuses = await prisma.userGameStatus.findMany({
      where: {
        userId: userId,
        gameId: {
          in: validatedInput.gameIds
        }
      },
      select: {
        gameId: true,
        status: true
      }
    });

    // Create a map for quick lookup
    const statusMap = gameStatuses.reduce((acc, status) => {
      acc[status.gameId] = status.status;
      return acc;
    }, {} as Record<number, string>);

    // Return successful response with status map
    return NextResponse.json({ statusMap }, { status: 200 });
  } catch (error) {
    console.error('Error fetching multiple game statuses:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
