'use client';

import React from 'react';
import { Navbar } from "@/src/components/navbar/navbar";
import { Footer } from "@/src/components/footer";

const SettingsLoading: React.FC = () => {
  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-color_bg">
      <Navbar />

      {/* Settings Header Skeleton */}
      <div className="bg-gradient-to-b from-black/20 to-transparent">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-color_main rounded w-48 mb-4"></div>
            <div className="h-6 bg-color_main rounded w-64"></div>
          </div>
        </div>
      </div>

      {/* Settings Content Skeleton */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail animate-pulse space-y-8">
            {/* Account Settings Section */}
            <div>
              <div className="h-8 bg-color_main rounded w-40 mb-6"></div>
              <div className="space-y-6">
                <div>
                  <div className="h-5 bg-color_main rounded w-24 mb-3"></div>
                  <div className="h-12 bg-color_main rounded w-full"></div>
                </div>
                <div>
                  <div className="h-5 bg-color_main rounded w-32 mb-3"></div>
                  <div className="h-12 bg-color_main rounded w-full"></div>
                </div>
                <div>
                  <div className="h-5 bg-color_main rounded w-28 mb-3"></div>
                  <div className="h-12 bg-color_main rounded w-full"></div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div>
              <div className="h-8 bg-color_main rounded w-36 mb-6"></div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-color_main rounded w-32"></div>
                  <div className="w-12 h-6 bg-color_main rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-color_main rounded w-40"></div>
                  <div className="w-12 h-6 bg-color_main rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-color_main rounded w-28"></div>
                  <div className="w-12 h-6 bg-color_main rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Save Button Skeleton */}
            <div className="pt-6">
              <div className="h-12 bg-color_main rounded-lg w-32"></div>
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

export default SettingsLoading; 