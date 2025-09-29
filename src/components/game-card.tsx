import Link from "next/link";
import Image from "next/image";
import { RatingCircle } from "@/src/components/rating-circle";
import { getCoverImageUrl } from "@/src/utils/utils";
import { useState, useEffect } from "react";
import { IoGameControllerOutline } from "react-icons/io5";
import { CiPlay1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { FaList } from "react-icons/fa6";
import { useUser } from "@/src/context/userContext";

/**
 * Props interface for the GameCard component
 * Defines the required and optional properties for rendering game information
 */
interface GameCardProps {
    game: Game;           // Game data object containing all game information
    userGameStatus?: UserGameStatus | null; // Optional user game status
}

/**
 * GameCard component - Displays game information in a card format
 * Renders game cover image, title, genres, rating, and price
 * Includes hover effects and status selection buttons
 * 
 * @param game - Game object containing all game data
 * @param userGameStatus - Optional user game status
 * @returns JSX element representing the game card
 */
export const GameCard: React.FC<GameCardProps> = ({ game, userGameStatus }) => {
    const { isAuthenticated } = useUser();
    const [currentStatus, setCurrentStatus] = useState(userGameStatus?.status || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    // Update currentStatus when userGameStatus changes
    useEffect(() => {
        setCurrentStatus(userGameStatus?.status || '');
    }, [userGameStatus?.status]);

    const handleStatusUpdate = async (newStatus: string, event: React.MouseEvent) => {
        event.preventDefault(); // Prevent navigation to game page
        event.stopPropagation();
        
        if (isUpdating || !isAuthenticated) return;
        
        // If clicking the same status, remove it (set to empty)
        const statusToSet = currentStatus === newStatus ? '' : newStatus;
        
        setIsUpdating(true);
        setUpdatingStatus(newStatus);
        
        try {
            if (statusToSet === '') {
                // Remove the game status
                const response = await fetch('/api/game/removeGameStatus', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ gameId: game.id }),
                });
                
                if (response.ok) {
                    setCurrentStatus('');
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
                        status: statusToSet 
                    }),
                });
                
                if (response.ok) {
                    setCurrentStatus(statusToSet);
                }
            }
        } catch (error) {
            console.error('Error updating game status:', error);
        } finally {
            setIsUpdating(false);
            setUpdatingStatus(null);
        }
    };

    return (
        <div className="group block bg-color_sec rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative">
            {/* Game cover image section */}
            <div className="relative">
                {/* Status buttons overlay - only show on hover and if authenticated */}
                {isAuthenticated && (
                    <div className="absolute top-2 left-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-1 justify-center">
                            {/* Played Button */}
                            <button
                                onClick={(e) => handleStatusUpdate('Played', e)}
                                disabled={isUpdating}
                                className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                                    currentStatus === 'Played'
                                        ? 'border-color_reverse_sec bg-color_reverse_sec text-color_main shadow-lg'
                                        : 'border-border_detail bg-color_sec text-color_text hover:bg-color_hover hover:border-color_reverse_sec'
                                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                title={currentStatus === 'Played' ? 'Click to remove status' : 'Click to set as Played'}
                            >
                                {updatingStatus === 'Played' ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                ) : (
                                    <IoGameControllerOutline className="w-4 h-4" />
                                )}
                            </button>

                            {/* Playing Button */}
                            <button
                                onClick={(e) => handleStatusUpdate('Playing', e)}
                                disabled={isUpdating}
                                className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                                    currentStatus === 'Playing'
                                        ? 'border-color_reverse_sec bg-color_reverse_sec text-color_main shadow-lg'
                                        : 'border-border_detail bg-color_sec text-color_text hover:bg-color_hover hover:border-color_reverse_sec'
                                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                title={currentStatus === 'Playing' ? 'Click to remove status' : 'Click to set as Playing'}
                            >
                                {updatingStatus === 'Playing' ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                ) : (
                                    <CiPlay1 className="w-4 h-4" />
                                )}
                            </button>

                            {/* Dropped Button */}
                            <button
                                onClick={(e) => handleStatusUpdate('Dropped', e)}
                                disabled={isUpdating}
                                className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                                    currentStatus === 'Dropped'
                                        ? 'border-color_reverse_sec bg-color_reverse_sec text-color_main shadow-lg'
                                        : 'border-border_detail bg-color_sec text-color_text hover:bg-color_hover hover:border-color_reverse_sec'
                                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                title={currentStatus === 'Dropped' ? 'Click to remove status' : 'Click to set as Dropped'}
                            >
                                {updatingStatus === 'Dropped' ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                ) : (
                                    <MdOutlineCancel className="w-4 h-4" />
                                )}
                            </button>

                            {/* Plan to Play Button */}
                            <button
                                onClick={(e) => handleStatusUpdate('Plan to play', e)}
                                disabled={isUpdating}
                                className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                                    currentStatus === 'Plan to play'
                                        ? 'border-color_reverse_sec bg-color_reverse_sec text-color_main shadow-lg'
                                        : 'border-border_detail bg-color_sec text-color_text hover:bg-color_hover hover:border-color_reverse_sec'
                                } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                title={currentStatus === 'Plan to play' ? 'Click to remove status' : 'Click to set as Plan to Play'}
                            >
                                {updatingStatus === 'Plan to play' ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                ) : (
                                    <FaList className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Game cover image container with aspect ratio */}
                <Link href={`/game/${game.slug}`} className="block">
                    <div className="aspect-[3/4] overflow-hidden">
                        <Image
                            src={game.cover ? "https:" + getCoverImageUrl(game.cover.url) : "/cover.webp"}
                            alt={`${game.name} cover image`}
                            width={200}
                            height={300}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            draggable={false}
                        />
                    </div>
                </Link>
            </div>
            
            {/* Game information section */}
            <div className="p-3">
                {/* Game title */}
                <Link href={`/game/${game.slug}`}>
                    <h3 className="font-semibold text-color_text text-sm mb-1 group-hover:text-color_reverse_sec transition-colors overflow-hidden text-ellipsis whitespace-nowrap">
                        {game.name}
                    </h3>
                </Link>
                
                {/* Game genres (limited to first 2 genres) */}
                {game.genres && game.genres.length > 0 && (
                    <p className="text-xs text-color_text_sec mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        {game.genres.slice(0, 2).map(genre => genre.name).join(', ')}
                        {game.genres.length > 2 && '...'}
                    </p>
                )}
                
                {/* Bottom section with rating and price */}
                <div className="flex justify-between items-center">
                    {/* Game rating circle (if rating exists) */}
                    {game.total_rating && (
                        <RatingCircle score={Math.round(game.total_rating)} size={32} />
                    )}
                    
                    {/* Game price (if available) */}
                    {game.price && (
                        <div className="bg-gradient-to-r from-color_reverse_sec to-color_reverse_sec/90 px-3 py-1.5 rounded-lg flex items-center justify-center min-w-[60px] shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border border-border_detail/20">
                        <span className="text-sm font-bold bg-gradient-to-r from-color_main to-color_main/80 bg-clip-text text-transparent">
                            ${game.price}
                        </span>
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
};
