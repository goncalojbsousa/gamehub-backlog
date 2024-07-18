'use server'

export const fetchGamesBySearch = async (query: string) => {
    try {
        const IGDB_PROXY_URL = process.env.IGDB_PROXY_URL;
        const IGDB_API_URL = `${IGDB_PROXY_URL}v4/games`;
        const clientID = process.env.IGDB_CLIENT_ID;
        const accessToken = process.env.IGDB_ACCESS_TOKEN;

        const origin = process.env.NEXTAUTH_URL;

        if (!clientID || !accessToken || !origin) {
            throw new Error('Client ID ou Access Token ou Origin não definidos');
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
                    category != 14 &
                    cover != null &
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
        throw error;
    }
}