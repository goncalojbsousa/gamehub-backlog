'use server'

import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';

/**
 * 
 * @param query Search term that the user introduced
 * @param filters Object containing arrays of selected filters
 * @returns {Game[]} Array of games
 */
export const fetchGamesBySearchFilter = async (
    query: string,
    filters: {
        genres?: string[],
        themes?: string[],
        platforms?: string[],
        perspectives?: string[],
        gameModes?: string[]
    }
): Promise<Game[]> => {

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

        let whereClause = 'cover != null';

        const addFilterCondition = (field: string, values: string[] | undefined) => {
            if (values && values.length > 0) {
                const valuesString = values.map(v => `"${v}"`).join(',');
                whereClause += ` & ${field}.name = (${valuesString})`;
            }
        };

        console.log('Filters:', filters);
        console.log('Where clause:', whereClause);

        addFilterCondition('genres', filters.genres);
        addFilterCondition('themes', filters.themes);
        addFilterCondition('platforms', filters.platforms);
        addFilterCondition('player_perspectives', filters.perspectives);
        addFilterCondition('game_modes', filters.gameModes);

        console.log(`Query being sent to IGDB: search "${query}"; fields ...; where ${whereClause}; limit 20;`);

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
                    themes.name,
                    platforms.name,
                    player_perspectives.name,
                    game_modes.name,
                    total_rating, aggregated_rating, rating,
                    category,
                    first_release_date,
                    slug;
                where ${whereClause};
                limit 20;
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