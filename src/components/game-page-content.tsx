import { GameCard } from "@/src/components/game-card";
import { LoadingIcon } from "@/src/components/svg/loading";
import Image from 'next/image';
import Link from "next/link";
import { useState } from "react";
import { useGameStatusOptimized } from "@/src/hooks/useGameStatusOptimized";

interface GameInfoProps {
    game: Game;
}

export const GamePageContent: React.FC<GameInfoProps> = ({ game }) => {
    const [showAllDeals, setShowAllDeals] = useState(false);
    
    // Collect all related game IDs
    const relatedGameIds = [
        ...(game.expanded_games || []).map(g => g.id),
        ...(game.expansions || []).map(g => g.id),
        ...(game.dlcs || []).map(g => g.id),
        ...(game.bundles || []).map(g => g.id),
        ...(game.remakes || []).map(g => g.id),
        ...(game.remasters || []).map(g => g.id),
        ...(game.standalone_expansions || []).map(g => g.id),
        ...(game.forks || []).map(g => g.id),
        ...(game.similar_games || []).map(g => g.id),
        ...(game.parent_game ? [game.parent_game.id] : [])
    ];
    
    // Use the optimized game status hook for related games
    const { gameStatuses } = useGameStatusOptimized(relatedGameIds);
    
    // Helper function to render GameCard with status
    const renderGameCard = (game: Game) => {
        const userGameStatus = gameStatuses[game.id] ? { status: gameStatuses[game.id] } : null;
        return (
            <GameCard 
                key={game.id} 
                game={game} 
                userGameStatus={userGameStatus}
            />
        );
    };

    return (
        <div className="space-y-8">
            {/* Summary Section */}
            {game.summary && (
                <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                    <h2 className="text-color_text text-2xl font-bold mb-4">Summary</h2>
                    <p className="text-color_text_sec text-lg leading-relaxed">{game.summary}</p>
                </div>
            )}

            {/* Storyline Section */}
            {game.storyline && (
                <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                    <h2 className="text-color_text text-2xl font-bold mb-4">Story</h2>
                    <p className="text-color_text_sec text-lg leading-relaxed">{game.storyline}</p>
                </div>
            )}

            {/* Deals Section */}
            {game.deals && game.deals.length > 0 && (
                <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                    <h2 className="text-color_text text-2xl font-bold mb-6">Best Deals</h2>
                    <div className="space-y-4">
                        {game.deals
                            .sort((a, b) => parseFloat(a.salePrice) - parseFloat(b.salePrice))
                            .slice(0, showAllDeals ? game.deals.length : 5)
                            .map((deal) => (
                                <div key={deal.dealID} className="flex items-center p-4 bg-color_main rounded-lg hover:bg-color_click transition-colors duration-200">
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={`https://www.cheapshark.com${deal.store.images.logo}`}
                                            alt={`${deal.store.storeName} logo`}
                                            width={80}
                                            height={80}
                                            className="w-16 h-16 rounded-lg object-cover"
                                            draggable={false}
                                        />
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <h3 className="text-color_text font-medium">{deal.title}</h3>
                                        <p className="text-color_text_sec text-sm">{deal.store.storeName}</p>
                                    </div>
                                    <Link 
                                        href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 bg-color_reverse_sec hover:bg-color_reverse px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                                    >
                                        <span className="text-color_main font-bold text-lg">
                                            ${deal.salePrice}
                                        </span>
                                    </Link>
                                </div>
                            ))}
                    </div>
                    {game.deals.length > 5 && !showAllDeals && (
                        <button
                            onClick={() => setShowAllDeals(true)}
                            className="mt-6 w-full bg-color_reverse_sec hover:bg-color_reverse text-color_main px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                        >
                            View All {game.deals.length} Deals
                        </button>
                    )}
                </div>
            )}

            {/* Related Games Sections */}
            <div className="space-y-8">
                {/* Expanded Games */}
                {game.expanded_games && game.expanded_games.length > 0 && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">Expanded Games</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {game.expanded_games.map(renderGameCard)}
                        </div>
                    </div>
                )}

                {/* Expansions */}
                {game.expansions && game.expansions.length > 0 && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">Expansions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {game.expansions.map(renderGameCard)}
                        </div>
                    </div>
                )}

                {/* DLCs */}
                {game.dlcs && game.dlcs.length > 0 && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">DLCs</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {game.dlcs.map(renderGameCard)}
                        </div>
                    </div>
                )}

                {/* Bundles */}
                {game.bundles && game.bundles.length > 0 && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">Bundles</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {game.bundles.map(renderGameCard)}
                        </div>
                    </div>
                )}

                {/* Remakes */}
                {game.remakes && game.remakes.length > 0 && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">Remakes</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {game.remakes.map(renderGameCard)}
                        </div>
                    </div>
                )}

                {/* Remasters */}
                {game.remasters && game.remasters.length > 0 && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">Remasters</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {game.remasters.map(renderGameCard)}
                        </div>
                    </div>
                )}

                {/* Parent Game */}
                {game.parent_game && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">Parent Game</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {renderGameCard(game.parent_game)}
                        </div>
                    </div>
                )}

                {/* Standalone Expansions */}
                {game.standalone_expansions && game.standalone_expansions.length > 0 && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">Standalone Expansions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {game.standalone_expansions.map(renderGameCard)}
                        </div>
                    </div>
                )}

                {/* Forks */}
                {game.forks && game.forks.length > 0 && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">Forks</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {game.forks.map(renderGameCard)}
                        </div>
                    </div>
                )}

                {/* Similar Games */}
                {game.similar_games && game.similar_games.length > 0 && (
                    <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                        <h2 className="text-color_text text-2xl font-bold mb-6">Similar Games</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {game.similar_games.map(renderGameCard)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}