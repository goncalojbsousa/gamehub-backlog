'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/navbar/navbar';
import { Footer } from '@/src/components/footer';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="transition-colors duration-200 pt-24 relative min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className='flex flex-col justify-center items-center flex-grow text-color_text'>
                <h1 className='text-3xl font-bold bg-color_error rounded p-2'>404 - Page Not Found</h1>
                <p className='text-lg mb-4 mt-2'>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
                <button 
                    className='px-4 py-2 bg-color_reverse_sec hover:bg-color_reverse text-color_main rounded-lg transition-colors'
                    onClick={() => router.push('/')}>
                    Go back to Home
                </button>
            </main>
            <Footer />
        </div>
    );
}
