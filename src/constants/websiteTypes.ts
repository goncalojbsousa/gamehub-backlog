/**
 * Website Types constants - IGDB website type IDs
 * Maps website type IDs to their corresponding platforms
 * Used for identifying Steam and other platform websites
 * 
 * ⚠️ WARNING: These IDs may change with IGDB API v4 updates
 * Monitor IGDB documentation for changes to website_types endpoint
 */
export const WEBSITE_TYPES = {
    STEAM: 13, // Steam store page - may change with new API
    // Add other website types as needed
} as const;

/**
 * Helper function to check if a website is Steam
 * @param websiteType - The website type ID from IGDB
 * @returns boolean indicating if the website is Steam
 */
export const isSteamWebsite = (websiteType: number): boolean => {
    return websiteType === WEBSITE_TYPES.STEAM;
};
