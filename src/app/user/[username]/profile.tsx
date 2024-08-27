'use client'

import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";
import { GameCard } from "@/src/components/game-card";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { getAllGameStatusByUserId } from "@/src/lib/getAllGameStatusByUserId";
import { LoadingIcon } from "@/src/components/svg/loading";

interface UserProps {
    userId: string;
    userImage: string;
    name: string;
    userName: string;
    joinDate: string;
}

interface GameProps {
    id: string;
    progress: string;
    status: string;
    gameDetails: Game;
}

export const ProfilePage: React.FC<UserProps> = ({ userImage, name, userName, joinDate, userId }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("Played");
    const [selectedProgress, setSelectedProgress] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("rating_desc");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [games, setGames] = useState<GameProps[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGames();
    }, [selectedCategory, currentPage]);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const data = await getAllGameStatusByUserId(userId, selectedCategory, currentPage);
            setGames(data.games);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching games:", error);
        }
        setLoading(false);
    };

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setSelectedProgress(null);
        setCurrentPage(1);
    };

    const handleProgressClick = (progress: string) => {
        setSelectedProgress(prev => prev === progress ? null : progress);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const filteredGames = games.filter(game =>
        (selectedProgress ? game.progress === selectedProgress : true) &&
        game.gameDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const progressOptions = ['Unfinished', 'Beaten', 'Completed', 'Continuous'];

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-24">
                <div className="container mx-auto px-4">
                    {/* User profile section */}
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

                    {/* Category buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 text-color_text_sec">
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

                    {/* Filters section */}
                    <div className="mt-4">
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className="w-full md:hidden bg-color_main text-color_text p-2 rounded-lg mb-2"
                        >
                            {isFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                        </button>

                        <div className={`md:block ${isFiltersOpen ? 'block' : 'hidden'}`}>
                            <div className="flex flex-col md:flex-row justify-between items-center  rounded-lg p-2">
                                <div className="w-full md:w-auto ml-2 mb-4 md:mb-0">
                                    <input
                                        type="text"
                                        placeholder="Search games..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full md:w-auto p-2 rounded-md bg-color_sec border border-border_detail transition-colors duration-200 focus:outline-none focus:border-input_detail"
                                    />
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-0">
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

                                <div className="mr-2">
                                    <p>{games.length} results on page {currentPage}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className=" border-border_detail" />
                    {/* Game cards */}
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <LoadingIcon className="fill-color_icons"/>
                        </div>
                    ) : filteredGames.length === 0 ? (
                        <div className="flex justify-center items-center min-h-[200px] text-color_text_sec">
                            <p>No results found :(</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
                            {filteredGames.map(game => (
                                <GameCard key={game.id} game={game.gameDetails} progress={game.progress} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredGames.length > 0 && (
                        <div className="flex justify-center items-center mt-8 space-x-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="bg-color_main text-color_text px-4 py-2 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-color_text">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
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
};