'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * Review interface - Represents a game review for management
 * Contains review data and associated user information for administrative purposes
 */
interface Review {
  id: number;                    // Unique review identifier
  content: string;               // Review text content
  rating: number;                // Review rating (1-5)
  isEdited: boolean;             // Whether the review has been edited
  createdAt: string;             // Review creation timestamp
  updatedAt: string;             // Last edit timestamp
  gameId: number;                // ID of the game being reviewed
  user: {                        // User who wrote the review
    id: string;                  // User unique identifier
    name: string;                // User's display name
    username: string;            // User's username
    image: string | null;        // User's profile image URL
    isBanned: boolean;           // Whether the user is banned
  };
}

/**
 * ReviewManagement component - Administrative review management interface
 * Provides comprehensive review management functionality for administrators
 * Includes review listing, filtering, searching, and deletion operations
 * 
 * @returns JSX element representing the complete review management interface
 */
export const ReviewManagement: React.FC = () => {
  // State management for reviews data and UI
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<'ALL' | '1' | '2' | '3' | '4' | '5'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'EDITED' | 'ORIGINAL'>('ALL');

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

  /**
   * Fetches all reviews from the admin API
   * Retrieves review data including user information and edit status
   */
  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/getReviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the review deletion operation
   * Sends delete request to API and refreshes review list on success
   * 
   * @param reviewId - The ID of the review to delete
   * @param gameId - The ID of the game the review belongs to
   */
  const handleDeleteReview = async (reviewId: number, gameId: number) => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/review/deleteReview?gameId=${gameId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId })
      });

      const result = await response.json();
      
      if (response.ok) {
        fetchReviews(); // Refresh the list
      } else {
        alert(result.error || 'Error deleting review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  // Filter reviews based on search term, rating, and edit status
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === 'ALL' || review.rating.toString() === filterRating;
    
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'EDITED' && review.isEdited) ||
                         (filterStatus === 'ORIGINAL' && !review.isEdited);
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-color_hover rounded-lg w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-color_hover rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header and filters section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-color_text mb-4">Review Management</h2>
        
        {/* Search and filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text placeholder-color_text_sec"
          />
          
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value as any)}
            className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-border_detail rounded-lg bg-color_main text-color_text"
          >
            <option value="ALL">All Reviews</option>
            <option value="EDITED">Edited</option>
            <option value="ORIGINAL">Original</option>
          </select>
          
          <div className="text-sm text-color_text_sec flex items-center justify-center">
            {filteredReviews.length} reviews found
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              review.user.isBanned
                ? 'bg-red-50 border-red-200'
                : 'bg-color_main border-border_detail hover:border-border_detail_sec'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Review header with user info and rating */}
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={review.user.image || '/placeholder-user.webp'}
                    alt={`${review.user.name} avatar`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-color_text">{review.user.name}</h3>
                      {review.user.isBanned && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Banned
                        </span>
                      )}
                      {review.isEdited && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Edited
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-color_text_sec">
                      Review for Game ID: <span className="font-medium">{review.gameId}</span>
                    </p>
                    
                    <p className="text-xs text-color_text_sec">
                      {formatDistanceToNow(new Date(review.createdAt), { 
                        addSuffix: true, 
                        locale: enUS 
                      })}
                    </p>
                  </div>
                  
                  {/* Rating display */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-color_text">{review.rating}</span>
                      <span className="text-sm text-color_text_sec">/5</span>
                    </div>
                  </div>
                </div>
                
                {/* Review content */}
                <div className="bg-color_sec rounded-lg p-3 mb-3">
                  <p className="text-color_text text-sm leading-relaxed">
                    {review.content}
                  </p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleDeleteReview(review.id, review.gameId)}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Delete review"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 