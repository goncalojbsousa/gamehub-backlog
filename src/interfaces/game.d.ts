interface Store {
    storeID: string;
    storeName: string;
    isActive: boolean;
    images: {
        logo: string;
        icon: string;
    };
}

interface Deal {
    internalName: string;
    title: string;
    metacriticLink: string;
    dealID: string;
    storeID: string;
    gameID: string;
    salePrice: string;
    normalPrice: string;
    isOnSale: string;
    savings: string;
    metacriticScore: string;
    steamRatingText: string;
    steamRatingPercent: string;
    steamRatingCount: string;
    steamAppID: string;
    releaseDate: number;
    lastChange: number;
    dealRating: string;
    thumb: string;
    store: Store; 
}

interface Website {
    url: string;
    category: number;
}

declare interface Game {
    id: number;
    name: string;
    cover: {
        url: string;
    };
    category: number;
    version_title: string;
    summary: string;
    storyline: string;
    genres: {
        name: string;
    }[];
    themes: {
        name: string;
    }[];
    player_perspectives: {
        name: string;
    }[];
    game_modes: {
        name: string;
    }[];
    platforms: {
        name: string;
    }[];
    first_release_date: number;
    screenshots: {
        url: string;
    }[];
    language_supports: {
        language: {
            native_name: string;
        },
        language_support_type: {
            name: string;
        },
    }[];
    involved_companies: {
        company: {
            id: number;
            name: string;
            logo: {
                url: string;
            };
        };
        developer: boolean;
        porting: boolean;
        publisher: boolean;
        supporting: boolean;
    }[];
    slug: string;
    total_rating: number;
    aggregated_rating: number;
    rating: number;
    similar_games: Game[];
    expanded_games: Game[];
    expansions: Game[];
    dlcs: Game[];
    bundles: Game[];
    remakes: Game[];
    remasters: Game[];
    parent_game: Game;
    standalone_expansions: Game[];
    forks: Game[];
    websites: {
        url: string;
        category: number;
    }[];
    price: string;
    deals?: Deal[];
    websites?: Website[];
}