'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/navbar/navbar';
import { Footer } from '@/src/components/footer';

interface ErrorProps {
    error: Error;
    reset: () => void;
}


export default function Error({ error, reset }: ErrorProps) {
    const router = useRouter();

    return (
        <div className="transition-colors duration-200 pt-24 relative min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className='flex flex-col justify-center items-center flex-grow text-color_text'>
                <h1 className='text-3xl font-bold bg-color_error rounded p-2'>Something went wrong!</h1>
                <p className='text-lg mb-4 mt-2'>
                    We encountered an unexpected error: {error.message}
                </p>
                <div className='flex space-x-4 justify-center itens-center'>
                    <button
                        onClick={reset}
                        className='px-4 py-2 bg-color_reverse_sec hover:bg-color_reverse text-color_main rounded-lg transition-colors'>
                        Try Again
                    </button>
                    <p className='text-color_text_sec'>or</p>
                    <button
                        className='px-4 py-2 bg-color_reverse_sec hover:bg-color_reverse text-color_main rounded-lg transition-colors'
                        onClick={() => router.push('/')}>
                        Go back to Home
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}