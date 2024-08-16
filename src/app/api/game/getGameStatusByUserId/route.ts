'use server'

export async function GET(userId: string) {
    try {
        const url = `/api/game/getAllGameStatusByUserId?userId=${userId}`;

        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API response not OK:', response.status, errorText);
            throw new Error(`Failed to fetch games: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in getAllGameStatusByUserId:', error);
        throw error;
    }
}