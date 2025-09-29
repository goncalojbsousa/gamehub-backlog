import React from 'react';
import { GameCardSkeleton } from './game-card-skeleton';

interface GameSectionSkeletonProps {
  title?: string;
  cardCount?: number;
}

export const GameSectionSkeleton: React.FC<GameSectionSkeletonProps> = ({ 
  title = "Loading...", 
  cardCount = 6 
}) => {
  return (
    <div className="mb-16">
      {/* Section Header Skeleton */}
      <div className="relative mb-8">
        <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail relative overflow-hidden animate-pulse">
          {/* Background skeleton */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-color_main opacity-10 rounded-xl"></div>
          
          {/* Title skeleton */}
          <div className="relative z-10">
            <div className="h-8 bg-color_main rounded w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Games Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {Array.from({ length: cardCount }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}; 