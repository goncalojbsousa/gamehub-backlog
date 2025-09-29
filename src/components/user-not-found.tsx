'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/navbar/navbar';
import { Footer } from '@/src/components/footer';

/**
 * UserNotFound component - 404 error page for users
 * Displays a user-friendly error message when a user profile cannot be found
 * Provides navigation back to the home page
 * 
 * @returns JSX element representing the user not found error page
 */
export default function UserNotFound() {
    const router = useRouter();

    return (
        <div className="transition-colors duration-200 pt-24 relative min-h-screen flex flex-col justify-between">
            {/* Navigation bar */}
            <Navbar />
            
            {/* Main error content */}
            <main className='flex flex-col justify-center items-center flex-grow text-color_text'>
                {/* Error heading */}
                <h1 className='text-3xl font-bold bg-color_error rounded p-2'>UPS! User Not Found</h1>
                
                {/* Error description */}
                <p className='text-lg mb-4 mt-2'>Sorry, we couldn&apos;t find the user you&apos;re looking for.</p>
                
                {/* Navigation button back to home */}
                <button 
                    className='px-4 py-2 bg-color_reverse_sec hover:bg-color_reverse text-color_main rounded-lg transition-colors'
                    onClick={() => router.push('/')}>
                    Go back to Home
                </button>
            </main>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}
