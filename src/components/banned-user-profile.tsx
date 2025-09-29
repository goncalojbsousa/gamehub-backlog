'use client';

import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";
import Image from "next/image";
import { useState } from "react";
import { isGoogleImage } from "@/src/utils/imageUtils";

/**
 * Props interface for the BannedUserProfile component
 * Defines the required user data for displaying a banned profile
 */
interface BannedUserProfileProps {
  userImage: string;      // User's profile image URL
  name: string;           // User's display name
  userName: string;       // User's username
  joinDate: string | Date;// User's join date
}

/**
 * BannedUserProfile component - Displays a banned user's profile page
 * Shows profile information and a message indicating the account is banned
 * Handles image loading errors and formats join date for display
 * 
 * @param userImage - Profile image URL
 * @param name - User's display name
 * @param userName - User's username
 * @param joinDate - User's join date (string or Date)
 * @returns JSX element representing the banned user profile page
 */
export const BannedUserProfile: React.FC<BannedUserProfileProps> = ({ 
  userImage, 
  name, 
  userName, 
  joinDate 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const validUserImage = !imageError ? (userImage || "/placeholder-user.webp") : "/placeholder-user.webp";
  
  // Helper function to safely format the join date
  const formatJoinDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return 'Unknown';
      }
      return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  // Background style similar to home page
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
    <div className="min-h-screen flex flex-col">
      <main className="transition-colors duration-200 pt-24 relative flex-1 bg-background" style={mainStyle}>
        {/* Navigation bar */}
        <Navbar />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="relative z-10">
            <div className="container mx-auto px-4 lg:px-8 py-8">
            {/* Profile Header */}
            <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail relative overflow-hidden mb-8 animate-slide-in-up">
              {/* Content */}
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Image
                        src={validUserImage}
                        alt="User profile image"
                        width={120}
                        height={120}
                        className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-color_reverse_sec shadow-lg"
                        draggable={false}
                        onError={(e) => {
                          // Silently handle image loading errors without console logging
                          setImageError(true);
                          e.currentTarget.src = "/placeholder-user.webp";
                        }}
                        unoptimized={isGoogleImage(userImage)}
                      />
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-color_text mb-2">
                        {name}
                      </h1>
                      <p className="text-lg text-color_text_sec mb-2">@{userName}</p>
                      <p className="text-sm text-color_text_sec">
                        Member since {formatJoinDate(joinDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Banned message section */}
        <div className="container mx-auto px-4 lg:px-8 pb-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 shadow-lg animate-slide-in-up">
              <div className="text-5xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Account Suspended</h2>
              <p className="text-color_text_sec mb-4">
                This account has been suspended and is no longer accessible.
              </p>
              <p className="text-sm text-color_text_sec">
                If you believe this is a mistake, please contact support.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}; 