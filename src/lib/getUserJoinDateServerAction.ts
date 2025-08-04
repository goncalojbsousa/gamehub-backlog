'use server'

import { PrismaClient } from "@prisma/client"
import { checkIsAuthenticated } from "@/src/lib/auth/checkIsAuthenticated";
import { getUserId } from "@/src/lib/auth/getUserIdServerAction";

// Initialize Prisma client for database operations
const prisma = new PrismaClient()

/**
 * Retrieves the user's join date based on their first game status entry
 * Determines when the user first started using the platform by finding their earliest activity
 * Requires user authentication and returns null if user is not authenticated
 * 
 * @returns Promise resolving to the user's join date or null if not found/authenticated
 * @throws Error if database operation fails
 */
export async function getUserJoinDate() {
    try {
        // Verify user authentication
        const isAuthenticated = await checkIsAuthenticated();

        // Get current user ID
        const userId = await getUserId();

        // Return null if user is not authenticated or ID is missing
        if (!userId || !isAuthenticated) {
            console.warn('Please authenticate');
            return null;
        }

        // Find the user's first game status entry to determine join date
        const joinDate = await prisma.userGameStatus.findFirst({
            where: {
                userId: userId,
            },
            select: {
                createdAt: true, // Only select the creation timestamp
            }
        });

        // Return the join date or null if no activity found
        return joinDate || null;
    } catch (error) {
        console.error('Error fetching user join date:', error);
        throw error;
    }
}
