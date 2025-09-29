'use server'

/**
 * Retrieves games for a user with a specific status
 * Fetches paginated game data filtered by user ID and game status
 * Used for displaying user's game collection organized by status
 * 
 * @param userId - The unique identifier of the user
 * @param status - The game status to filter by (playing, completed, etc.)
 * @param page - The page number for pagination
 * @returns Promise resolving to the paginated game data
 * @throws Error if the API call fails
 */
export async function getGameStatusByUserId(userId: string, status: string, page: number) {
    // Make API request to fetch user's games with specified status
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/game/getGameStatusByUserId?userId=${userId}&status=${status}&page=${page}`);
    
    // Handle non-successful responses
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }
    
    // Parse and return the response data
    return response.json();
  }