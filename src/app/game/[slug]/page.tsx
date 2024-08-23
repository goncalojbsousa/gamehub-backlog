'use server';

import { fetchGameDetails } from "@/src/services/igdbServices/getGameDetails";
import { Metadata } from 'next';
import { cache } from 'react';
import { GamePage } from "./game";
import { getUserId } from "@/src/lib/auth/getUserIdServerAction";

// USE CACHE TO REQUEST IGDB ONLY 1 TIME
const getGameData = cache(async (slug: string) => {
    const gameData = await fetchGameDetails(slug);
    return gameData[0];
});

async function getGameStatus(gameId: number) {
    try {
        const userId = await getUserId();
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/game/getGameStatus?userId=${userId}&gameId=${gameId}`, { cache: 'no-store' });
        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Failed to fetch game status: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching game status:', error);
    }
    return null;
}

// CHANGE TITLE IN THE BROWSER TAB
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const game = await getGameData(params.slug);
    return {
        title: `${game?.name || 'Game'} | GameHub`,
    };
}

export default async function GamePageServer({ params }: { params: { slug: string } }) {
    const game = await getGameData(params.slug);

    if (!game) {
        return <div>Game not found</div>;
    }

    const userGameStatus = game.id ? await getGameStatus(game.id) : null;
    return <GamePage game={game} userGameStatus={userGameStatus} />;
}