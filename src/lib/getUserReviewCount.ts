export async function getUserReviewCount(userId: string): Promise<number> {
    try {
        const response = await fetch(`/api/review/getUserReviewCount?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error('Error fetching user review count:', error);
        return 0;
    }
} 