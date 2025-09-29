import React from 'react';
import { Navbar } from "@/src/components/navbar/navbar";
import { Footer } from "@/src/components/footer";
import { GameInfoSkeleton } from './game-info-skeleton';

export const GamePageSkeleton: React.FC = () => {
  return (
    <main className="transition-colors duration-200 pt-16 relative min-h-screen animate-pulse">
      <Navbar />
      <div className="relative z-10">
        {/* Hero Section Skeleton */}
        <div className="relative bg-gradient-to-b from-black/20 to-transparent">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            {/* Game Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                {/* Title skeleton */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <div className="h-8 bg-color_main rounded w-64"></div>
                  <div className="h-6 bg-color_main rounded w-32"></div>
                </div>
                
                {/* Tags skeleton */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-24 h-6 bg-color_main rounded-full"></div>
                  <div className="w-32 h-4 bg-color_main rounded"></div>
                </div>
              </div>

              {/* Action Buttons skeleton */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="w-32 h-10 bg-color_main rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Game Info Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <GameInfoSkeleton />
            </div>

            {/* Main Content Area Skeleton */}
            <div className="lg:col-span-3 space-y-8">
              {/* Screenshots Section Skeleton */}
              <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                <div className="h-6 bg-color_main rounded w-32 mb-4"></div>
                <div className="aspect-video bg-color_main rounded-lg"></div>
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="w-24 h-16 bg-color_main rounded-lg flex-shrink-0"></div>
                  ))}
                </div>
              </div>
              
              {/* Game Content Skeleton */}
              <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail space-y-6">
                <div className="h-6 bg-color_main rounded w-24"></div>
                
                {/* Summary skeleton */}
                <div className="space-y-3">
                  <div className="h-4 bg-color_main rounded w-full"></div>
                  <div className="h-4 bg-color_main rounded w-full"></div>
                  <div className="h-4 bg-color_main rounded w-5/6"></div>
                  <div className="h-4 bg-color_main rounded w-4/6"></div>
                </div>
                
                {/* Storyline skeleton */}
                <div>
                  <div className="h-6 bg-color_main rounded w-20 mb-3"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-color_main rounded w-full"></div>
                    <div className="h-4 bg-color_main rounded w-full"></div>
                    <div className="h-4 bg-color_main rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}; 