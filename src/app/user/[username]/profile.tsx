'use client'

import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";
import { GameCard } from "@/src/components/game-card";
import { AdminProfileIndicator } from "@/src/components/admin-profile-indicator";
import { UserReviews } from "@/src/components/user-reviews";
import Image from "next/image";
import { useState, useMemo, useEffect, useCallback } from "react";
import { getAllGameStatusByUserId } from "@/src/lib/getAllGameStatusByUserId";
import { LoadingIcon } from "@/src/components/svg/loading";
import { SearchIcon } from "@/src/components/svg/search-icon";
import { IoGameControllerOutline } from "react-icons/io5";
import { CiPlay1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { FaList } from "react-icons/fa6";
import { getCoverImageUrl } from "@/src/utils/utils";
import { useUser } from "@/src/context/userContext";
import { isGoogleImage } from "@/src/utils/imageUtils";
import type { UserReview } from "@/src/lib/getUserReviews";
import { useGameStatusOptimized } from "@/src/hooks/useGameStatusOptimized";

interface UserProps {
    userId: string;
    userImage: string;
    name: string;
    userName: string;
    joinDate: string | Date;
    isBanned?: boolean;
    bio?: string;
    isProfilePublic?: boolean;
    isPrivateProfile?: boolean;
}

interface GameProps {
    id: string | number;
    status: string;
    gameDetails: Game;
}

export const ProfilePage: React.FC<UserProps> = ({ userImage, name, userName, joinDate, userId, isBanned = false, bio, isProfilePublic = true, isPrivateProfile = false }) => {
    const { userRole } = useUser();
    const [imageError, setImageError] = useState(false);
    const [activeTab, setActiveTab] = useState<'games' | 'reviews'>('games');
    
    const validUserImage = !imageError ? (userImage || "/placeholder-user.webp") : "/placeholder-user.webp";
    
    // Helper function to format the date safely
    const formatJoinDate = (date: string | Date) => {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) {
                return 'Unknown';
            }
            return dateObj.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown';
        }
    };
    const [selectedCategory, setSelectedCategory] = useState<string>("Played");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("rating_desc");
    const [games, setGames] = useState<GameProps[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasGames, setHasGames] = useState<boolean | null>(null);
    const [userGameStats, setUserGameStats] = useState<Record<string, number>>({});
    const [reviewCount, setReviewCount] = useState(0);

    // Get game IDs for status tracking
    const gameIds = games.map(game => game.gameDetails.id);
    
    // Use the optimized game status hook
    const { gameStatuses } = useGameStatusOptimized(gameIds);

    // Prefetched reviews and game details to avoid extra IGDB call on tab switch
    const [initialReviews, setInitialReviews] = useState<UserReview[] | null>(null);
    const [initialReviewsPagination, setInitialReviewsPagination] = useState<{
        currentPage: number;
        totalPages: number;
        totalReviews: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    } | null>(null);
    const [initialGameDetailsById, setInitialGameDetailsById] = useState<Record<number, Game> | null>(null);
    const [initialSortBy, setInitialSortBy] = useState<string>('createdAt');
    const [initialSortOrder, setInitialSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Reset image error when userImage changes
    useEffect(() => {
        setImageError(false);
    }, [userImage]);

    // Initial load: fetch games + reviews, and make a single IGDB call on backend
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    userId,
                    status: selectedCategory,
                    gamePage: String(currentPage),
                    gameLimit: '48',
                    reviewPage: '1',
                    reviewLimit: '10',
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                });
                const res = await fetch(`/api/profile/getInitialData?${params.toString()}`);
                if (!res.ok) {
                    throw new Error('Failed to load initial profile data');
                }
                const data = await res.json();

                // Status counts and review counts
                setUserGameStats(data.statusCounts || {});
                setReviewCount(data.reviews?.pagination?.totalReviews || 0);
                const counts: Record<string, number> = data.statusCounts || {};
                setHasGames(Object.values(counts).some((v) => v > 0));

                // Games
                setGames((data.games?.items || []) as GameProps[]);
                setTotalPages(data.games?.pagination?.totalPages || 1);
                if (data.games?.selectedStatus && data.games.selectedStatus !== selectedCategory) {
                    setSelectedCategory(data.games.selectedStatus);
                }

                // Prefetch reviews and game details for reviews list
                setInitialReviews(data.reviews?.items || []);
                setInitialReviewsPagination(data.reviews?.pagination || null);
                setInitialGameDetailsById(data.gameDetailsById || null);
                setInitialSortBy(data.reviews?.sortBy || 'createdAt');
                setInitialSortOrder((data.reviews?.sortOrder || 'desc'));
            } catch (error) {
                console.error('Error loading initial profile data:', error);
            } finally {
                setLoading(false);
                // Mark initial loading complete so subsequent filter changes trigger fetch
                setIsInitialLoading(false);
            }
        };
        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const fetchGames = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllGameStatusByUserId(userId, selectedCategory, currentPage);
            setGames(data.games);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching games:", error);
        }
        setLoading(false);
    }, [userId, selectedCategory, currentPage]);

    useEffect(() => {
        // Only fetch on user-driven changes after initial data has been loaded
        if (isInitialLoading) return;
        fetchGames();
    }, [fetchGames, isInitialLoading]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };


    const clearAllFilters = () => {
        setSearchTerm("");
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const filteredGames = games.filter(game =>
        game.gameDetails.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ['Played', 'Playing', 'Plan to play', 'Dropped'];

    // Background style similar to home page
    const mainStyle = {
        backgroundImage: `
            linear-gradient(to bottom, var(--gradient-start), var(--background)),
            url(/login-bg.webp)
        `,
        backgroundSize: '100% 1200px',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'var(--background)',
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="transition-colors duration-200 pt-24 relative flex-1 bg-background" style={mainStyle}>
                <Navbar />

                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="container mx-auto px-4 lg:px-8 py-8">
                        {/* Admin Profile Indicator */}
                        <AdminProfileIndicator isPrivate={isPrivateProfile} isAdmin={userRole === 'ADMIN'} />
                        
                        {/* Profile Header */}
                        <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail relative overflow-hidden mb-8 animate-slide-in-up">
                            {/* Background Image Overlay */}
                            {!loading && games.length > 0 && games[0]?.gameDetails?.screenshots?.[0]?.url && (
                                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                                    <div
                                        className="absolute top-0 right-0 w-full h-full bg-cover bg-center rounded-xl"
                                        style={{
                                            backgroundImage: `url(${getCoverImageUrl(`https://${games[0].gameDetails.screenshots[0].url}`)})`,
                                        }}
                                    ></div>
                                </div>
                            )}
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <Image
                                                src={validUserImage}
                                                alt="User profile image"
                                                width={120}
                                                height={120}
                                                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-color_reverse_sec shadow-lg"
                                                draggable={false}
                                                onError={(e) => {
                                                    // Silently handle image loading errors without console logging
                                                    setImageError(true);
                                                    e.currentTarget.src = "/placeholder-user.webp";
                                                }}
                                                unoptimized={isGoogleImage(userImage)}
                                            />
                                        </div>
                                                                                    <div>
                                                <h1 className="text-3xl lg:text-4xl font-bold text-color_text mb-2">
                                                    {name}
                                                </h1>
                                                <p className="text-lg text-color_text_sec mb-2">@{userName}</p>
                                                <p className="text-sm text-color_text_sec">
                                                    Member since {formatJoinDate(joinDate)}
                                                </p>
                                                {bio && (
                                                    <p className="text-sm text-color_text_sec mt-2 max-w-md">
                                                        {bio}
                                                    </p>
                                                )}
                                                {isBanned && (
                                                                                                     <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                                   <div className="flex items-center gap-2">
                                                     <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                     </svg>
                                                     <span className="text-red-800 dark:text-red-300 font-medium">Account Suspended</span>
                                                   </div>
                                                   <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                                                     This user has been banned and cannot access the site.
                                                   </p>
                                                 </div>
                                                )}
                                            </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-color_text">
                                                {Object.values(userGameStats).reduce((sum, count) => sum + count, 0)}
                                            </div>
                                            <div className="text-sm text-color_text_sec">Games</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-color_text">{reviewCount}</div>
                                            <div className="text-sm text-color_text_sec">Reviews</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Main Content */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    {/* Tabs and Filters */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Tabs */}
                            <div className="bg-color_sec rounded-xl p-2 shadow-lg border border-border_detail inline-flex">
                                <button
                                    onClick={() => setActiveTab('games')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none ${
                                        activeTab === 'games'
                                            ? 'bg-color_reverse_sec text-color_main shadow-md'
                                            : 'text-color_text hover:text-color_reverse_sec'
                                    }`}
                                >
                                    Games ({Object.values(userGameStats).reduce((sum, count) => sum + count, 0)})
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none ${
                                        activeTab === 'reviews'
                                            ? 'bg-color_reverse_sec text-color_main shadow-md'
                                            : 'text-color_text hover:text-color_reverse_sec'
                                    }`}
                                >
                                    Reviews ({reviewCount})
                                </button>
                            </div>

                            {/* Inline Filters - Only show for games tab */}
                            {activeTab === 'games' && hasGames === true && (
                                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full lg:w-auto">
                                    {/* Search Input */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search games..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full sm:w-64 p-3 pl-10 rounded-lg bg-color_main border border-border_detail transition-colors duration-200 focus:outline-none focus:border-input_detail text-color_text placeholder-color_text_sec"
                                        />
                                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 fill-color_icons w-4 h-4" />
                                    </div>

                                    {/* Game Status Buttons */}
                                    <div className="flex gap-2 flex-wrap">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => handleCategoryClick(category)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none text-sm font-medium ${
                                                    selectedCategory === category 
                                                        ? 'bg-color_reverse_sec text-color_main shadow-md' 
                                                        : 'bg-color_main text-color_text hover:bg-color_hover border border-border_detail'
                                                }`}
                                            >
                                                {/* Status Icons */}
                                                {category === 'Played' && <IoGameControllerOutline className="w-4 h-4" />}
                                                {category === 'Playing' && <CiPlay1 className="w-4 h-4" />}
                                                {category === 'Dropped' && <MdOutlineCancel className="w-4 h-4" />}
                                                {category === 'Plan to play' && <FaList className="w-4 h-4" />}
                                                
                                                <span className="hidden xs:inline">{category}</span>
                                                
                                                {userGameStats[category] && (
                                                    <span className="bg-color_accent text-color_main text-xs font-bold rounded-full px-2 py-1 min-w-[20px] text-center">
                                                        {userGameStats[category]}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {activeTab === 'games' && (
                        <div className="flex flex-col gap-8">

                        {/* Games Results */}
                        {hasGames === false && !loading ? (
                            <div className="flex-1">
                                <div className="flex justify-center items-center min-h-[400px]">
                                    <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail text-center max-w-md">
                                        <div className="text-6xl mb-4">🎮</div>
                                        <h3 className="text-xl font-bold text-color_text mb-2">No Games Yet</h3>
                                        <p className="text-color_text_sec">
                                            This user hasn&apos;t added any games to their collection yet.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (hasGames === true || loading) ? (
                            <div className="flex-1">

                            {/* Games Grid */}
                            {loading ? (
                                <div className="flex justify-center items-center min-h-[400px]">
                                    <div className="flex flex-col items-center gap-4">
                                        <LoadingIcon className="fill-color_icons w-12 h-12 animate-spin" />
                                        <p className="text-color_text_sec">Loading games...</p>
                                    </div>
                                </div>
                            ) : filteredGames.length === 0 ? (
                                <div className="flex justify-center items-center min-h-[400px]">
                                    <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail text-center max-w-md">
                                        <div className="text-6xl mb-4">🎮</div>
                                        <h3 className="text-xl font-bold text-color_text mb-2">No Games Found</h3>
                                        <p className="text-color_text_sec mb-4">
                                            {searchTerm 
                                                ? `No games found for "${searchTerm}" in ${selectedCategory.toLowerCase()}.` 
                                                : `No games in ${selectedCategory.toLowerCase()} yet.`
                                            }
                                        </p>
                                        {searchTerm && (
                                            <button
                                                onClick={() => setSearchTerm("")}
                                                className="px-6 py-3 bg-color_reverse_sec text-color_main rounded-lg hover:bg-color_reverse transition-all duration-200 font-medium focus:outline-none"
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-slide-in-up">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                                        {filteredGames.map((game, index) => {
                                            // Use status from context if available, otherwise use the status from the data
                                            const userGameStatus = gameStatuses[game.gameDetails.id] 
                                                ? { status: gameStatuses[game.gameDetails.id] } 
                                                : { status: game.status };
                                            
                                            return (
                                                <GameCard 
                                                    key={game.id || `game-${index}`} 
                                                    game={game.gameDetails} 
                                                    userGameStatus={userGameStatus}
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center mt-12">
                                            <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="px-4 py-2 bg-color_main text-color_text rounded-lg hover:bg-color_hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="text-color_text font-medium">
                                                        Page {currentPage} of {totalPages}
                                                    </span>
                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="px-4 py-2 bg-color_main text-color_text rounded-lg hover:bg-color_hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        ) : null}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="animate-slide-in-up">
                            <UserReviews
                                userId={userId}
                                username={userName}
                                initialReviews={initialReviews || undefined}
                                initialPagination={initialReviewsPagination || undefined}
                                initialGameDetailsById={initialGameDetailsById || undefined}
                                initialPage={1}
                                initialSortBy={initialSortBy}
                                initialSortOrder={initialSortOrder}
                            />
                        </div>
                    )}
                </div>
            </div>
            </main>
            
            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
};