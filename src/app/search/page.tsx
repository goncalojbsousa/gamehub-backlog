import { fetchGamesBySearchFilter } from "@/src/services/igdbServices/searchGamesFilters";
import { SearchPage } from "@/src/app/search/search";

interface SearchProps {
    searchParams: Promise<{
        term?: string;
        genres?: string;
        themes?: string;
        platforms?: string;
        perspectives?: string;
        gameModes?: string;
    }>;
}

export async function generateMetadata({ searchParams }: SearchProps) {
    const params = await searchParams;
    const term = params.term || "Search";
    return {
        title: `${term} | GameHub`,
    };
}

const Search: React.FC<SearchProps> = async ({ searchParams }) => {
    const params = await searchParams;
    const term = params.term || "";

    const filters = {
        genres: params.genres ? params.genres.split(',') : [],
        themes: params.themes ? params.themes.split(',') : [],
        platforms: params.platforms ? params.platforms.split(',') : [],
        perspectives: params.perspectives ? params.perspectives.split(',') : [],
        gameModes: params.gameModes ? params.gameModes.split(',') : [],
    };

    let games = [] as Game[];

    if (term) {
        games = await fetchGamesBySearchFilter(term, filters);
    }
    return <SearchPage term={term} games={games} initialFilters={filters} />;
};

export default Search;