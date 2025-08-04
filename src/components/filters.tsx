import Accordion from "@/src/components/filter-accordion";
import { genres } from "@/src/constants/genres";
import { themes } from "@/src/constants/themes";
import { platforms } from "@/src/constants/platforms";
import { perspectives } from "@/src/constants/perspectives";
import { gameModes } from "@/src/constants/game-modes";

/**
 * Filters interface - Represents the structure of game filter selections
 * Contains arrays of selected filter values for each filter category
 */
interface Filters {
    genres: string[];        // Selected game genres
    themes: string[];        // Selected game themes
    platforms: string[];     // Selected gaming platforms
    perspectives: string[];  // Selected camera perspectives
    gameModes: string[];     // Selected game modes
}

/**
 * Filters component - Game search and filtering interface
 * Provides a comprehensive filtering system for games using accordion-style filter groups
 * Includes filters for genres, themes, platforms, perspectives, and game modes
 * 
 * @param selectedFilters - Object containing currently selected filter values
 * @param handleFilterChange - Function to handle filter selection changes
 * @returns JSX element representing the complete filtering interface
 */
export default function Filters({ selectedFilters, handleFilterChange }: { selectedFilters: Filters, handleFilterChange: (filterType: keyof Filters, value: string) => void }) {
    return (
        <>
            {/* Genres filter accordion */}
            <Accordion
                title="Genres"
                filters={genres}
                selectedFilters={selectedFilters.genres}
                handleFilterChange={(value) => handleFilterChange('genres', value)}
            />
            {/* Themes filter accordion */}
            <Accordion
                title="Themes"
                filters={themes}
                selectedFilters={selectedFilters.themes}
                handleFilterChange={(value) => handleFilterChange('themes', value)}
            />
            {/* Platforms filter accordion */}
            <Accordion
                title="Platforms"
                filters={platforms}
                selectedFilters={selectedFilters.platforms}
                handleFilterChange={(value) => handleFilterChange('platforms', value)}
            />
            {/* Perspectives filter accordion */}
            <Accordion
                title="Perspectives"
                filters={perspectives}
                selectedFilters={selectedFilters.perspectives}
                handleFilterChange={(value) => handleFilterChange('perspectives', value)}
            />
            {/* Game modes filter accordion */}
            <Accordion
                title="Game Modes"
                filters={gameModes}
                selectedFilters={selectedFilters.gameModes}
                handleFilterChange={(value) => handleFilterChange('gameModes', value)}
            />
        </>
    );
}