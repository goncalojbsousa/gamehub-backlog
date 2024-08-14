'use client'

import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";
import { GameCard } from "@/src/components/game-card";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { LoadingIcon } from "@/src/components/svg/loading";

interface UserProps {
    userId: string;
    userImage: string;
    name: string;
    userName: string;
    joinDate: string;
    getUserGames: (userId: string, status: string, page: number) => Promise<any>;
}

interface GameProps {
    id: string;
    progress: string;
    gameDetails: Game;
}

export const ProfilePage: React.FC<UserProps> = ({ userImage, name, userName, joinDate, userId, getUserGames }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>("Played");
    const [selectedProgress, setSelectedProgress] = useState<string | null>(null);
    const [games, setGames] = useState<GameProps[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalFilteredItems, setTotalFilteredItems] = useState<number>(0);

    const fetchGames = useCallback(async (category: string, page: number) => {
        setLoading(true);
        try {
            const data = await getUserGames(userId, category, page);
            setGames(data.data);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(page);
            setTotalFilteredItems(data.pagination.totalItems);
        } catch (error) {
            console.error("Error fetching games:", error);
        } finally {
            setLoading(false);
        }
    }, [userId, getUserGames]);

    useEffect(() => {
        if (selectedCategory) {
            fetchGames(selectedCategory, 1);
        }
    }, [selectedCategory, fetchGames]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setSelectedProgress(null);
        fetchGames(category, 1);
    };

    const handleProgressClick = (progress: string) => {
        setSelectedProgress(prev => {
            const newProgress = prev === progress ? null : progress;
            const filteredGames = newProgress
                ? games.filter(game => game.progress === newProgress)
                : games;
            setTotalFilteredItems(filteredGames.length);
            return newProgress;
        });
        setCurrentPage(1);
    };

    const filteredGames = selectedProgress
        ? games.filter(game => game.progress === selectedProgress)
        : games;

    const filteredTotalPages = selectedProgress
        ? Math.ceil(filteredGames.length / (games.length / totalPages))
        : totalPages;

    useEffect(() => {
        if (selectedProgress) {
            setCurrentPage(1);
        }
    }, [selectedProgress]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchGames(selectedCategory!, newPage);
        }
    };

    const progressOptions = ['Unfinished', 'Beaten', 'Completed', 'Continuous'];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-24">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between p-6 bg-color_main rounded-2xl">
                        <div className="flex items-center">
                            <Image
                                src={userImage}
                                alt="User profile image"
                                width={250}
                                height={250}
                                className="w-24 h-24 rounded-full"
                                draggable={false}
                            />
                            <div className="ml-6">
                                <h1 className="text-2xl text-color_text">{name}</h1>
                                <p className="text-sm text-color_text_sec">@{userName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pt-6 text-color_text_sec">
                        {['Played', 'Playing', 'Plan to play', 'Dropped'].map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`p-2 ${selectedCategory === category ? 'text-color_text border-b-2 border-color_reverse' : 'hover:text-color_text'} w-full text-center`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {selectedCategory && (
                        <div className="flex justify-center">
                            <div className="px-4 gap-x-2 sm:gap-x-10 md:gap-x-20 text-center text-color_text_sec bg-color_main rounded-lg mt-4">
                                {progressOptions.map(progress => (
                                    <button
                                        key={progress}
                                        onClick={() => handleProgressClick(progress)}
                                        className={`p-2 ${selectedProgress === progress ? 'border-b-2 border-color_reverse text-color_text' : 'hover:text-color_text'}`}
                                    >
                                        {progress}
                                    </button>
                                ))}
                            </div>
                        </div>

                    )}


                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <LoadingIcon className="fill-color_icons" />
                        </div>
                    ) : (
                        selectedCategory && (
                            filteredGames.length === 0 ? (
                                <div className="flex justify-center items-center min-h-[200px] text-color_text_sec">
                                    <p>No results found :(</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
                                    {filteredGames.map(game => (
                                        <GameCard key={game.id} game={game.gameDetails} progress={game.progress} />
                                    ))}
                                </div>
                            )
                        )
                    )}

                    {selectedCategory && !loading && filteredGames.length !== 0 && (
                        <div className="flex justify-center items-center mt-8 space-x-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="bg-color_main text-color_text px-4 py-2 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-color_text">
                                Page {currentPage} of {filteredTotalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === filteredTotalPages}
                                className="bg-color_main text-color_text px-4 py-2 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <div className="mt-8">
                <Footer />
            </div>
        </div>
    );
}