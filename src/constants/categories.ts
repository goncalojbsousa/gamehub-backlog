/**
 * Categories constants - Game content type classifications
 * Maps numeric category IDs to human-readable category names from IGDB
 * Used for categorizing games by their content type and relationship to other games
 * Includes main games, DLC, expansions, bundles, and various content types
 */
export const categories: { [key: number]: string } = {
    0: 'Main Game',           // Primary standalone game
    1: 'DLC/Addon',          // Downloadable content or add-on
    2: 'Expansion',          // Game expansion pack
    3: 'Bundle',             // Collection of games or content
    4: 'Standalone Expansion', // Expansion that can be played independently
    5: 'Mod',                // User-created modification
    6: 'Episode',            // Episode of a series
    7: 'Season',             // Seasonal content or battle pass
    8: 'Remake',             // Complete remake of an existing game
    9: 'Remaster',           // Enhanced version of an existing game
    10: 'Expanded Game',     // Enhanced version with additional content
    11: 'Port',              // Game ported to different platform
    12: 'Fork',              // Divergent version of a game
    13: 'Pack',              // Content pack or collection
    14: 'Update'             // Game update or patch
};
