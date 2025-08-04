/**
 * Store interface - Represents a game store or retailer
 * Contains information about stores that sell games and their branding
 */
interface Store {
    storeID: string;         // Unique identifier for the store
    storeName: string;       // Human-readable name of the store
    isActive: boolean;       // Whether the store is currently active
    images: {
        logo: string;        // Store logo image URL
        icon: string;        // Store icon image URL
    };
}

/**
 * Deal interface - Represents a game deal or sale
 * Contains pricing information and deal details from CheapShark API
 */
interface Deal {
    internalName: string;        // Internal game name
    title: string;               // Display title of the game
    metacriticLink: string;      // Link to Metacritic review
    dealID: string;              // Unique deal identifier
    storeID: string;             // Store where deal is available
    gameID: string;              // Game identifier
    salePrice: string;           // Current sale price
    normalPrice: string;         // Regular price before sale
    isOnSale: string;            // Whether game is currently on sale
    savings: string;             // Percentage saved
    metacriticScore: string;     // Metacritic review score
    steamRatingText: string;     // Steam rating description
    steamRatingPercent: string;  // Steam rating percentage
    steamRatingCount: string;    // Number of Steam ratings
    steamAppID: string;          // Steam application ID
    releaseDate: number;         // Game release timestamp
    lastChange: number;          // Last price change timestamp
    dealRating: string;          // Deal quality rating
    thumb: string;               // Thumbnail image URL
    store: Store;                // Associated store information
}

/**
 * Website interface - Represents game-related websites
 * Contains URLs and categories for official and fan websites
 */
interface Website {
    url: string;         // Website URL
    category: number;    // Website category (IGDB category ID)
}

/**
 * Game interface - Main game data structure
 * Comprehensive interface representing all game information from IGDB API
 * Includes metadata, ratings, relationships, and external data
 */
declare interface Game {
    id: number;          // Unique game identifier
    name: string;        // Game title
    cover: {
        url: string;     // Game cover image URL
    };
    category: number;    // Game category (main game, DLC, etc.)
    version_title: string; // Version-specific title
    summary: string;     // Game description/summary
    storyline: string;   // Game storyline/narrative
    
    // Game classifications
    genres: {            // Game genres
        name: string;
    }[];
    themes: {            // Game themes
        name: string;
    }[];
    player_perspectives: { // Camera perspectives
        name: string;
    }[];
    game_modes: {        // Multiplayer modes
        name: string;
    }[];
    platforms: {         // Supported platforms
        name: string;
    }[];
    
    first_release_date: number; // Release date timestamp
    
    screenshots: {       // Game screenshots
        url: string;
    }[];
    
    language_supports: { // Supported languages
        language: {
            native_name: string;
        },
        language_support_type: {
            name: string;
        },
    }[];
    
    involved_companies: { // Companies involved in development
        company: {
            id: number;
            name: string;
            logo: {
                url: string;
            };
        };
        developer: boolean;    // Is developer
        porting: boolean;      // Is porting company
        publisher: boolean;    // Is publisher
        supporting: boolean;   // Is supporting company
    }[];
    
    slug: string;        // URL-friendly game identifier
    
    // Rating information
    total_rating: number;      // Average rating
    aggregated_rating: number; // Aggregated critic rating
    rating: number;            // User rating
    
    // Game relationships
    similar_games: Game[];           // Similar games
    expanded_games: Game[];          // Expanded versions
    expansions: Game[];              // Expansion packs
    dlcs: Game[];                    // Downloadable content
    bundles: Game[];                 // Game bundles
    remakes: Game[];                 // Remake versions
    remasters: Game[];               // Remastered versions
    parent_game: Game;               // Original game (for DLC/expansions)
    standalone_expansions: Game[];   // Standalone expansions
    forks: Game[];                   // Forked versions
    
    // External data
    websites: {                      // Related websites
        url: string;
        category: number;
    }[];
    price: string;                   // Current price
    deals?: Deal[];                  // Available deals
    websites?: Website[];            // Alternative websites array
}