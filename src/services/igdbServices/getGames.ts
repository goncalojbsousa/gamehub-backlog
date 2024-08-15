'use server'

import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';

type ListType = 'popular' | 'recent' | 'popular2024' | 'upcoming';

export const fetchGamesList = async (listTypes: ListType[], limit: number = 20) => {
    // GET CLIENT IP
    const headersList = headers();
    const clientIp = headersList.get('x-forwarded-for') || 'unknown';

    if (typeof clientIp !== 'string' || clientIp === 'unknown') {
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

        const currentYear = new Date().getFullYear();

        const currentDate = Math.floor(Date.now() / 1000); // Current date in UNIX timestamp
        const oneYearAgo = currentDate - (10 * 365 * 24 * 60 * 60); // UNIX timestamp for one year ago (365 days)

        const responses = await Promise.all(
            listTypes.map((listType) => {
                let query = '';
                switch (listType) {
                    case 'popular2024':
                        query = `
                            fields name, slug, cover.url, genres.name, first_release_date, platforms.name, total_rating, aggregated_rating, rating, total_rating, screenshots.url;
                            where cover.url != null
                                & first_release_date >= ${new Date(currentYear, 0, 1).getTime() / 1000} 
                                & first_release_date < ${new Date(currentYear + 1, 0, 1).getTime() / 1000};
                            sort total_rating_count desc;
                            limit ${limit / listTypes.length};
                        `;
                        break;
                    case 'recent':
                        query = `
                            fields name, slug, cover.url, genres.name, first_release_date, platforms.name, total_rating, aggregated_rating, rating, total_rating, screenshots.url;
                            where first_release_date < ${Math.floor(Date.now() / 1000)}
                                & first_release_date > ${Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60)}
                                & cover.url != null
                                & slug != null;
                            sort first_release_date desc;
                            limit ${limit / listTypes.length};
                            `;
                        break;
                    case 'popular':
                        query = `
                            fields name, slug, cover.url, genres.name, first_release_date, platforms.name, total_rating, aggregated_rating, rating, total_rating, screenshots.url, websites;
                            where first_release_date > ${oneYearAgo};
                            sort total_rating_count desc;
                            limit ${limit / listTypes.length};
                        `;
                        break;
                    case 'upcoming':
                        query = `
                            fields name, slug, cover.url, genres.name, first_release_date, platforms.name, total_rating, aggregated_rating, rating, total_rating, screenshots.url, hypes;
                            where first_release_date > ${Math.floor(Date.now() / 1000)}
                                & cover.url != null;
                            sort total_rating_count asc;
                            limit ${limit / listTypes.length};
                        `;
                        break;
                    default:
                        throw new Error('Invalid list type');
                }

                return fetch(IGDB_API_URL, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'x-api-key': apiToken,
                        'Origin': origin,
                    },
                    body: query,
                }).then(response => response.json());
            })
        );

        return responses;

    } catch (error) {
        console.error('Error fetching games list from IGDB:', error);
        throw new Error('An error occurred while fetching games list. Please try again later.');
    }
};