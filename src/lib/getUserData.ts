'use server'

/**
 * Retrieves user data by username
 * Fetches public user profile information for display
 * Returns null if user is not found or profile is private
 * 
 * @param username - The username of the user to fetch data for
 * @returns Promise resolving to user data object or null if not found
 */
export async function getUserData(username: string) {
    // Make API request to fetch user data by username
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user/getUserData?username=${username}`);
    
    // Return null if user not found or profile is private
    if (!response.ok) {
      return null;
    }
    
    // Parse and return the user data
    return response.json();
  }