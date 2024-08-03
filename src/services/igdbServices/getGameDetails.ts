'use server'

import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';


export const fetchGameDetails = async (query: string) => {

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
        const clientID = process.env.IGDB_CLIENT_ID;
        const accessToken = process.env.IGDB_ACCESS_TOKEN;

        const origin = process.env.NEXTAUTH_URL;

        if (!clientID || !accessToken || !origin) {
            throw new Error('Client ID or Access Token or Origin not defined');
        }
        const response = await fetch(IGDB_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': clientID,
                'Authorization': `Bearer ${accessToken}`,
                'Origin': origin,
            },
            body: `
            fields 
                name, 
                cover.url, 
                summary, 
                storyline,

                genres.name, 
                category,
                themes.name,
                language_supports.language.native_name,
                language_supports.language_support_type.name,
                age_ratings.rating_cover_url,
                age_ratings.synopsis,
                age_ratings.rating,

                aggregated_rating,
                rating,
                total_rating, 

                first_release_date,
                release_dates.human, 
                platforms.name, 
                screenshots.url,
                player_perspectives.name,
                game_modes.name,
                version_title,

                involved_companies.company.name,
                involved_companies.company.logo.url,
                involved_companies.developer,
                involved_companies.porting,
                involved_companies.publisher,
                involved_companies.supporting,

                game_localizations.name,
                game_engines.name,

                status,
                
                language_supports,

                


                version_title,
                involved_companies;
            where slug = "${query}";
        `,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch game details from IGDB');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching game from IGDB:', error);
        throw new Error('An error occurred while fetching game. Please try again later.');
    }
};