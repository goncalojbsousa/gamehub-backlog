/**
 * Store interface - Represents a game store from CheapShark
 * Contains store information including ID, name, status, and branding images
 */
interface Store {
    storeID: string;         // Unique store identifier
    storeName: string;       // Human-readable store name
    isActive: boolean;       // Whether the store is currently active
    images: {
        logo: string;        // Store logo image URL
        icon: string;        // Store icon image URL
    };
}

/**
 * Fetches all available stores from CheapShark API
 * Retrieves a list of all game stores that provide pricing data
 * Used for store filtering and displaying store information
 * 
 * @returns Promise resolving to array of store objects
 */
export async function fetchAllStores(): Promise<Store[]> {

    // Make API request to CheapShark stores endpoint
    const allStoresResponse = await fetch('https://www.cheapshark.com/api/1.0/stores');

    // Parse and return the stores data
    const allStores = await allStoresResponse.json();

    return allStores;
}