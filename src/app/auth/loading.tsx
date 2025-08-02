'use client';

import React from 'react';
import { Navbar } from "@/src/components/navbar/navbar";
import { Footer } from "@/src/components/footer";

const AuthLoading: React.FC = () => {
  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-color_bg">
      <Navbar />

      {/* Auth Content Skeleton */}
      <div className="flex-grow flex justify-center items-center p-10">
        <div className="max-w-md w-full">
          <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail animate-pulse space-y-6">
            {/* Title skeleton */}
            <div className="text-center">
              <div className="h-8 bg-color_main rounded w-48 mx-auto mb-4"></div>
              <div className="h-5 bg-color_main rounded w-64 mx-auto"></div>
            </div>
            
            {/* Form skeleton */}
            <div className="space-y-4">
              <div>
                <div className="h-5 bg-color_main rounded w-20 mb-2"></div>
                <div className="h-12 bg-color_main rounded w-full"></div>
              </div>
              <div>
                <div className="h-5 bg-color_main rounded w-24 mb-2"></div>
                <div className="h-12 bg-color_main rounded w-full"></div>
              </div>
              <div className="pt-4">
                <div className="h-12 bg-color_main rounded-lg w-full"></div>
              </div>
            </div>
            
            {/* Divider skeleton */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 h-px bg-color_main"></div>
              <div className="h-4 bg-color_main rounded w-16"></div>
              <div className="flex-1 h-px bg-color_main"></div>
            </div>
            
            {/* Social login skeleton */}
            <div className="space-y-3">
              <div className="h-12 bg-color_main rounded-lg w-full"></div>
              <div className="h-12 bg-color_main rounded-lg w-full"></div>
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

export default AuthLoading; 