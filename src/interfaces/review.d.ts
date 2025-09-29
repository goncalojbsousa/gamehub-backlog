/**
 * Review interface - Represents a user's game review
 * Contains all review data including rating, content, and user information
 * Used for displaying and managing user reviews throughout the application
 */
declare interface Review {
  id: number;              // Unique review identifier
  userId: string;          // ID of the user who wrote the review
  gameId: number;          // ID of the game being reviewed
  rating: number;          // User's rating (1-5 scale)
  content?: string;        // Optional review text content
  isEdited: boolean;       // Whether the review has been edited
  createdAt: Date;         // Review creation timestamp
  updatedAt: Date;         // Last edit timestamp
  user: {                  // User information for display
    id: string;            // User unique identifier
    name?: string;         // User's display name
    username?: string;     // User's username
    image?: string;        // User's profile image URL
    isProfilePublic?: boolean; // Whether user's profile is public
  };
}

/**
 * CreateReviewRequest interface - Data structure for creating new reviews
 * Defines the required and optional fields when submitting a new review
 */
declare interface CreateReviewRequest {
  gameId: number;          // ID of the game to review
  rating: number;          // User's rating (1-5 scale)
  content?: string;        // Optional review text content
}

/**
 * UpdateReviewRequest interface - Data structure for updating existing reviews
 * Defines the fields that can be modified when editing a review
 */
declare interface UpdateReviewRequest {
  rating?: number;         // Optional new rating
  content?: string;        // Optional new review content
} 