import { useMemo, useState } from "react";
import { convertUnixToDate, getCoverImageUrl } from "@/src/utils/utils";
import { RatingCircle } from "@/src/components/rating-circle";
import Image from "next/image";

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
        <>
            {
                game.cover && (
                    <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
                        <Image
                            src={"https:" + getCoverImageUrl(game.cover.url)}
                            alt={game.name}
                            width={1280}
                            height={720}
                            className="w-full rounded-lg mb-2"
                            draggable={false}
                        />

                        {(game.total_rating || game.aggregated_rating || game.rating) &&
                            <>
                                <div className="m-6 flex justify-center items-center space-x-4 md:space-x-10">
                                    {game.total_rating && <RatingCircle score={Math.round(game.total_rating)} size={45} />}
                                    {game.aggregated_rating && <RatingCircle score={Math.round(game.aggregated_rating)} size={45} />}
                                    {game.rating && <RatingCircle score={Math.round(game.rating)} size={45} />}
                                </div>
                            </>
                        }

                        {game.genres && (
                            <div className="flex flex-col p-2 pb-0">
                                <p className="text-color_text">Genres:</p>
                                <div className="text-color_text_sec flex gap-1 p-1 flex-wrap">
                                    {game.genres.map((genre, index) => (
                                        <p key={index} className="border border-border_detail text-sm rounded-lg px-2 whitespace-nowrap">{genre.name}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {game.themes && (
                            <div className="flex flex-col p-2 pb-0">
                                <p className="text-color_text">Themes:</p>
                                <div className="text-color_text_sec flex flex-wrap gap-1 p-1">
                                    {game.themes.map((theme, index) => (
                                        <p key={index} className="border border-border_detail text-sm rounded-lg px-2 whitespace-nowrap">{theme.name}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {game.player_perspectives && (
                            <div className="flex flex-col p-2 pb-0">
                                <p className="text-color_text">Perspective:</p>
                                <div className="text-color_text_sec flex flex-wrap gap-1 p-1">
                                    {game.player_perspectives.map((player_perspective, index) => (
                                        <p key={index} className="border border-border_detail text-sm rounded-lg px-2 whitespace-nowrap">{player_perspective.name}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {game.game_modes && (
                            <div className="flex flex-col p-2 pb-0">
                                <p className="text-color_text">Game modes:</p>
                                <div className="text-color_text_sec flex flex-wrap gap-1 p-1">
                                    {game.game_modes.map((game_mode, index) => (
                                        <p key={index} className="border border-border_detail text-sm rounded-lg px-2 whitespace-nowrap">{game_mode.name}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {game.first_release_date &&
                            <div className="flex p-2">
                                <p className="text-color_text">Released on:&nbsp;</p>
                                <p className="text-color_text_sec">{convertUnixToDate(game.first_release_date)}</p>
                            </div>
                        }

                        {game.platforms && (
                            <div className="flex flex-col p-2 pb-0">
                                <p className="text-color_text">Platforms:</p>
                                <div className="text-color_text_sec flex gap-1 p-1 flex-wrap">
                                    {game.platforms.map((platform, index) => (
                                        <p key={index} className="border border-border_detail text-sm rounded-lg px-2 whitespace-nowrap">{platform.name}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {game.language_supports && (
                            <div className="flex flex-col">
                                <div
                                    className="flex items-center cursor-pointer hover:bg-color_main p-2 rounded-lg transition-colors duration-200"
                                    onClick={toggleLanguageExpansion}
                                >
                                    <p className="text-color_text">Language Support</p>
                                    <span className="text-color_text_sec ml-2">{isLanguageExpanded ? '▼' : '▶'}</span>
                                </div>
                                {isLanguageExpanded && (
                                    <div className="text-color_text_sec bg-color_bg_sec rounded-lg p-3">
                                        <div className="relative w-full mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 fill-color_icons" width="1em" height="1em" viewBox="0 0 24 24">
                                                <path d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Filter languages..."
                                                value={languageFilter}
                                                onChange={(e) => setLanguageFilter(e.target.value)}
                                                className="w-full p-2 pl-10 rounded-md bg-color_sec border border-border_detail"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            {filteredLanguages.map((language_support, index) => (
                                                <div key={index} className="flex flex-col border border-border_detail rounded-lg p-2 hover:bg-color_main transition-colors duration-200">
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
                                            <p className="text-center text-color_text_sec mt-2">No languages found.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <hr className="m-2 border border-border_detail" />

                        {game.involved_companies && (
                            <div className="flex flex-col mt-2">
                                <p className="text-color_text p-2">Involved Companies:</p>
                                {game.involved_companies.map(involved_companie => (
                                    involved_companie.company.logo?.url && (
                                        <div key={involved_companie.company.id} className="flex p-2 hover:bg-color_main rounded-lg transition-colors duration-200">
                                            <Image
                                                className="w-16 rounded-lg mr-2"
                                                width={1280}
                                                height={720}
                                                src={"https:" + getCoverImageUrl(involved_companie.company.logo.url)}
                                                alt={involved_companie.company.name} />
                                            <div>
                                                <p className="text-color_text">{involved_companie.company.name}</p>
                                                <div className="text-sm text-color_text_sec">
                                                    {involved_companie.developer && <p>Developer</p>}
                                                    {involved_companie.porting && <p>Porting</p>}
                                                    {involved_companie.publisher && <p>Publisher</p>}
                                                    {involved_companie.supporting && <p>Supporting</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                )
            }
        </>
    )
};