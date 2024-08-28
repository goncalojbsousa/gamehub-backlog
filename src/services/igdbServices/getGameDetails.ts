'use server'

import { checkRateLimit } from '@/src/utils/rateLimit';
import { headers } from 'next/headers';
import { fetchAllDeals } from '../cheapsharkServices/getAllDeals';
import { fetchAllStores } from '../cheapsharkServices/getAllStores';

interface Website {
    url: string;
    category: number;
}

interface Deal {
    steamAppID: string;
    salePrice: string;
    storeID?: string;
}

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
        const IGDB_API_URL = `${process.env.IGDB_API_URL}v4/games`;
        const origin = process.env.NEXTAUTH_URL;
        const clientID = process.env.IGDB_CLIENT;
        const authorization = 'Bearer ' + process.env.IGDB_SECRET;

        if (!origin || !clientID || !authorization) {
            throw new Error('Token or Origin not defined');
        }
        
        const response = await fetch(IGDB_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Origin': origin,
                'Client-ID' : clientID,
                'Authorization' : authorization,
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

                similar_games.name,
                similar_games.slug,
                similar_games.genres.name,
                similar_games.cover.url,

                bundles.name,
                bundles.slug,
                bundles.genres.name,
                bundles.cover.url,

                dlcs.name,
                dlcs.slug,
                dlcs.genres.name,
                dlcs.cover.url,

                expanded_games.name,
                expanded_games.slug,
                expanded_games.genres.name,
                expanded_games.cover.url,

                expansions.name,
                expansions.slug,
                expansions.genres.name,
                expansions.cover.url,

                forks.name,
                forks.slug,
                forks.genres.name,
                forks.cover.url,

                parent_game.name,
                parent_game.slug,
                parent_game.genres.name,
                parent_game.cover.url,

                remakes.name,
                remakes.slug,
                remakes.genres.name,
                remakes.cover.url,

                remasters.name,
                remasters.slug,
                remasters.genres.name,
                remasters.cover.url,

                standalone_expansions.name,
                standalone_expansions.slug,
                standalone_expansions.genres.name,
                standalone_expansions.cover.url,

                websites.url,
                websites.category,

                version_title,
                involved_companies;
            where slug = "${query}";
        `,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch game details from IGDB');
        }

        const data = await response.json();

        // EXTRACT STEAM APP IDS
        const steamId = data.flatMap((game: Game) => {
            const steamSite = game.websites?.find((site: Website) => site.category === 13);
            if (steamSite) {
                // MATCH THE STEAM APP ID FROM THE URL
                const match = steamSite.url.match(/\/(app|bundle)\/(\d+)/i);

                // RETURN THE STEAM APP ID ONLY
                return match ? match[2].toLowerCase() : [];
            }
            return [];
        });

        const deals = await fetchAllDeals(steamId);

        const allStores = await fetchAllStores();

        if (data.length === 1) {
            // ADD STORE INFO TO DEAL
            data[0].deals = deals.map((deal: Deal) => {
                const store = allStores.find(store => store.storeID === deal.storeID);
                return {
                    ...deal,
                    store: store ? {
                        storeName: store.storeName,
                        isActive: store.isActive,
                        images: store.images,
                    } : null
                };
            });
        }

        return data;

    } catch (error) {
        console.error('Error fetching game from IGDB:', error);
        throw new Error('An error occurred while fetching game. Please try again later.');
    }
};