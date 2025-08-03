import { useMemo, useState } from "react";
import { convertUnixToDate, getCoverImageUrl } from "@/src/utils/utils";
import { RatingCircle } from "@/src/components/rating-circle";
import { ShareButtons } from "@/src/components/share-buttons";
import Image from "next/image";
import { SearchIcon } from "@/src/components/svg/search-icon";

interface GameInfoProps {
    game: Game;
}

export const GameInfo: React.FC<GameInfoProps> = ({ game }) => {

    const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
    const [languageFilter, setLanguageFilter] = useState("");

    const toggleLanguageExpansion = () => {
        setIsLanguageExpanded(!isLanguageExpanded);
    };

    const filteredLanguages = useMemo(() => {
        return game.language_supports?.filter(language_support =>
            language_support.language.native_name.toLowerCase().includes(languageFilter.toLowerCase())
        ) || [];
    }, [game.language_supports, languageFilter]);

    return (
        <div className="space-y-6">
            {/* Game Cover */}
            {game.cover && (
                <div className="bg-color_sec rounded-xl overflow-hidden shadow-lg border border-border_detail">
                    <Image
                        src={game.cover ? "https:" + getCoverImageUrl(game.cover.url) : "/cover.webp"}
                        alt={game.name}
                        width={1280}
                        height={720}
                        className="w-full h-auto"
                        draggable={false}
                    />
                </div>
            )}

            {/* Ratings Section */}
            {(game.total_rating || game.aggregated_rating || game.rating) && (
                <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                    <h3 className="text-color_text font-semibold mb-4 text-lg">Ratings</h3>
                    <div className="flex justify-center items-center space-x-6">
                        {game.total_rating && (
                            <div className="relative group">
                                <RatingCircle score={Math.round(game.total_rating)} size={50} />
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    <div className="bg-color_main text-color_text text-xs px-2 py-1 rounded whitespace-nowrap border border-border_detail shadow-lg">
                                        IGDB Community
                                    </div>
                                </div>
                            </div>
                        )}
                        {game.aggregated_rating && (
                            <div className="relative group">
                                <RatingCircle score={Math.round(game.aggregated_rating)} size={50} />
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    <div className="bg-color_main text-color_text text-xs px-2 py-1 rounded whitespace-nowrap border border-border_detail shadow-lg">
                                        IGDB Critics
                                    </div>
                                </div>
                            </div>
                        )}
                        {game.rating && (
                            <div className="relative group">
                                <RatingCircle score={Math.round(game.rating)} size={50} />
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    <div className="bg-color_main text-color_text text-xs px-2 py-1 rounded whitespace-nowrap border border-border_detail shadow-lg">
                                        IGDB Rating
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Game Details */}
            <div className="bg-color_sec rounded-xl p-6 shadow-lg space-y-6 border border-border_detail">
                <h3 className="text-color_text font-semibold text-lg">Game Details</h3>
                
                {/* Genres */}
                {game.genres && (
                    <div>
                        <h4 className="text-color_text font-medium mb-2">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                            {game.genres.map((genre, index) => (
                                <span key={index} className="px-3 py-1 bg-color_main text-color_text text-sm rounded-full border border-border_detail">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Themes */}
                {game.themes && (
                    <div>
                        <h4 className="text-color_text font-medium mb-2">Themes</h4>
                        <div className="flex flex-wrap gap-2">
                            {game.themes.map((theme, index) => (
                                <span key={index} className="px-3 py-1 bg-color_main text-color_text text-sm rounded-full border border-border_detail">
                                    {theme.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Player Perspectives */}
                {game.player_perspectives && (
                    <div>
                        <h4 className="text-color_text font-medium mb-2">Perspective</h4>
                        <div className="flex flex-wrap gap-2">
                            {game.player_perspectives.map((player_perspective, index) => (
                                <span key={index} className="px-3 py-1 bg-color_main text-color_text text-sm rounded-full border border-border_detail">
                                    {player_perspective.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Game Modes */}
                {game.game_modes && (
                    <div>
                        <h4 className="text-color_text font-medium mb-2">Game Modes</h4>
                        <div className="flex flex-wrap gap-2">
                            {game.game_modes.map((game_mode, index) => (
                                <span key={index} className="px-3 py-1 bg-color_main text-color_text text-sm rounded-full border border-border_detail">
                                    {game_mode.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Release Date */}
                {game.first_release_date && (
                    <div>
                        <h4 className="text-color_text font-medium mb-2">Release Date</h4>
                        <p className="text-color_text_sec">{convertUnixToDate(game.first_release_date)}</p>
                    </div>
                )}

                {/* Platforms */}
                {game.platforms && (
                    <div>
                        <h4 className="text-color_text font-medium mb-2">Platforms</h4>
                        <div className="flex flex-wrap gap-2">
                            {game.platforms.map((platform, index) => (
                                <span key={index} className="px-3 py-1 bg-color_main text-color_text text-sm rounded-full border border-border_detail">
                                    {platform.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Language Support */}
            {game.language_supports && (
                <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                    <div
                        className="flex items-center justify-between cursor-pointer hover:bg-color_hover p-2 rounded-lg transition-colors duration-200 -m-2"
                        onClick={toggleLanguageExpansion}
                    >
                        <h3 className="text-color_text font-semibold text-lg">Language Support</h3>
                        <span className="text-color_text_sec text-xl">{isLanguageExpanded ? '▼' : '▶'}</span>
                    </div>
                    {isLanguageExpanded && (
                        <div className="mt-4 space-y-4">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 fill-color_icons" />
                                <input
                                    type="text"
                                    placeholder="Filter languages..."
                                    value={languageFilter}
                                    onChange={(e) => setLanguageFilter(e.target.value)}
                                    className="w-full p-3 pl-10 rounded-lg bg-color_main border border-border_detail text-color_text placeholder-color_text_sec focus:outline-none focus:ring-2 focus:ring-color_reverse_sec"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                                {filteredLanguages.map((language_support, index) => (
                                    <div key={index} className="flex flex-col p-3 border border-border_detail rounded-lg hover:bg-color_hover transition-colors duration-200">
                                        <p className="font-medium text-color_text">
                                            {language_support.language.native_name}
                                        </p>
                                        <p className="text-sm text-color_text_sec">
                                            {language_support.language_support_type.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {filteredLanguages.length === 0 && (
                                <p className="text-center text-color_text_sec py-4">No languages found.</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Involved Companies */}
            {game.involved_companies && game.involved_companies.length > 0 && (
                <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                    <h3 className="text-color_text font-semibold text-lg mb-4">Involved Companies</h3>
                    <div className="space-y-4">
                        {game.involved_companies.map(involved_companie => (
                            involved_companie.company.logo?.url && (
                                <div key={involved_companie.company.id} className="flex items-center p-3 hover:bg-color_hover rounded-lg transition-colors duration-200">
                                    <Image
                                        className="w-16 h-16 rounded-lg mr-4 object-cover"
                                        width={64}
                                        height={64}
                                        src={"https:" + getCoverImageUrl(involved_companie.company.logo.url)}
                                        alt={involved_companie.company.name} 
                                    />
                                    <div className="flex-1">
                                        <p className="text-color_text font-medium">{involved_companie.company.name}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {involved_companie.developer && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Developer</span>
                                            )}
                                            {involved_companie.porting && (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Porting</span>
                                            )}
                                            {involved_companie.publisher && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Publisher</span>
                                            )}
                                            {involved_companie.supporting && (
                                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Supporting</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Share Section */}
            <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail">
                <h3 className="text-color_text font-semibold text-lg mb-4">Share this game</h3>
                <ShareButtons 
                    title={game.name}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    description={game.summary}
                />
            </div>
        </div>
    )
};