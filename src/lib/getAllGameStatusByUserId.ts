'use server'

/**
 * Retrieves all games for a user with a specific status
 * Fetches paginated game data filtered by user ID and game status
 * Used for displaying user's game collection organized by status
 * 
 * @param userId - The unique identifier of the user
 * @param status - The game status to filter by (playing, completed, etc.)
 * @param page - The page number for pagination
 * @returns Promise resolving to the paginated game data
 * @throws Error if the API call fails or returns an error status
 */
export async function getAllGameStatusByUserId(userId: string, status: string, page: number) {
    try {
        // Construct API URL with query parameters
        const url = `${process.env.NEXTAUTH_URL}/api/game/getAllGameStatusByUserId?userId=${userId}&status=${status}&page=${page}`;

        // Make API request to fetch user's games with specified status
        const response = await fetch(url);
        
        // Handle non-successful responses
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API response not OK:', response.status, errorText);
            throw new Error(`Failed to fetch games: ${response.status} ${errorText}`);
        }
        
        // Parse and return the response data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in getAllGameStatusByUserId:', error);
        throw error;
    }
}