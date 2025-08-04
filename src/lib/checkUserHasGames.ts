'use server'

export async function checkUserHasGames(userId: string) {
    try {
        const url = `${process.env.NEXTAUTH_URL}/api/game/checkUserHasGames?userId=${userId}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API response not OK:', response.status, errorText);
            throw new Error(`Failed to check user games: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in checkUserHasGames:', error);
        throw error;
    }
} 