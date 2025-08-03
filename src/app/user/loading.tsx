'use client';

import React from 'react';
import { Navbar } from "@/src/components/navbar/navbar";
import { Footer } from "@/src/components/footer";

const ProfileLoading: React.FC = () => {
  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background">
      <Navbar />

      {/* Profile Header Skeleton */}
      <div className="bg-gradient-to-b from-black/20 to-transparent">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center space-x-6 animate-pulse">
            {/* Avatar skeleton */}
            <div className="w-24 h-24 bg-color_main rounded-full"></div>
            
            {/* User info skeleton */}
            <div className="flex-1">
              <div className="h-8 bg-color_main rounded w-48 mb-2"></div>
              <div className="h-5 bg-color_main rounded w-32 mb-2"></div>
              <div className="h-4 bg-color_main rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Skeleton */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail animate-pulse space-y-6">
              <div className="h-6 bg-color_main rounded w-32"></div>
              <div className="space-y-4">
                <div className="h-4 bg-color_main rounded w-full"></div>
                <div className="h-4 bg-color_main rounded w-3/4"></div>
                <div className="h-4 bg-color_main rounded w-5/6"></div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-3">
            <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail animate-pulse">
              <div className="h-8 bg-color_main rounded w-48 mb-6"></div>
              
              {/* Game cards grid skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="bg-color_main rounded-xl overflow-hidden shadow-lg">
                    <div className="aspect-[3/4] bg-color_sec relative">
                      <div className="absolute top-2 left-2 w-16 h-6 bg-color_main rounded-lg"></div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-color_sec rounded w-3/4"></div>
                      <div className="h-3 bg-color_sec rounded w-1/2"></div>
                      <div className="flex justify-between items-center">
                        <div className="w-8 h-8 bg-color_sec rounded-full"></div>
                        <div className="w-12 h-6 bg-color_sec rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
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

export default ProfileLoading; 