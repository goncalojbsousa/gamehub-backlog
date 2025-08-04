'use client';

import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";
import Image from "next/image";
import { useState } from "react";
import { getValidImageUrl, isGoogleImage } from "@/src/utils/imageUtils";

interface BannedUserProfileProps {
  userImage: string;
  name: string;
  userName: string;
  joinDate: string | Date;
}

export const BannedUserProfile: React.FC<BannedUserProfileProps> = ({ 
  userImage, 
  name, 
  userName, 
  joinDate 
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Ensure we always have a valid image using the utility function
  const validUserImage = !imageError ? getValidImageUrl(userImage) : "/placeholder-user.webp";
  
  // Função auxiliar para formatar a data de forma segura
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
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background" style={mainStyle}>
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

      {/* Banned User Message */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Account Suspended
            </h2>
            
            <p className="text-color_text mb-6">
              This user has been banned for violating the terms of use. 
              The account cannot access any site functionality.
            </p>
            
            <p className="text-sm text-color_text_sec">
              If you believe this was an error, contact the support team.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}; 