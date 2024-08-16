import { fetchGamesBySearchFilter } from "@/src/services/igdbServices/searchGamesFilters";
import { SearchPage } from "./search";

interface SearchProps {
    searchParams: {
        term?: string;
        genres?: string;
        themes?: string;
        platforms?: string;
        perspectives?: string;
        gameModes?: string;
    };
}

export async function generateMetadata({ searchParams }: SearchProps) {
    const term = searchParams.term || "Search";
    return {
        title: `${term} | GameHub`,
    };
}

const Search: React.FC<SearchProps> = async ({ searchParams }) => {
    const term = searchParams.term || "";

    const filters = {
        genres: searchParams.genres ? searchParams.genres.split(',') : [],
        themes: searchParams.themes ? searchParams.themes.split(',') : [],
        platforms: searchParams.platforms ? searchParams.platforms.split(',') : [],
        perspectives: searchParams.perspectives ? searchParams.perspectives.split(',') : [],
        gameModes: searchParams.gameModes ? searchParams.gameModes.split(',') : [],
    };

    let games = [] as Game[];

    if (term) {
        games = await fetchGamesBySearchFilter(term, filters);
    }
    return <SearchPage term={term} games={games} initialFilters={filters} />;
};

export default Search;