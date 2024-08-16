'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/src/components/footer";
import { GameCard } from "@/src/components/game-card";
import { Navbar } from "@/src/components/navbar/navbar";
import { genres } from "@/src/constants/genres";
import Accordion from "@/src/components/filter-accordion";
import { themes } from "@/src/constants/themes";
import { platforms } from "@/src/constants/platforms";
import { perspectives } from "@/src/constants/perspectives";
import { gameModes } from "@/src/constants/game-modes";
import { ErrorIcon } from "@/src/components/svg/alert/error-icon";
import Filters from "@/src/components/filters";
import { SearchIcon } from "@/src/components/svg/search-icon";
import { FiltersIcon } from "@/src/components/svg/filter-icon";

interface SearchPageProps {
    term?: string;
    games?: Game[];
    initialFilters: {
        genres: string[];
        themes: string[];
        platforms: string[];
        perspectives: string[];
        gameModes: string[];
    };
}

export const SearchPage: React.FC<SearchPageProps> = ({ term, games, initialFilters }) => {
    const [searchTerm, setSearchTerm] = useState(term || "");
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const filterParams = Object.entries(selectedFilters)
                .filter(([_, values]) => values.length > 0)
                .map(([key, values]) => `${key}=${values.join(',')}`)
                .join('&');
            const searchUrl = `/search?term=${encodeURIComponent(searchTerm.trim())}${filterParams ? '&' + filterParams : ''}`;
            console.log('Search URL:', searchUrl);
            router.push(searchUrl);
        }
    };

    const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };
            if (newFilters[filterType].includes(value)) {
                newFilters[filterType] = newFilters[filterType].filter(v => v !== value);
            } else {
                newFilters[filterType] = [...newFilters[filterType], value];
            }
            return newFilters;
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 transition-colors duration-200 pt-24 relative px-4 xl:px-24">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-transform duration-300 ${isFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="relative bg-color_main w-full h-full p-4 overflow-auto">
                            <button
                                onClick={() => setIsFiltersOpen(false)}
                                className="absolute top-4 right-4 text-xl"
                            >
                                &times;
                            </button>
                            <h1 className="text-xl font-bold mb-4">Filters</h1>
                            <Filters selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} />
                        </div>
                    </div>

                    <div className="w-full md:w-3/4">
                        <form onSubmit={handleSearch} className="flex mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search games..."
                                className="w-full p-2 rounded-md bg-color_sec border border-border_detail transition-colors duration-200 mr-2"
                            />
                            <button type="submit" className="px-4 py-2 bg-color_reverse_sec text-color_main rounded-md">
                                <SearchIcon width="1.5rem" height="1.5rem" className="fill-color_main" />
                            </button>
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                    className="px-4 py-2 bg-color_reverse_sec text-color_main rounded-md ml-2"
                                >
                                    <FiltersIcon width="1.5rem" height="1.5rem" className="fill-color_main" />
                                </button>
                            </div>
                        </form>

                        {games && games.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                {games.map(game => (
                                    <GameCard key={game.id} game={game} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <ErrorIcon className="fill-color_icons ml-4" />
                                <p className="text-color_text text-lg p-4 px-2">No games found for "{term}". Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block w-1/4 space-y-4">
                        <h1 className="rounded-lg px-4 pt-2 text-color_text text-xl"><b>Filters</b></h1>
                        <Filters selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
