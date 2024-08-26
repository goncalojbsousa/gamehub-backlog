'use server'

import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { fetchAllDeals } from '@/src/services/cheapsharkServices/getAllDeals';

interface Website {
    url: string;
    category: number;
}

interface Deal {
    steamAppID: string;
    salePrice: string;
}

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
        const IGDB_API_URL = `${process.env.IGDB_API_URL}v4/games`;
        const origin = process.env.NEXTAUTH_URL;
        const clientID = process.env.IGDB_CLIENT;
        const authorization = 'Bearer ' + process.env.IGDB_SECRET;

        if (!origin || !clientID || !authorization) {
            throw new Error('Token or Origin not defined');
        }

        let whereClause = 'cover != null';

        const addFilterCondition = (field: string, values: string[] | undefined) => {
            if (values && values.length > 0) {
                const valuesString = values.map(v => `"${v}"`).join(',');
                whereClause += ` & ${field}.name = (${valuesString})`;
            }
        };

        addFilterCondition('genres', filters.genres);
        addFilterCondition('themes', filters.themes);
        addFilterCondition('platforms', filters.platforms);
        addFilterCondition('player_perspectives', filters.perspectives);
        addFilterCondition('game_modes', filters.gameModes);

        const response = await fetch(IGDB_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Origin': origin,
                'Client-ID': clientID,
                'Authorization': authorization,
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
                    websites.url,
                    websites.category,
                    slug;
                where ${whereClause};
                limit 20;
            `,

        });

        if (!response.ok) {
            throw new Error('Failed to fetch games from IGDB');
        }

        const data: Game[] = await response.json();

        // EXTRACT STEAM APP IDS
        const steamIds = data.flatMap((game: Game) => {
            const steamSite = game.websites?.find((site: Website) => site.category === 13);
            if (steamSite) {
                // MATCH THE STEAM APP ID FROM THE URL
                const match = steamSite.url.match(/\/(app|bundle)\/(\d+)/i);

                // RETURN THE STEAM APP ID ONLY
                return match ? match[2].toLowerCase() : [];
            }
            return [];
        });

        let prices: Record<string, string> = {};
        if (steamIds.length > 0) {
            const allDeals = await fetchAllDeals(steamIds);
            prices = allDeals.reduce((acc: Record<string, string>, deal: Deal) => {
                const steamAppID = deal.steamAppID.toLowerCase();
                if (!acc[steamAppID] || parseFloat(deal.salePrice) < parseFloat(acc[steamAppID])) {
                    acc[steamAppID] = deal.salePrice;
                }
                return acc;
            }, {});
        }


        // ADD PRICES TO GAME DATA
        const enhancedData = data.map((game: Game) => {
            const steamSite = game.websites?.find((site: Website) => site.category === 13);
            if (steamSite) {
                const match = steamSite.url.match(/\/app\/(\d+)/i);
                if (match) {
                    const steamId = match[1].toLowerCase();
                    if (prices[steamId]) {
                        return { ...game, price: prices[steamId] };
                    }
                }
            }
            return game;
        });

        return enhancedData;

    } catch (error) {
        console.error('Error fetching games from IGDB:', error);
        throw new Error('An error occurred while searching for games. Please try again later.');
    }
}