'use server'

import { checkRateLimit } from "@/src/utils/rateLimit";
import { headers } from "next/headers";

interface Website {
    url: string;
    category: number;
}

interface Deal {
    steamAppID: string;
    salePrice: string;
}

async function fetchAllDeals(steamIds: string[]): Promise<Deal[]> {
    const ITEMS_PER_PAGE = 60; // Limite do CheapShark
    let allDeals: Deal[] = [];
    let pageNumber = 0;
    let hasMorePages = true;

    while (hasMorePages) {
        const cheapSharkUrl = `https://www.cheapshark.com/api/1.0/deals?steamAppID=${steamIds.join(',')}&pageNumber=${pageNumber}&pageSize=${ITEMS_PER_PAGE}`;
        console.log(`Fetching prices from CheapShark: ${cheapSharkUrl}`);

        const priceResponse = await fetch(cheapSharkUrl);
        if (priceResponse.ok) {
            const priceData: Deal[] = await priceResponse.json();
            allDeals = allDeals.concat(priceData);

            // Verifica se há mais páginas
            const totalPageCount = parseInt(priceResponse.headers.get('X-Total-Page-Count') || '0');

            // Ajuste para considerar o X-Total-Page-Count começando em 0
            hasMorePages = pageNumber < totalPageCount;
            pageNumber++;
        } else {
            console.error(`Failed to fetch prices from CheapShark for page ${pageNumber}`);
            hasMorePages = false;
        }
    }

    return allDeals;
}


export const fetchGameDetailsByIds = async (gameIds: number[]) => {

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

        const numberOfGames = gameIds.length;

        const response = await fetch(IGDB_API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'x-api-key': apiToken,
                'Origin': origin,
            },
            body: `
            fields 
                id,
                name, 
                cover.url,
                aggregated_rating,
                rating,
                total_rating, 
                websites.url,
                websites.category,
                slug;
            where id = (${gameIds.join(', ')});
            limit ${numberOfGames};
          `,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch game details from IGDB');
        }

        const data: Game[] = await response.json();

        // Extract Steam App IDs
        const steamIds = data.flatMap((game: Game) => {
            const steamSite = game.websites?.find((site: Website) => site.category === 13);
            if (steamSite) {
                const match = steamSite.url.match(/\/app\/(\d+)/i);
                return match ? match[1].toLowerCase() : [];
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


        // Add prices to game data
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

        enhancedData.forEach(game => {
            console.log(`Game ${game.name}: , Price = ${game.price}`);
        });

        return enhancedData;

    } catch (error) {
        console.error(`Error fetching game details for game IDs ${gameIds.join(', ')} from IGDB:`, error);
        return [];
    }
}