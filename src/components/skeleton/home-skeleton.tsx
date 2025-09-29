import React from 'react';
import { Navbar } from "@/src/components/navbar/navbar";
import { Footer } from "@/src/components/footer";
import { GameSectionSkeleton } from './game-section-skeleton';

export const HomeSkeleton: React.FC = () => {
  const mainStyle = {
    backgroundImage: `
        linear-gradient(to bottom, var(--gradient-start), var(--background)),
        url(/login-bg.webp)
    `,
    backgroundSize: '100% 1200px',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'var(--background)',
  };

  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background" style={mainStyle}>
      <Navbar />

      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
        </div>

        <div className="relative z-10">
          {/* Introduction Section Skeleton */}
          <div className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center space-y-6 animate-pulse">
                {/* Title skeleton */}
                <div className="h-12 bg-color_main rounded-lg w-3/4 mx-auto"></div>
                
                {/* Subtitle skeleton */}
                <div className="h-6 bg-color_main rounded w-1/2 mx-auto"></div>
                
                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-color_main rounded w-full"></div>
                  <div className="h-4 bg-color_main rounded w-5/6 mx-auto"></div>
                  <div className="h-4 bg-color_main rounded w-4/6 mx-auto"></div>
                </div>
                
                {/* Button skeleton */}
                <div className="h-12 bg-color_main rounded-lg w-48 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          {/* Trending Now Section */}
          <GameSectionSkeleton cardCount={6} />
          
          {/* Best of 2024 Section */}
          <GameSectionSkeleton cardCount={6} />
          
          {/* Recently Released Section */}
          <GameSectionSkeleton cardCount={6} />
          
          {/* Coming Soon Section */}
          <GameSectionSkeleton cardCount={6} />
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}; 