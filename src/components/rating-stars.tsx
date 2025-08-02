import React, { useState } from 'react';

interface RatingStarsProps {
  score: number;
  size?: number;
  showScore?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  score,
  size = 20,
  showScore = false,
  interactive = false,
  onRatingChange,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  const normalizedScore = Math.min(100, Math.max(0, score));
  const starRating = normalizedScore / 20; // Converte para escala de 5 estrelas
  
  const getStarColor = (starIndex: number, currentRating: number) => {
    const fillPercentage = Math.max(0, Math.min(1, currentRating - starIndex));
    
    if (fillPercentage === 0) {
      return 'var(--color_main)'; // Estrela vazia
    } else if (fillPercentage === 1) {
      return '#F59E0B'; // Estrela cheia
    } else {
      return '#F59E0B'; // Estrela parcialmente preenchida
    }
  };

  const handleStarClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      const newRating = (starIndex + 1) * 20; // Converte de volta para escala de 100
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex + 1);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
      setIsHovering(false);
    }
  };

  const currentRating = isHovering ? hoverRating : starRating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div 
        className="flex items-center"
        onMouseLeave={handleMouseLeave}
      >
        {[0, 1, 2, 3, 4].map((starIndex) => (
          <div
            key={starIndex}
            className={`transition-all duration-200 ${
              interactive ? 'cursor-pointer hover:scale-110' : ''
            }`}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all duration-200"
            >
              {/* Estrela de fundo (sempre visível) */}
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="var(--color_main)"
                opacity="0.3"
              />
              
              {/* Estrela preenchida */}
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill={getStarColor(starIndex, currentRating)}
                opacity={currentRating > starIndex ? 1 : 0}
                className="transition-all duration-200"
              />
            </svg>
          </div>
        ))}
      </div>
      
      {showScore && (
        <span className="text-color_text_sec text-sm font-medium ml-2">
          {normalizedScore}/100
        </span>
      )}
    </div>
  );
}; 