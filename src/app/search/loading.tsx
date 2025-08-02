'use client';

import React from 'react';
import { Navbar } from "@/src/components/navbar/navbar";
import { Footer } from "@/src/components/footer";
import { GameSectionSkeleton } from '@/src/components/skeleton';

const SearchLoading: React.FC = () => {
  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-color_bg">
      <Navbar />

      {/* Search Header Skeleton */}
      <div className="bg-gradient-to-b from-black/20 to-transparent">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-color_main rounded w-48 mb-4"></div>
            <div className="h-6 bg-color_main rounded w-64"></div>
          </div>
        </div>
      </div>

      {/* Search Results Skeleton */}
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <GameSectionSkeleton cardCount={12} />
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
};

export default SearchLoading; 