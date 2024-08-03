'use client'

import { useParams } from 'next/navigation';
import { GamePage } from "@/src/app/game/[slug]/game";
import { fetchGameDetails } from "@/src/services/igdbServices/getGameDetails";
import { useEffect, useState } from "react";
import { Loading } from '@/src/components/loading';

const Game = () => {
    const { slug } = useParams();
    const [game, setGame] = useState<Game>();

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                const gameData = await fetchGameDetails(slug.toString());
                console.log(gameData);
                setGame(gameData[0]);
            } catch (error) {
                console.error("Error fetching game data", error);
            }
        };

        fetchData();
    }, [slug]);

    if (!game) {
        return <Loading/>;
    }

    return <GamePage game={game} />;
};

export default Game;