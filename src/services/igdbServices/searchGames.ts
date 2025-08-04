'use server'

import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';

/**
 * Fetches games from IGDB API based on search query
 * Performs a text search against the IGDB database to find matching games
 * Includes rate limiting, input validation, and error handling
 * 
 * @param query - Search term that the user introduced
 * @returns Promise resolving to array of matching games
 * @throws Error if query is invalid, rate limit exceeded, or API call fails
 */
export const fetchGamesBySearch = async (query: string): Promise<Game[]> => {

    // Validate search query format and length
    if (!/^[\p{L}\p{N} áàâãéèêíïóôõöúçñ:_\-']{1,100}$/u.test(query)) {
        throw new Error('Invalid query');
    }

    // Extract client IP address for rate limiting
    const headersList = await headers();
    const clientIp = headersList.get('x-forwarded-for') || 'unknown';

    // Validate IP address format and presence
    if (typeof clientIp !== 'string') {
        throw new Error('Access temporarily blocked. Try again later.');
    }

    if (clientIp === 'unknown') {
        throw new Error('Access temporarily blocked. Try again later.');
    }

    // Check rate limiting to prevent API abuse
    if (!(await checkRateLimit(clientIp))) {
        throw new Error('Rate limit exceeded. Try again later.');
    }

    try {
        // IGDB API configuration
        const IGDB_API_URL = `${process.env.IGDB_API_URL}v4/games`;
        const origin = process.env.NEXTAUTH_URL;
        const clientID = process.env.IGDB_CLIENT;
        const authorization = 'Bearer ' + process.env.IGDB_SECRET;

        // Validate required environment variables
        if (!origin || !clientID || !authorization) {
            throw new Error('Token or Origin not defined');
        }

        // Make API request to IGDB with search query
        const response = await fetch(IGDB_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Origin': origin,
                'Client-ID' : clientID,
                'Authorization' : authorization,
            },
            body: `
                search "${query}";
                fields 
                    name,
                    cover.url,
                    genres.name,
                    total_rating,
                    category,
                    first_release_date,
                    platforms.name,
                    slug;
                where 
                    first_release_date != null;
                limit 5;
            `,
        });

        // Handle API response errors
        if (!response.ok) {
            throw new Error('Failed to fetch games from IGDB');
        }

        // Parse and return the search results
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching games from IGDB:', error);
        throw new Error('An error occurred while searching for games. Please try again later.');
    }
}