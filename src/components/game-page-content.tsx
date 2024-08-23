import { GameCard } from "@/src/components/game-card";
import { LoadingIcon } from "@/src/components/svg/loading";
import Image from 'next/image';
import Link from "next/link";
import { useState } from "react";

interface GameInfoProps {
    game: Game;
}

export const GamePageContent: React.FC<GameInfoProps> = ({ game }) => {
    const [showAllDeals, setShowAllDeals] = useState(false);
    
    return (
        <div className="p-2">
            {game.summary &&
                <>
                    <h1 className="text-color_text text-2xl mb-2">Summary</h1>
                    <p className="text-color_text_sec text-lg">{game.summary}</p>
                </>
            }
            {game.storyline &&
                <>
                    <h1 className={`mt-4 text-color_text text-2xl mb-2 ${game.summary ? "mt-8" : ""}`}>History</h1>
                    <p className="text-color_text_sec text-lg">{game.storyline}</p>
                </>
            }


            {game.deals && (
                <div>
                    <hr className="mt-8 mb-8 border-border_detail" />
                    <h1 className="mt-4 mb-4 text-color_text text-2xl">Best Deals</h1>
                    <div className="space-y-2">
                        {game.deals
                            .sort((a, b) => parseFloat(a.salePrice) - parseFloat(b.salePrice))
                            .slice(0, showAllDeals ? game.deals.length : 5)
                            .map((deal) => (
                                <div key={deal.dealID} className="p-4 bg-color_main rounded-lg flex items-center">
                                    <Image
                                        src={`https://www.cheapshark.com${deal.store.images.logo}`}
                                        alt="Store logo"
                                        width={80}
                                        height={80}
                                        className="w-16 h-16 rounded-full mr-4"
                                        draggable={false}
                                    />
                                    <div className="flex-col flex-grow">
                                        <p>{deal.title}</p>
                                        <p>{deal.store.storeName}</p>
                                    </div>
                                    <Link href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-color_reverse_sec px-2 py-1.5 rounded-lg ml-auto transition-transform hover:scale-105">
                                        <p className="text-md text-color_main ">
                                            <b>{deal.salePrice}$</b>
                                        </p>
                                    </Link>
                                </div>
                            ))}
                    </div>
                    {game.deals.length > 5 && !showAllDeals && (
                        <button
                            onClick={() => setShowAllDeals(true)}
                            className="mt-4 bg-color_reverse_sec text-color_main w-full px-4 py-2 rounded-lg"
                        >
                            See More
                        </button>
                    )}
                </div>
            )}

            <hr className="mt-8 mb-8 border-border_detail" />

            {game.expanded_games &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">Expanded games</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.expanded_games.length > 0 ? (
                            game.expanded_games.map((expanded_game) => (
                                <GameCard key={expanded_game.id} game={expanded_game} />
                            ))
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }

            {game.expansions &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">Expansions</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.expansions.length > 0 ? (
                            game.expansions.map((expansion) => (
                                <GameCard key={expansion.id} game={expansion} />
                            ))
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }

            {game.dlcs &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">DLCs</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.dlcs.length > 0 ? (
                            game.dlcs.map((dlc) => (
                                <GameCard key={dlc.id} game={dlc} />
                            ))
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }

            {game.bundles &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">Bundles</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.bundles.length > 0 ? (
                            game.bundles.map((bundle) => (
                                <GameCard key={bundle.id} game={bundle} />
                            ))
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }

            {game.remakes &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">Remakes</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.remakes.length > 0 ? (
                            game.remakes.map((remake) => (
                                <GameCard key={remake.id} game={remake} />
                            ))
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }

            {game.remasters &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">Remakes</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.remasters.length > 0 ? (
                            game.remasters.map((remaster) => (
                                <GameCard key={remaster.id} game={remaster} />
                            ))
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }

            {game.parent_game &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">Parent Game</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.parent_game ? (
                            <GameCard key={game.parent_game.id} game={game.parent_game} />
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }

            {game.standalone_expansions &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">Standalone Expansions</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.standalone_expansions.length > 0 ? (
                            game.standalone_expansions.map((standalone_expansion) => (
                                <GameCard key={standalone_expansion.id} game={standalone_expansion} />
                            ))
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }

            {game.forks &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">Forks</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.forks.length > 0 ? (
                            game.forks.map((fork) => (
                                <GameCard key={fork.id} game={fork} />
                            ))
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }

            {game.similar_games &&
                <>
                    <h1 className="mt-4 text-color_text text-2xl">Similar Games</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {game.similar_games.length > 0 ? (
                            game.similar_games.map((similar_game) => (
                                <GameCard key={similar_game.id} game={similar_game} />
                            ))
                        ) : (
                            <div className="flex justify-center w-full">
                                <LoadingIcon className="fill-color_icons" />
                            </div>
                        )}
                    </div>
                </>
            }
        </div>
    )
}