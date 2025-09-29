'use client';

import React from 'react';
import { Navbar } from "@/src/components/navbar/navbar";
import { Footer } from "@/src/components/footer";

const LegalLoading: React.FC = () => {
  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background">
      <Navbar />

      {/* Legal Header Skeleton */}
      <div className="bg-gradient-to-b from-black/20 to-transparent">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-color_main rounded w-48 mb-4"></div>
            <div className="h-6 bg-color_main rounded w-64"></div>
          </div>
        </div>
      </div>

      {/* Legal Content Skeleton */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail animate-pulse space-y-6">
            {/* Title skeleton */}
            <div className="h-8 bg-color_main rounded w-64 mb-6"></div>
            
            {/* Content paragraphs skeleton */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="h-5 bg-color_main rounded w-3/4"></div>
                <div className="h-4 bg-color_main rounded w-full"></div>
                <div className="h-4 bg-color_main rounded w-full"></div>
                <div className="h-4 bg-color_main rounded w-5/6"></div>
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

export default LegalLoading; 