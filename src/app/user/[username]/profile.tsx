'use client'

import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";
import { GameCard } from "@/src/components/game-card";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { LoadingIcon } from "@/src/components/svg/loading";

interface UserProps {
    userId: string;
    userImage: string;
    name: string;
    userName: string;
    joinDate: string;
    allUserGames: GameProps[];
}

interface GameProps {
    id: string;
    progress: string;
    status: string;
    gameDetails: Game;
}

export const ProfilePage: React.FC<UserProps> = ({ userImage, name, userName, joinDate, userId, allUserGames }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("Played");
    const [selectedProgress, setSelectedProgress] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("rating_desc");
    const itemsPerPage = 48;

    const filteredGames = useMemo(() => {
        let filtered = allUserGames.filter(game =>
            game.status === selectedCategory &&
            (selectedProgress ? game.progress === selectedProgress : true) &&
            game.gameDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortOption) {
            case "rating_desc":
                filtered.sort((a, b) => (b.gameDetails.total_rating || 0) - (a.gameDetails.total_rating || 0));
                break;
            case "rating_asc":
                filtered.sort((a, b) => (a.gameDetails.total_rating || 0) - (b.gameDetails.total_rating || 0));
                break;
            case "name_asc":
                filtered.sort((a, b) => a.gameDetails.name.localeCompare(b.gameDetails.name));
                break;
            case "name_desc":
                filtered.sort((a, b) => b.gameDetails.name.localeCompare(a.gameDetails.name));
                break;
        }
        return filtered;
    }, [allUserGames, selectedCategory, selectedProgress, searchTerm, sortOption]);

    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
    const currentGames = filteredGames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setSelectedProgress(null);
        setCurrentPage(1);
    };

    const handleProgressClick = (progress: string) => {
        setSelectedProgress(prev => prev === progress ? null : progress);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

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

                    {/* Progress buttons */}
                    <div className="flex justify-center flex-wrap">
                        <div className="px-4 py-2 gap-x-2 sm:gap-x-10 md:gap-x-20 text-center text-color_text_sec bg-color_main rounded-lg mt-4">
                            <input
                                type="text"
                                placeholder="Search games..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-2 rounded-md bg-color_sec border border-border_detail transition-colors duration-200 mr-4 focus:outline-none focus:border-input_detail"
                            />
                            {progressOptions.map(progress => (
                                <button
                                    key={progress}
                                    onClick={() => handleProgressClick(progress)}
                                    className={`p-2 ${selectedProgress === progress ? 'border-b-2 border-color_reverse text-color_text' : 'hover:text-color_text'}`}
                                >
                                    {progress}
                                </button>
                            ))}
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="p-2 rounded-md bg-color_sec border border-border_detail transition-colors duration-200 ml-4 focus:outline-none focus:border-input_detail"
                            >
                                <option value="rating_desc">Rating (High to Low)</option>
                                <option value="rating_asc">Rating (Low to High)</option>
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {/* Game cards */}
                    {currentGames.length === 0 ? (
                        <div className="flex justify-center items-center min-h-[200px] text-color_text_sec">
                            <p>No results found :(</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
                            {currentGames.map(game => (
                                <GameCard key={game.id} game={game.gameDetails} progress={game.progress} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {currentGames.length > 0 && (
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