declare interface Review {
  id: number;
  userId: string;
  gameId: number;
  rating: number;
  content?: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name?: string;
    username?: string;
    image?: string;
    isProfilePublic?: boolean;
  };
}

declare interface CreateReviewRequest {
  gameId: number;
  rating: number;
  content?: string;
}

declare interface UpdateReviewRequest {
  rating?: number;
  content?: string;
} 