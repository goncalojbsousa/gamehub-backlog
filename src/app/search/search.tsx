'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/src/components/footer";
import { GameCard } from "@/src/components/game-card";
import { Navbar } from "@/src/components/navbar/navbar";
import { ErrorIcon } from "@/src/components/svg/alert/error-icon";
import Filters from "@/src/components/filters";
import { SearchIcon } from "@/src/components/svg/search-icon";
import { FiltersIcon } from "@/src/components/svg/filter-icon";
import { getCoverImageUrl } from "@/src/utils/utils";

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
        <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-background" style={mainStyle}>
            <Navbar />

            {/* Hero Section with Search */}
            <div className="relative overflow-hidden">

                <div className="relative z-10">
                    <div className="container mx-auto px-4 lg:px-8 py-8">
                        {/* Search Header */}
                        <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail relative overflow-hidden mb-8">
                            {/* Background Image Overlay */}
                            {games && games.length > 0 && (
                                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                                    <div
                                        className="absolute top-0 right-0 w-full h-full bg-cover bg-center rounded-xl"
                                        style={{
                                            backgroundImage: `url(${getCoverImageUrl(`https://${games[0]?.screenshots?.[0]?.url || ''}`)})`,
                                        }}
                                    ></div>
                                </div>
                            )}
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <h1 className="text-3xl lg:text-4xl font-bold text-color_text mb-6">
                                    🔍 Search Games
                                </h1>
                                
                                {/* Search Form */}
                                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search for games, genres, or themes..."
                                            className="w-full p-4 pl-12 rounded-lg bg-color_main border border-border_detail transition-colors duration-200 focus:outline-none focus:border-input_detail text-color_text placeholder-color_text_sec"
                                        />
                                        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 fill-color_icons w-5 h-5" />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="px-8 py-4 bg-color_reverse_sec text-color_main rounded-lg hover:bg-color_reverse transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Search
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                        className="px-6 py-4 bg-color_sec border border-border_detail text-color_text rounded-lg hover:bg-color_hover filter-button-hover font-medium shadow-lg hidden sm:block lg:hidden"
                                    >
                                        <FiltersIcon className="fill-color_icons w-5 h-5" />
                                    </button>
                                </form>

                                {/* Search Results Summary */}
                                {term && (
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-color_text_sec text-sm">
                                                {games && games.length > 0 ? (
                                                    <>
                                                        <span className="font-medium text-color_text">{games.length}</span> results for &quot;{term}&quot;
                                                    </>
                                                ) : (
                                                    <>No results for &quot;{term}&quot;</>
                                                )}
                                            </span>
                                        </div>
                                        {games && games.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-color_text_sec bg-color_main px-2 py-1 rounded-full">
                                                    {Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0)} filters active
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Filters Modal */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden transition-all duration-300 ${isFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`absolute right-0 top-0 h-full w-full max-w-sm bg-color_main shadow-2xl transition-transform duration-300 filter-modal-enter ${isFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border_detail">
                            <h2 className="text-2xl font-bold text-color_text">Filters</h2>
                            <button
                                onClick={() => setIsFiltersOpen(false)}
                                className="text-2xl text-color_text hover:text-color_text_sec transition-colors p-2"
                            >
                                &times;
                            </button>
                        </div>
                        
                        {/* Filters Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <Filters selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} />
                        </div>
                        
                        {/* Footer */}
                        <div className="p-6 border-t border-border_detail">
                            <button
                                onClick={() => setIsFiltersOpen(false)}
                                className="w-full py-3 bg-color_reverse_sec text-color_main rounded-lg hover:bg-color_reverse transition-all duration-200 font-medium"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Desktop Filters Sidebar */}
                        <div className="hidden lg:block w-80 flex-shrink-0">
                            <div className="bg-color_sec rounded-xl p-6 shadow-lg border border-border_detail sticky top-24 animate-slide-in-up">
                                <h2 className="text-xl font-bold mb-6 text-color_text">Filters</h2>
                                <Filters selectedFilters={selectedFilters} handleFilterChange={handleFilterChange} />
                            </div>
                        </div>

                        {/* Floating Filters Button for Mobile Only */}
                        <div className="fixed bottom-6 right-6 z-40 sm:hidden">
                            <button
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                className="bg-color_reverse_sec text-color_main p-4 rounded-full shadow-lg filter-button-hover relative floating-button-pulse"
                                title="Open Filters"
                            >
                                <FiltersIcon className="fill-color_main w-6 h-6" />
                                {/* Active Filters Indicator */}
                                {Object.values(selectedFilters).some(filters => filters.length > 0) && (
                                    <span className="absolute -top-2 -right-2 bg-color_accent text-color_main text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center filter-checkbox-enter">
                                        {Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0)}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Games Results */}
                        <div className="flex-1">
                            {games && games.length > 0 ? (
                                <div className="animate-slide-in-up">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                                        {games.map(game => (
                                            <GameCard key={game.id} game={game} />
                                        ))}
                                    </div>
                                </div>
                            ) : term ? (
                                <div className="flex flex-col items-center justify-center py-16 animate-slide-in-up">
                                    <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail text-center max-w-md">
                                        <ErrorIcon className="fill-color_icons w-16 h-16 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-color_text mb-2">No Games Found</h3>
                                        <p className="text-color_text_sec mb-4">
                                            No games found for &quot;{term}&quot;. Try adjusting your filters or search terms.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSearchTerm("");
                                                router.push("/search");
                                            }}
                                            className="px-6 py-3 bg-color_reverse_sec text-color_main rounded-lg hover:bg-color_reverse transition-all duration-200 font-medium"
                                        >
                                            Clear Search
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 animate-slide-in-up">
                                    <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail text-center max-w-md">
                                        <SearchIcon className="fill-color_icons w-16 h-16 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-color_text mb-2">Start Your Search</h3>
                                        <p className="text-color_text_sec">
                                            Enter a game name, genre, or theme to discover amazing games.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <Footer />
            </div>
        </main>
    );
};
