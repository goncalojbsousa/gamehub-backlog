'use client'

import { fetchGamesBySearch } from "@/src/services/igdbServices/searchGames";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingIndicator } from "./loading-indicator";
import { NoResults } from "./no-results";
import { SearchResults } from "./search-results";
import { ViewMoreButton } from "./view-more-button";
import { sanitizeInput } from "@/src/utils/sanitizeInput";
import { useRouter } from 'next/navigation';

export const SearchInput: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchGames, setSearchGames] = useState<Game[]>([]);
    const [noResults, setNoResults] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastRequestTime = useRef<number>(0);
    const requestCount = useRef<number>(0);
    const router = useRouter();

    const throttledFetchGames = useCallback(async (term: string) => {
        const now = Date.now();
        // LIMITS TO 1 REQUEST PER SECOUND
        if (now - lastRequestTime.current < 1000) {
            requestCount.current++;
            // LIMITS TO 5 REQUEST IN A SHORT PERIOD
            if (requestCount.current > 5) {
                console.log("Rate limit exceeded. Please wait.");
                return;
            }
        } else {
            requestCount.current = 0;
        }
        lastRequestTime.current = now;

        setIsLoading(true);
        const games = await fetchGamesBySearch(term);
        if (games && games.length > 0) {
            setSearchGames(games);
            setNoResults(false);
        } else {
            setSearchGames([]);
            setNoResults(true);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (searchTerm.length >= 1) {
            setIsLoading(true);
            setNoResults(false);
        }

        const sanitizedTerm = sanitizeInput(searchTerm);

        const getGames = setTimeout(() => {
            if (sanitizedTerm.length >= 3) {
                throttledFetchGames(sanitizedTerm);
            } else {
                setSearchGames([]);
                setNoResults(false);
                setIsLoading(false);
            }
        }, 500);

        return () => {
            clearTimeout(getGames);
        };
    }, [searchTerm, throttledFetchGames]);

    // CLOSE SEARCH RESULT WHEN CLICK OUTSIDE
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputFocus = () => {
        if (searchTerm.length >= 1) {
            setIsDropdownOpen(true);
        }
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const sanitizedTerm = sanitizeInput(searchTerm);
        if (sanitizedTerm.length >= 1) {
            router.push(`/search?term=${sanitizedTerm}`);
        }
    };

    return (
        <>
            <div className="relative w-full max-w-sm md:max-w-5xl text-color_text" ref={dropdownRef}>
                <form onSubmit={handleFormSubmit} className="">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute fill-color_icons left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 ml-1" width="1em" height="1em" viewBox="0 0 24 24">
                        <path d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchTerm(sanitizeInput(event.target.value));
                            setIsDropdownOpen(true);
                        }}
                        maxLength={100}
                        onFocus={handleInputFocus}
                        placeholder="Search games..."
                        className="w-full p-2 pl-10 rounded-md bg-color_sec border border-border_detail transition-colors duration-200"
                    />
                </form>
                {isDropdownOpen && searchTerm.length >= 1 && (
                    <div className="absolute w-full bg-color_sec mt-2 shadow-md border border-border_detail rounded-md">
                        {searchTerm.length < 3 ? (
                            <div className="p-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 fill-color_icons" width="1em" height="1em" viewBox="0 0 24 24">
                                    <g>
                                        <path fill="none" d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                        <path d="m13.299 3.148l8.634 14.954a1.5 1.5 0 0 1-1.299 2.25H3.366a1.5 1.5 0 0 1-1.299-2.25l8.634-14.954c.577-1 2.02-1 2.598 0M12 4.898L4.232 18.352h15.536zM12 15a1 1 0 1 1 0 2a1 1 0 0 1 0-2m0-7a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1" />
                                    </g>
                                </svg>
                                Please enter at least 3 characters to search.
                            </div>
                        ) :
                            isLoading ? (
                                <LoadingIndicator />
                            ) : noResults ? (
                                <NoResults searchTerm={searchTerm} />
                            ) : searchGames.length > 0 ? (
                                <>
                                    <SearchResults games={searchGames} />
                                    <ViewMoreButton searchTerm={sanitizeInput(searchTerm)} />
                                </>
                            ) : null}
                    </div>
                )}
            </div>
        </>
    );
}