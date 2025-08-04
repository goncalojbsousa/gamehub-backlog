"use client";

import { useState, useEffect, useCallback } from "react";
import { ReviewCard } from "@/src/components/review-card";
import { ReviewForm } from "@/src/components/review-form";
import { useSession } from "next-auth/react";

interface GameReviewsProps {
  gameId: number;
}

export const GameReviews: React.FC<GameReviewsProps> = ({ gameId }) => {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated";

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/review/getGameReviews?gameId=${gameId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Erro ao buscar reviews:", error);
    }
  }, [gameId]);

  const fetchUserReview = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`/api/review/getUserReview?gameId=${gameId}`);
      if (response.ok) {
        const data = await response.json();
        setUserReview(data);
      }
    } catch (error) {
      console.error("Erro ao buscar review do utilizador:", error);
    }
  }, [gameId, isAuthenticated]);

  const fetchUserRole = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch("/api/user/getUserRole");
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error("Erro ao buscar role do utilizador:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchReviews(),
        fetchUserReview(),
        fetchUserRole()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [gameId, isAuthenticated, fetchReviews, fetchUserReview, fetchUserRole]);

  const handleCreateReview = async (rating: number, content: string) => {
    try {
      const response = await fetch("/api/review/createReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          rating,
          content: content.trim() || undefined,
        }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setUserReview(newReview);
        setReviews(prev => [...prev, newReview]);
        setShowForm(false);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error creating review");
      }
    } catch (error) {
      setError("Error creating review");
    }
  };

  const handleUpdateReview = async (rating: number, content: string) => {
    try {
      const response = await fetch("/api/review/updateReview", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          rating,
          content: content.trim() || undefined,
        }),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setUserReview(updatedReview);
        setReviews(prev => 
          prev.map(review => 
            review.id === updatedReview.id ? updatedReview : review
          )
        );
        setShowForm(false);
        setIsEditing(false);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error updating review");
      }
    } catch (error) {
      setError("Error updating review");
    }
  };

  const handleDeleteReview = async (reviewId?: number) => {
    try {
      let response;
      
      if (userRole === 'ADMIN' && reviewId) {
        // Admin needs to pass reviewId in body
        response = await fetch(`/api/review/deleteReview?gameId=${gameId}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reviewId })
        });
      } else {
        // Regular user doesn't need body
        response = await fetch(`/api/review/deleteReview?gameId=${gameId}`, {
          method: "DELETE",
        });
      }

      if (response.ok) {
        setUserReview(null);
        setReviews(prev => prev.filter(review => review.userId !== userReview?.userId));
        setError(null);
        // Close the edit form if it's open
        setShowForm(false);
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error deleting review");
      }
    } catch (error) {
      setError("Error deleting review");
    }
  };

  const handleEditReview = () => {
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setError(null);
  };

  // Function to check if user can delete a review
  const canDeleteReview = (reviewUserId: string) => {
    if (!isAuthenticated) return false;
    
    // Admin can delete any review
    if (userRole === 'ADMIN') return true;
    
    // Regular user can only delete their own review
    return reviewUserId === userReview?.userId;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-color_hover rounded-lg w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-color_sec rounded-xl p-6 border border-border_detail shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-color_hover rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-color_hover rounded w-1/4"></div>
                    <div className="h-4 bg-color_hover rounded w-1/3"></div>
                    <div className="h-4 bg-color_hover rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const allReviews = userReview 
    ? [userReview, ...reviews.filter(review => review.userId !== userReview?.userId)]
    : reviews;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-color_sec rounded-xl p-6 border border-border_detail shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-color_text mb-2">
              Reviews
            </h2>
            <p className="text-color_text_sec">
              {allReviews.length} {allReviews.length === 1 ? 'review' : 'reviews'} for this game
            </p>
          </div>
          {isAuthenticated && !userReview && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-color_reverse_sec text-color_main font-semibold py-3 px-6 rounded-xl hover:bg-color_reverse transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Write Review
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-color_sec to-color_main rounded-xl border border-border_detail shadow-lg overflow-hidden">
          <ReviewForm
            gameId={gameId}
            initialRating={userReview?.rating || 0}
            initialContent={userReview?.content || ""}
            onSubmit={isEditing ? handleUpdateReview : handleCreateReview}
            onCancel={handleCancelForm}
            isEditing={isEditing}
          />
        </div>
      )}

      {/* Reviews List */}
      {allReviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-color_sec rounded-xl border border-border_detail p-8 shadow-sm">
            <div className="w-16 h-16 bg-color_hover rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-color_text_sec" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-color_text mb-2">
              {isAuthenticated ? "Be the first to write a review!" : "No reviews yet"}
            </h3>
            <p className="text-color_text_sec">
              {isAuthenticated 
                ? "Share your opinion and help other players discover this game."
                : "Sign in to be the first to write a review."
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {allReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              gameId={gameId}
              isOwnReview={review.userId === userReview?.userId}
              onEdit={review.userId === userReview?.userId ? handleEditReview : undefined}
              onDelete={canDeleteReview(review.userId) ? handleDeleteReview : undefined}
              isAdmin={userRole === 'ADMIN'}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 