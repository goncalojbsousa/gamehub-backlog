import React from 'react';

export const GameInfoSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Game Cover Skeleton */}
      <div className="bg-color_sec rounded-xl overflow-hidden shadow-lg border border-border_detail animate-pulse">
        <div className="aspect-[3/4] bg-color_main"></div>
      </div>

      {/* Ratings Section Skeleton */}
      <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail animate-pulse">
        <div className="h-6 bg-color_main rounded w-20 mb-4"></div>
        <div className="flex justify-center items-center space-x-6">
          <div className="w-12 h-12 bg-color_main rounded-full"></div>
          <div className="w-12 h-12 bg-color_main rounded-full"></div>
          <div className="w-12 h-12 bg-color_main rounded-full"></div>
        </div>
      </div>

      {/* Game Details Skeleton */}
      <div className="bg-color_sec rounded-xl p-6 shadow-lg space-y-6 border border-border_detail animate-pulse">
        <div className="h-6 bg-color_main rounded w-32"></div>
        
        {/* Genres Skeleton */}
        <div>
          <div className="h-5 bg-color_main rounded w-16 mb-2"></div>
          <div className="flex flex-wrap gap-2">
            <div className="w-20 h-6 bg-color_main rounded-full"></div>
            <div className="w-24 h-6 bg-color_main rounded-full"></div>
            <div className="w-16 h-6 bg-color_main rounded-full"></div>
          </div>
        </div>

        {/* Themes Skeleton */}
        <div>
          <div className="h-5 bg-color_main rounded w-16 mb-2"></div>
          <div className="flex flex-wrap gap-2">
            <div className="w-20 h-6 bg-color_main rounded-full"></div>
            <div className="w-24 h-6 bg-color_main rounded-full"></div>
          </div>
        </div>

        {/* Release Date Skeleton */}
        <div>
          <div className="h-5 bg-color_main rounded w-24 mb-2"></div>
          <div className="h-4 bg-color_main rounded w-32"></div>
        </div>

        {/* Platforms Skeleton */}
        <div>
          <div className="h-5 bg-color_main rounded w-20 mb-2"></div>
          <div className="flex flex-wrap gap-2">
            <div className="w-16 h-6 bg-color_main rounded-full"></div>
            <div className="w-20 h-6 bg-color_main rounded-full"></div>
            <div className="w-18 h-6 bg-color_main rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Language Support Skeleton */}
      <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-color_main rounded w-32"></div>
          <div className="w-4 h-4 bg-color_main rounded"></div>
        </div>
      </div>

      {/* Share Section Skeleton */}
      <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail animate-pulse">
        <div className="h-6 bg-color_main rounded w-32 mb-4"></div>
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-color_main rounded-lg"></div>
          <div className="w-10 h-10 bg-color_main rounded-lg"></div>
          <div className="w-10 h-10 bg-color_main rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}; 