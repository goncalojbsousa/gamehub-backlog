'use client';

import { useState, useEffect } from 'react';

interface GameRatingStarsProps {
  gameId: number;
}

interface RatingData {
  averageRating: number;
  reviewCount: number;
  hasReviews: boolean;
}

export const GameRatingStars: React.FC<GameRatingStarsProps> = ({ gameId }) => {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/game/getGameRating?gameId=${gameId}`);
        if (response.ok) {
          const data = await response.json();
          setRatingData(data);
        }
      } catch (error) {
        console.error('Error fetching game rating:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRating();
  }, [gameId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-pulse bg-color_hover rounded-lg h-6 w-24"></div>
      </div>
    );
  }

  if (!ratingData || !ratingData.hasReviews) {
    return null;
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-200 group"
      onClick={scrollToReviews}
      title="Click to view reviews"
    >
      {renderStars(ratingData.averageRating)}
      <span className="text-color_text text-sm font-medium">
        {ratingData.averageRating.toFixed(1)}
      </span>
      <span className="text-color_text_sec text-xs">
        ({ratingData.reviewCount} reviews)
      </span>
      <svg 
        className="w-4 h-4 text-color_text_sec group-hover:text-color_text transition-colors duration-200" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}; 