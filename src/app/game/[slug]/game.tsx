'use client'

import { Footer } from "@/src/components/footer";
import { GameInfo } from "@/src/components/game-info";
import { GamePageContent } from "@/src/components/game-page-content";
import ScreenshotViewer from "@/src/components/game-screenshot-viewer";
import { Navbar } from "@/src/components/navbar/navbar";
import { ShareButtons } from "@/src/components/share-buttons";
import { GameReviews } from "@/src/components/game-reviews";
import { categories } from "@/src/constants/categories";
import { getScreenShotImageUrl } from "@/src/utils/utils";
import { useState } from "react";
import { IoGameControllerOutline } from "react-icons/io5";
import { CiPlay1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { FaList } from "react-icons/fa6";
import { useUser } from "@/src/context/userContext";
import { checkIsAuthenticated } from "@/src/lib/auth/checkIsAuthenticated";

interface GamePageProps {
    game: Game;
    userGameStatus: UserGameStatus | null;
}

export const GamePage: React.FC<GamePageProps> = ({ game, userGameStatus }) => {
    const { isAuthenticated } = useUser();
    const [selectedScreenshot, setSelectedScreenshot] = useState(game.screenshots?.[0] || null);
    const [currentStatus, setCurrentStatus] = useState(userGameStatus?.status || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const handleStatusUpdate = async (newStatus: string) => {
        if (isUpdating || !isAuthenticated) return;
        
        // If clicking the same status, remove it (set to empty)
        const statusToSet = currentStatus === newStatus ? '' : newStatus;
        
        setIsUpdating(true);
        setUpdatingStatus(newStatus); // Track which status is being updated
        
        try {
            if (statusToSet === '') {
                // Remove the game status
                const response = await fetch('/api/game/removeGameStatus', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        gameId: game.id,
                    }),
                });

                if (response.ok) {
                    setCurrentStatus('');
                } else {
                    console.error('Failed to remove game status');
                }
            } else {
                // Update the game status
                const response = await fetch('/api/game/updateGameStatus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        gameId: game.id,
                        status: statusToSet,
                    }),
                });

                if (response.ok) {
                    setCurrentStatus(statusToSet);
                } else {
                    console.error('Failed to update game status');
                }
            }
        } catch (error) {
            console.error('Error updating game status:', error);
        } finally {
            setIsUpdating(false);
            setUpdatingStatus(null); // Clear the updating status
        }
    };

    const mainStyle = selectedScreenshot ? {
        backgroundImage: `
            linear-gradient(to bottom, var(--gradient-start), var(--background)),
            url(${getScreenShotImageUrl(selectedScreenshot.url)})
        `,
        backgroundSize: '100% 1200px',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'var(--background)',
    } : {};

    return (
        <main className="transition-colors duration-200 pt-16 relative min-h-screen" style={mainStyle}>
            <Navbar />
            <div className="relative z-10">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-b from-black/20 to-transparent">
                    <div className="container mx-auto px-4 lg:px-8 py-4">
                        {/* Game Header */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-color_text leading-tight">
                                        {game.name}
                                    </h1>
                                    {game.version_title && (
                                        <span className="text-color_text_sec text-lg hidden md:inline">
                                            ({game.version_title})
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <span className="px-3 py-1 bg-color_reverse_sec text-color_main rounded-full font-medium">
                                        {categories[game.game_type] || 'Unknown Category'}
                                    </span>
                                    {game.first_release_date && (
                                        <span className="text-color_text_sec">
                                            Released {new Date(game.first_release_date * 1000).getFullYear()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status Selection Buttons */}
                            {isAuthenticated && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap gap-3">
                                    {/* Played Button */}
                                    <button
                                        onClick={() => handleStatusUpdate('Played')}
                                        disabled={isUpdating}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                                            currentStatus === 'Played'
                                                ? 'border-color_reverse_sec bg-color_reverse_sec text-color_main shadow-lg scale-105'
                                                : 'border-border_detail bg-color_sec text-color_text hover:bg-color_hover hover:border-color_reverse_sec'
                                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        title={currentStatus === 'Played' ? 'Click to remove status' : 'Click to set as Played'}
                                    >
                                        {updatingStatus === 'Played' ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                        ) : (
                                            <IoGameControllerOutline className="w-5 h-5" />
                                        )}
                                        <span className="text-sm hidden xl:inline">Played</span>
                                    </button>

                                    {/* Playing Button */}
                                    <button
                                        onClick={() => handleStatusUpdate('Playing')}
                                        disabled={isUpdating}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                                            currentStatus === 'Playing'
                                                ? 'border-color_reverse_sec bg-color_reverse_sec text-color_main shadow-lg scale-105'
                                                : 'border-border_detail bg-color_sec text-color_text hover:bg-color_hover hover:border-color_reverse_sec'
                                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        title={currentStatus === 'Playing' ? 'Click to remove status' : 'Click to set as Playing'}
                                    >
                                        {updatingStatus === 'Playing' ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                        ) : (
                                            <CiPlay1 className="w-5 h-5" />
                                        )}
                                        <span className="text-sm hidden xl:inline">Playing</span>
                                    </button>

                                    {/* Dropped Button */}
                                    <button
                                        onClick={() => handleStatusUpdate('Dropped')}
                                        disabled={isUpdating}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                                            currentStatus === 'Dropped'
                                                ? 'border-color_reverse_sec bg-color_reverse_sec text-color_main shadow-lg scale-105'
                                                : 'border-border_detail bg-color_sec text-color_text hover:bg-color_hover hover:border-color_reverse_sec'
                                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        title={currentStatus === 'Dropped' ? 'Click to remove status' : 'Click to set as Dropped'}
                                    >
                                        {updatingStatus === 'Dropped' ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                        ) : (
                                            <MdOutlineCancel className="w-5 h-5" />
                                        )}
                                        <span className="text-sm hidden xl:inline">Dropped</span>
                                    </button>

                                    {/* Plan to Play Button */}
                                    <button
                                        onClick={() => handleStatusUpdate('Plan to play')}
                                        disabled={isUpdating}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                                            currentStatus === 'Plan to play'
                                                ? 'border-color_reverse_sec bg-color_reverse_sec text-color_main shadow-lg scale-105'
                                                : 'border-border_detail bg-color_sec text-color_text hover:bg-color_hover hover:border-color_reverse_sec'
                                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        title={currentStatus === 'Plan to play' ? 'Click to remove status' : 'Click to set as Plan to Play'}
                                    >
                                        {updatingStatus === 'Plan to play' ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                        ) : (
                                            <FaList className="w-5 h-5" />
                                        )}
                                        <span className="text-sm hidden xl:inline">Plan to Play</span>
                                    </button>
                                </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Game Info Sidebar */}
                        <div className="lg:col-span-1">
                            <GameInfo game={game} />
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            {/* Screenshots Section */}
                            {selectedScreenshot && (
                                <div className="mb-8">
                                    <ScreenshotViewer
                                        screenshots={game.screenshots}
                                        selectedScreenshot={selectedScreenshot}
                                        onSelectScreenshot={setSelectedScreenshot}
                                    />
                                </div>
                            )}
                            
                            {/* Game Content */}
                            <GamePageContent game={game} />
                            
                            {/* Reviews Section */}
                            <GameReviews gameId={game.id} />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-16">
                <Footer />
            </div>

        </main>
    );
}