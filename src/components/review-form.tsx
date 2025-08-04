"use client";

import { useState } from "react";
import { RatingStars } from "@/src/components/rating-stars";

interface ReviewFormProps {
  gameId: number;
  initialRating?: number;
  initialContent?: string;
  onSubmit: (rating: number, content: string) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  gameId,
  initialRating = 0,
  initialContent = "",
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, content);
    } catch (error) {
      console.error("Erro ao submeter review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-color_reverse_sec rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-color_main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-color_text text-xl">
            {isEditing ? "Edit Review" : "Write Review"}
          </h3>
          <p className="text-color_text_sec text-sm">
            {isEditing ? "Update your opinion about this game" : "Share your opinion about this game"}
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div className="space-y-3">
          <label className="block text-color_text text-base font-semibold">
            Rating *
          </label>
          <div className="flex items-center justify-between bg-color_main rounded-xl p-4 border border-border_detail">
            <RatingStars 
              score={rating * 20} 
              size={32} 
              interactive={true}
              onRatingChange={(newRating) => setRating(newRating / 20)}
            />
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-color_text">
                {rating > 0 ? rating : "0"}
              </span>
              <span className="text-xl text-color_text_sec">/5</span>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="space-y-3">
          <label htmlFor="content" className="block text-color_text text-base font-semibold">
            Opinion (optional)
          </label>
          <div className="relative">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
                             placeholder="Share your opinion about this game... (maximum 2000 characters)"
                             className="w-full px-4 py-3 border border-border_detail rounded-xl bg-color_main text-color_text placeholder-color_text_sec focus:outline-none focus:ring-2 focus:ring-color_reverse_sec focus:border-transparent"
              rows={5}
                             maxLength={2000}
            />
            <div className="absolute bottom-3 right-3 text-xs text-color_text_sec bg-color_main px-2 py-1 rounded">
                             {content.length}/2000
            </div>
          </div>
          <p className="text-xs text-color_text_sec">
            Describe what you liked or disliked, game mechanics, graphics, story, etc.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="flex-1 bg-color_reverse_sec text-color_main font-semibold py-3 px-6 rounded-xl hover:bg-color_reverse transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : (
              isEditing ? "Update Review" : "Publish Review"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-border_detail text-color_text rounded-xl hover:bg-color_hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}; 