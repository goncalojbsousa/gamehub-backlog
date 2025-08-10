export interface UserReview {
    id: number;
    userId: string;
    gameId: number;
    rating: number;
    content: string | null;
    isEdited: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string | null;
        username: string | null;
        image: string | null;
    };
}

export interface UserReviewsResponse {
    reviews: UserReview[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalReviews: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export async function getUserReviews(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: string = 'desc'
): Promise<UserReviewsResponse> {
    try {
        const params = new URLSearchParams({
            userId,
            page: page.toString(),
            limit: limit.toString(),
            sortBy,
            sortOrder
        });

        const response = await fetch(`/api/review/getUserReviews?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        throw error;
    }
} 