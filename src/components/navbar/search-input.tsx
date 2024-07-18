'use client'

import { fetchGamesBySearch } from "@/src/services/igdbServices/searchGames";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const categoryMap: { [key: number]: string } = {
    0: 'Main Game',
    1: 'DLC/Addon',
    2: 'Expansion',
    3: 'Bundle',
    4: 'Standalone Expansion',
    5: 'Mod',
    6: 'Episode',
    7: 'Season',
    8: 'Remake',
    9: 'Remaster',
    10: 'Expanded Game',
    11: 'Port',
    12: 'Fork',
    13: 'Pack',
    14: 'Update'
};

export const SearchInput = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchGames, setSearchGames] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getGames = setTimeout(async () => {
            if (searchTerm.length >= 3) {
                const games = await fetchGamesBySearch(searchTerm);
                if (games !== undefined) {
                    setSearchGames(games);
                } else {
                    setNoResults(true);
                }
            } else {
                setSearchGames([]);
            }
        }, 500);
        return () => {
            clearTimeout(getGames);
        };
    }, [searchTerm])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <>
            <div className="relative w-full max-w-sm md:max-w-5xl text-color_text" ref={dropdownRef}>
                <form action="" className="">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute fill-color_icons left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 ml-1" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
                    </svg>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        placeholder="Search games..."
                        className="w-full p-2 pl-10 rounded-md bg-color_sec border border-border_detail"
                    />
                </form>
                {isDropdownOpen && searchTerm.length >= 1 && (
                    <div className="absolute w-full bg-color_sec mt-2 shadow-md border border-border_detail rounded-md">
                        <div className="flex flex-col p-2 pb-0">
                            {searchGames.map((game: Game) => (
                                <div key={game.id} className="flex p-2 rounded-md hover:bg-color_main">
                                    <Link href="/" className="flex">
                                        <img src={game.cover.url} alt="" className="w-50 rounded-md" draggable="false" />
                                        <div className="flex space-x-2">
                                            <p className="ml-2">{game.name}</p>
                                            <p className="text-gray-400"> | {categoryMap[game.category] || 'Unknown Category'}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        {searchGames.length >= 1 ?
                            (
                                <div className="p-2 pt-0">
                                    <Link href="games/search" className="w-full items-center text-center flex p-2 rounded-md hover:bg-color_main">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2  fill-color_icons" width="1em" height="1em" viewBox="0 0 24 24">
                                            <path d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
                                        </svg>
                                        View more...
                                    </Link>
                                </div>
                            )
                            : (
                                <div className="w-full items-center text-center flex p-2 pt-0 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 fill-color_icons" width="1em" height="1em" viewBox="0 0 24 24">
                                        <circle cx="12" cy="2" r="0"><animate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                        </circle>
                                        <circle cx="12" cy="2" r="0" fill="#27272a" transform="rotate(45 12 12)">
                                            <animate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                        </circle>
                                        <circle cx="12" cy="2" r="0" fill="#27272a" transform="rotate(90 12 12)">
                                            <animate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                        </circle>
                                        <circle cx="12" cy="2" r="0" fill="#27272a" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                        </circle>
                                        <circle cx="12" cy="2" r="0" fill="#27272a" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                        </circle>
                                        <circle cx="12" cy="2" r="0" fill="#27272a" transform="rotate(225 12 12)"><animate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                        </circle>
                                        <circle cx="12" cy="2" r="0" fill="#27272a" transform="rotate(270 12 12)"><animate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                        </circle>
                                        <circle cx="12" cy="2" r="0" fill="#27272a" transform="rotate(315 12 12)"><animate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                                        </circle>
                                    </svg>
                                    Loading...
                                </div>
                            )}
                    </div>
                )}
            </div>
        </>
    );
}