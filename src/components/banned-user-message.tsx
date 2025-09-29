'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

/**
 * BannedUserMessage component - Displays account suspension notification
 * Checks user's ban status and displays a modal if the user is banned
 * Prevents banned users from accessing site functionality
 * Automatically signs out the user when they acknowledge the ban
 * 
 * @returns JSX element for ban notification modal or null if not banned
 */
export default function BannedUserMessage() {
  const [isBanned, setIsBanned] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Checks the user's ban status by making an API call
     * Updates the component state based on the response
     */
    const checkBanStatus = async () => {
      try {
        const response = await fetch('/api/user/checkBanStatus');
        if (response.ok) {
          const result = await response.json();
          setIsBanned(result.isBanned);
        } else {
          setIsBanned(false);
        }
      } catch (error) {
        console.error('Error checking ban status:', error);
        setIsBanned(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBanStatus();
  }, []);

  /**
   * Handles user sign out when they acknowledge the ban
   * Redirects to home page after sign out
   */
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  // Don't render anything if user is not banned
  if (!isBanned) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-color_sec rounded-xl p-8 max-w-md mx-4 border border-border_detail shadow-2xl">
        <div className="text-center">
          {/* Ban icon */}
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
          
          {/* Ban message */}
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Account Suspended
          </h2>
          
          <p className="text-color_text_sec mb-6">
            Your account has been suspended for violating the terms of use. 
            You cannot access any site functionality.
          </p>
          
          <p className="text-sm text-color_text_sec mb-6">
            If you believe this was an error, contact the support team.
          </p>
          
          {/* Sign out button */}
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
} 