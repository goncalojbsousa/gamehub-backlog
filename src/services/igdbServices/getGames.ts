'use server'

import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { fetchAllDeals } from '../cheapsharkServices/getAllDeals';

type ListType = 'popular' | 'recent' | 'popular2024' | 'upcoming';

interface Website {
    url: string;
    category: number;
}

interface Deal {
    steamAppID: string;
    salePrice: string;
}

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
        const IGDB_API_URL = `${process.env.IGDB_API_URL}v4/games`;
        const origin = process.env.NEXTAUTH_URL;
        const clientID = process.env.IGDB_CLIENT;
        const authorization = 'Bearer ' + process.env.IGDB_SECRET;

        if (!origin || !clientID || !authorization) {
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
                            fields name, slug, cover.url, genres.name, first_release_date, platforms.name, total_rating, aggregated_rating, rating, total_rating, websites.url, websites.category, screenshots.url;
                            where cover.url != null
                                & first_release_date >= ${new Date(currentYear, 0, 1).getTime() / 1000} 
                                & first_release_date < ${new Date(currentYear + 1, 0, 1).getTime() / 1000};
                            sort total_rating_count desc;
                            limit ${limit / listTypes.length};
                        `;
                        break;
                    case 'recent':
                        query = `
                            fields name, slug, cover.url, genres.name, first_release_date, platforms.name, total_rating, aggregated_rating, rating, total_rating, websites.url, websites.category, screenshots.url;
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
                            fields name, slug, cover.url, genres.name, first_release_date, platforms.name, total_rating, aggregated_rating, rating, total_rating, websites.url, websites.category, screenshots.url;
                            where first_release_date > ${oneYearAgo};
                            sort total_rating_count desc;
                            limit ${limit / listTypes.length};
                        `;
                        break;
                    case 'upcoming':
                        query = `
                            fields name, slug, cover.url, genres.name, first_release_date, platforms.name, total_rating, aggregated_rating, rating, total_rating, websites.url, websites.category, screenshots.url, hypes;
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
                        'Origin': origin,
                        'Client-ID' : clientID,
                        'Authorization' : authorization,
                    },
                    body: query,
                }).then(response => response.json());
            })
        );

        const data: Game[] = responses;

        const flattenedData: Game[] = data.flat();

        // EXTRACT STEAM APP IDS
        const steamIds = flattenedData.flatMap((game: Game) => {
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
        const enhancedData = flattenedData.map((game: Game) => {
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

        const groupSize = 12;
        const groupedData = [];
        
        for (let i = 0; i < enhancedData.length; i += groupSize) {
            groupedData.push(enhancedData.slice(i, i + groupSize));
        }
        
        return groupedData;

    } catch (error) {
        console.error('Error fetching games list from IGDB:', error);
        throw new Error('An error occurred while fetching games list. Please try again later.');
    }
};