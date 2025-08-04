'use server'

/**
 * Checks if a user has any games in their collection
 * Makes an API call to verify if the user has added any games to their backlog
 * Used for conditional rendering and user experience optimization
 * 
 * @param userId - The unique identifier of the user to check
 * @returns Promise resolving to the API response data
 * @throws Error if the API call fails or returns an error status
 */
export async function checkUserHasGames(userId: string) {
    try {
        // Construct API URL with user ID parameter
        const url = `${process.env.NEXTAUTH_URL}/api/game/checkUserHasGames?userId=${userId}`;

        // Make API request to check user's game collection
        const response = await fetch(url);
        
        // Handle non-successful responses
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API response not OK:', response.status, errorText);
            throw new Error(`Failed to check user games: ${response.status} ${errorText}`);
        }
        
        // Parse and return the response data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in checkUserHasGames:', error);
        throw error;
    }
} 