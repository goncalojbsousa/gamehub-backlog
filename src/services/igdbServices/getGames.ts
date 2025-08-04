'use server'

import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { fetchAllDeals } from '../cheapsharkServices/getAllDeals';

/**
 * Supported list types for fetching games
 * Defines different categories of games that can be retrieved
 */
type ListType = 'popular' | 'recent' | 'popular2024' | 'upcoming';

/**
 * Interface for website information from IGDB
 * Contains URL and category information for game websites
 */
interface Website {
    url: string;
    category: number; // IGDB website category (13 = Steam)
}

/**
 * Interface for game deals from CheapShark
 * Contains Steam app ID and sale price information
 */
interface Deal {
    steamAppID: string;
    salePrice: string;
}

/**
 * Fetches games list from IGDB API with optional price data from CheapShark
 * Supports multiple list types and includes rate limiting and error handling
 * 
 * @param listTypes - Array of list types to fetch (popular, recent, etc.)
 * @param limit - Total number of games to fetch (distributed across list types)
 * @returns Promise resolving to grouped game data with pricing information
 */
export const fetchGamesList = async (listTypes: ListType[], limit: number = 20) => {
    // Extract client IP address for rate limiting
    const headersList = await headers();
    const clientIp = headersList.get('x-forwarded-for') || 'unknown';

    // Validate IP address format and presence
    if (typeof clientIp !== 'string' || clientIp === 'unknown') {
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

        // Calculate date ranges for different list types
        const currentYear = new Date().getFullYear();
        const currentDate = Math.floor(Date.now() / 1000); // Current date in UNIX timestamp
        const oneYearAgo = currentDate - (10 * 365 * 24 * 60 * 60); // UNIX timestamp for one year ago (365 days)

        // Fetch games data for all requested list types in parallel
        const responses = await Promise.all(
            listTypes.map((listType) => {
                let query = '';
                
                // Build IGDB query based on list type
                switch (listType) {
                    case 'popular2024':
                        // Games from current year sorted by rating count
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
                        // Games released in the last year
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
                        // Popular games from the last 10 years
                        query = `
                            fields name, slug, cover.url, genres.name, first_release_date, platforms.name, total_rating, aggregated_rating, rating, total_rating, websites.url, websites.category, screenshots.url;
                            where first_release_date > ${oneYearAgo};
                            sort total_rating_count desc;
                            limit ${limit / listTypes.length};
                        `;
                        break;
                    case 'upcoming':
                        // Upcoming games sorted by hype
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

                // Make API request to IGDB
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

        // Process and flatten the responses
        const data: Game[] = responses;
        const flattenedData: Game[] = data.flat();

        // Extract Steam app IDs from game websites for price lookup
        const steamIds = flattenedData.flatMap((game: Game) => {
            const steamSite = game.websites?.find((site: Website) => site.category === 13);
            if (steamSite) {
                // Extract Steam app ID from the URL using regex
                const match = steamSite.url.match(/\/(app|bundle)\/(\d+)/i);
                return match ? match[2].toLowerCase() : [];
            }
            return [];
        });

        // Debug logging for Steam ID extraction
        console.log(`[DEBUG] Games list - Steam IDs found:`, steamIds.length, 'unique IDs');

        // Fetch pricing data from CheapShark for Steam games
        let prices: Record<string, string> = {};
        if (steamIds.length > 0) {
            try {
                const allDeals = await fetchAllDeals(steamIds);
                console.log(`[DEBUG] Found ${allDeals.length} deals for ${steamIds.length} Steam IDs`);
                
                // Create price lookup map, keeping the lowest price for each game
                prices = allDeals.reduce((acc: Record<string, string>, deal: Deal) => {
                    const steamAppID = deal.steamAppID.toLowerCase();
                    if (!acc[steamAppID] || parseFloat(deal.salePrice) < parseFloat(acc[steamAppID])) {
                        acc[steamAppID] = deal.salePrice;
                    }
                    return acc;
                }, {});
            } catch (error) {
                console.error('Error fetching deals from CheapShark:', error);
                // Continue without prices if deals fetch fails
            }
        } else {
            console.log(`[DEBUG] No Steam IDs found for games list`);
        }

        // Enhance game data with pricing information
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

        // Group games into chunks for pagination/display
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