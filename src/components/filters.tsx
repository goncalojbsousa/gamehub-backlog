import Accordion from "@/src/components/filter-accordion";
import { genres } from "@/src/constants/genres";
import { themes } from "@/src/constants/themes";
import { platforms } from "@/src/constants/platforms";
import { perspectives } from "@/src/constants/perspectives";
import { gameModes } from "@/src/constants/game-modes";

interface Filters {
    genres: string[];
    themes: string[];
    platforms: string[];
    perspectives: string[];
    gameModes: string[];
}

export default function Filters({ selectedFilters, handleFilterChange }: { selectedFilters: Filters, handleFilterChange: (filterType: keyof Filters, value: string) => void }) {
    return (
        <>
            <Accordion
                title="Genres"
                filters={genres}
                selectedFilters={selectedFilters.genres}
                handleFilterChange={(value) => handleFilterChange('genres', value)}
            />
            <Accordion
                title="Themes"
                filters={themes}
                selectedFilters={selectedFilters.themes}
                handleFilterChange={(value) => handleFilterChange('themes', value)}
            />
            <Accordion
                title="Platforms"
                filters={platforms}
                selectedFilters={selectedFilters.platforms}
                handleFilterChange={(value) => handleFilterChange('platforms', value)}
            />
            <Accordion
                title="Perspectives"
                filters={perspectives}
                selectedFilters={selectedFilters.perspectives}
                handleFilterChange={(value) => handleFilterChange('perspectives', value)}
            />
            <Accordion
                title="Game Modes"
                filters={gameModes}
                selectedFilters={selectedFilters.gameModes}
                handleFilterChange={(value) => handleFilterChange('gameModes', value)}
            />
        </>
    );
}