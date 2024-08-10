'use client'

import { useEffect, useState } from "react";
import { Navbar } from "@/src/components/navbar/navbar";
import { fetchGamesList } from "@/src/services/igdbServices/getGames";
import { TrendingIcon } from "@/src/components/svg/trending";
import { getCoverImageUrl } from "@/src/utils/utils";
import { Footer } from "@/src/components/footer";
import { LoadingIcon } from "../components/svg/loading";
import { GameCard } from "../components/game-card";

export default function HomePage() {
    const [gamesPopularYear, setGamesPopularYear] = useState<Game[]>([]);
    const [gamesPopular, setGamesPopular] = useState<Game[]>([]);
    const [gamesUpcoming, setGamesUpcoming] = useState<Game[]>([]);
    const [gamesRecent, setGamesRecent] = useState<Game[]>([]);

    useEffect(() => {
        const getGames = async () => {
            const [
                gamesPopularYearData,
                gamesPopularData,
                gamesUpcomingData,
                gamesRecentData,
            ] = await fetchGamesList(['popular2024', 'popular', 'upcoming', 'recent'], 48);
            setGamesPopularYear(gamesPopularYearData);
            setGamesPopular(gamesPopularData);
            setGamesUpcoming(gamesUpcomingData);
            setGamesRecent(gamesRecentData);
        };

        getGames();
    }, []);

    return (
        <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-color_bg">
            <Navbar />

            <div className="p-4 pt-0 text-color_text xl:px-24">
                <div className="bg-color_main p-6 rounded-lg mb-6 flex items-center relative z-10">
                    <div className="mr-4">
                        <TrendingIcon className="fill-color_icons" />
                    </div>
                    <h2 className="text-3xl font-bold">Popular Games</h2>
                    {gamesPopular.length > 0 && (
                        <div className="absolute top-0 right-0 w-8/12 h-full bg-cover flex items-center">
                            <div
                                className="w-full h-full rounded-lg bg-center"
                                style={{
                                    backgroundImage: `url(${getCoverImageUrl(
                                        `https://${gamesPopular[0].screenshots[0].url}`
                                    )})`,
                                }}
                            ></div>
                        </div>
                    )}
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {gamesPopular.length > 0 ? (
                        gamesPopular.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))
                    ) : (
                        <div className="flex justify-center w-full">
                            <LoadingIcon className="fill-color_icons" />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 pt-8 text-color_text xl:px-24">
                <div className="bg-color_main p-6 rounded-lg mb-6 flex items-center relative">
                    <div className="mr-4">
                        <TrendingIcon className="fill-color_icons" />
                    </div>
                    <h2 className="text-3xl font-bold">Popular Games of 2024</h2>
                    {gamesPopularYear.length > 0 && (
                        <div className="absolute top-0 right-0 w-8/12 h-full">
                            <div
                                className="absolute top-0 right-0 w-full h-full bg-cover bg-center rounded-lg"
                                style={{
                                    backgroundImage: `url(${getCoverImageUrl(
                                        `https://${gamesPopularYear[0].screenshots[0].url}`
                                    )})`,
                                }}
                            ></div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {gamesPopularYear.length > 0 ? (
                        gamesPopularYear.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))
                    ) : (
                        <div className="flex justify-center w-full">
                            <LoadingIcon className="fill-color_icons" />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 pt-8 text-color_text xl:px-24">
                <div className="bg-color_main p-6 rounded-lg mb-6 flex items-center relative">
                    <div className="mr-4">
                        <TrendingIcon className="fill-color_icons" />
                    </div>
                    <h2 className="text-3xl font-bold">Recent Games</h2>
                    {gamesRecent.length > 0 && (
                        <div className="absolute top-0 right-0 w-8/12 h-full">
                            <div
                                className="absolute top-0 right-0 w-full h-full bg-cover bg-center rounded-lg"
                                style={{
                                    backgroundImage: `url(${getCoverImageUrl(
                                        `https://${gamesRecent[0].screenshots[0].url}`
                                    )})`,
                                }}
                            ></div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {gamesRecent.length > 0 ? (
                        gamesRecent.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))
                    ) : (
                        <div className="flex justify-center w-full">
                            <LoadingIcon className="fill-color_icons" />
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 pt-8 text-color_text xl:px-24">
                <div className="bg-color_main p-6 rounded-lg mb-6 flex items-center relative">
                    <div className="mr-4">
                        <TrendingIcon className="fill-color_icons" />
                    </div>
                    <h2 className="text-3xl font-bold">Upcoming Games</h2>
                    {gamesUpcoming.length > 0 && (
                        <div className="absolute top-0 right-0 w-8/12 h-full">
                            <div
                                className="absolute top-0 right-0 w-full h-full bg-cover bg-center rounded-lg"
                                style={{
                                    backgroundImage: `url(${getCoverImageUrl(
                                        `https://${gamesUpcoming[0].screenshots[0].url}`
                                    )})`,
                                }}
                            ></div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {gamesUpcoming.length > 0 ? (
                        gamesUpcoming.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))
                    ) : (
                        <div className="flex justify-center w-full">
                            <LoadingIcon className="fill-color_icons" />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <Footer />
            </div>
        </main>
    );
}