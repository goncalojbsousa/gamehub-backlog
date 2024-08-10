'use client'

import { useParams } from 'next/navigation';
import { GamePage } from "@/src/app/game/[slug]/game";
import { fetchGameDetails } from "@/src/services/igdbServices/getGameDetails";
import { useEffect, useState } from "react";
import { Loading } from '@/src/components/loading';

const Game = () => {
    const { slug } = useParams();
    const [game, setGame] = useState<Game>();
    const [userGameStatus, setUserGameStatus] = useState<UserGameStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;

            try {
                setIsLoading(true);
                const gameData = await fetchGameDetails(slug.toString());
                setGame(gameData[0]);
                if (gameData && gameData[0]?.id) {
                    const response = await fetch(`/api/game/getGameStatus?gameId=${gameData[0].id}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    setUserGameStatus(await response.json());
                }
            } catch (error) {
                console.error("Error fetching game data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (isLoading) {
        return <Loading />;
    }

    if (!game) {
        return <div>Game not found</div>;
    }

    return <GamePage game={game} userGameStatus={userGameStatus} />;
};

export default Game;