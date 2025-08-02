import React from 'react';

export const GameCardSkeleton: React.FC = () => {
  return (
    <div className="bg-color_sec rounded-xl overflow-hidden shadow-lg animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[3/4] bg-color_main relative">
        <div className="absolute top-2 left-2 w-16 h-6 bg-color_sec rounded-lg"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        {/* Title skeleton */}
        <div className="h-4 bg-color_main rounded w-3/4"></div>
        
        {/* Genres skeleton */}
        <div className="h-3 bg-color_main rounded w-1/2"></div>
        
        {/* Bottom section skeleton */}
        <div className="flex justify-between items-center">
          {/* Rating skeleton */}
          <div className="w-8 h-8 bg-color_main rounded-full"></div>
          
          {/* Price skeleton */}
          <div className="w-12 h-6 bg-color_main rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}; 