import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/src/lib/auth/authConfig';

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/**
 * GET endpoint for retrieving all users (Admin only)
 * Provides comprehensive user data for administrative purposes
 * Includes user counts for reviews and game statuses
 * 
 * @returns JSON response with user data or error message
 */
export async function GET() {
  try {
    // Verify user authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user has admin privileges
    // Only administrators can access user management data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Retrieve all users with their activity counts
    // Includes user profile data and aggregated counts for reviews and game statuses
    const users = await prisma.user.findMany({
      select: {
        id: true,           // User unique identifier
        name: true,         // Display name
        email: true,        // Email address
        username: true,     // Unique username
        image: true,        // Profile image URL
        role: true,         // User role (USER/ADMIN)
        isBanned: true,     // Ban status flag
        createdAt: true,    // Account creation timestamp
        _count: {           // Aggregated counts for user activity
          select: {
            reviews: true,      // Number of reviews written
            gameStatus: true    // Number of games with status
          }
        }
      },
      orderBy: {
        createdAt: 'desc'   // Sort by newest users first
      }
    });

    // Return successful response with user data
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 