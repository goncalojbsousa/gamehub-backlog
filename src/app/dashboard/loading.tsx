'use client';

import React from 'react';
import { Navbar } from "@/src/components/navbar/navbar";
import { Footer } from "@/src/components/footer";

const DashboardLoading: React.FC = () => {
  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background">
      <Navbar />

      {/* Dashboard Header Skeleton */}
      <div className="bg-gradient-to-b from-black/20 to-transparent">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-color_main rounded w-64 mb-4"></div>
            <div className="h-6 bg-color_main rounded w-96"></div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Skeleton */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stats Cards Skeleton */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail animate-pulse">
              <div className="h-6 bg-color_main rounded w-32 mb-4"></div>
              <div className="h-12 bg-color_main rounded w-24 mb-2"></div>
              <div className="h-4 bg-color_main rounded w-48"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="mt-8 bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail animate-pulse">
          <div className="h-8 bg-color_main rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-color_main rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-color_main rounded w-3/4"></div>
                  <div className="h-3 bg-color_main rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-color_main rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
};

export default DashboardLoading; 