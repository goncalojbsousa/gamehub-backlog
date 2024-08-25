'use server'

import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';

/**
 * 
 * @param query Search tearm that the user introduced
 * @returns {Game[]} Array of games
 */
export const fetchGamesBySearch = async (query: string): Promise<Game[]> => {

    if (!/^[\p{L}\p{N} áàâãéèêíïóôõöúçñ:_\-']{1,100}$/u.test(query)) {
        throw new Error('Invalid query');
    }

    // GET CLIENT IP
    const headersList = headers();
    const clientIp = headersList.get('x-forwarded-for') || 'unknown';

    if (typeof clientIp !== 'string') {
        throw new Error('Access temporarily blocked. Try again later.');
    }

    if (clientIp === 'unknown') {
        throw new Error('Access temporarily blocked. Try again later.');
    }

    if (!(await checkRateLimit(clientIp))) {
        throw new Error('Limit rate exceeded. Try again later.');
    }

    try {
        const IGDB_PROXY_URL = process.env.IGDB_PROXY_URL;
        const IGDB_API_URL = `${IGDB_PROXY_URL}v4/games`;
        const apiToken = process.env.IGDB_SECRET;

        const origin = process.env.NEXTAUTH_URL;

        if (!apiToken || !origin) {
            throw new Error('Token or Origin not defined');
        }

        const response = await fetch(IGDB_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'x-api-key': apiToken,
                'Origin': origin,
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

        if (!response.ok) {
            throw new Error('Failed to fetch games from IGDB');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching games from IGDB:', error);
        throw new Error('An error occurred while searching for games. Please try again later.');
    }
}