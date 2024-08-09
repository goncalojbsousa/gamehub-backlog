'use server'

import { checkRateLimit } from "@/src/utils/rateLimit";
import { headers } from "next/headers";

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
              cover.url;
            where id = (${gameIds.join(', ')});
          `,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch game details from IGDB');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(`Error fetching game details for game IDs ${gameIds.join(', ')} from IGDB:`, error);
        return [];
    }
}