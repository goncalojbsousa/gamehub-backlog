/**
 * Configuration for CheapShark API integration
 * Defines API endpoints, rate limiting settings, and request parameters
 * Ensures proper API usage and prevents abuse through configuration limits
 */
export const CHEAPSHARK_CONFIG = {
    // API Settings - Core configuration for API communication
    BASE_URL: 'https://www.cheapshark.com/api/1.0', // Base endpoint for all API calls
    ITEMS_PER_PAGE: 60, // Maximum allowed by CheapShark API per request
    MAX_PAGES: 5, // Limit to prevent excessive requests and API abuse
    
    // Rate Limiting - Settings to respect API rate limits
    DELAY_BETWEEN_REQUESTS: 500, // 500ms delay between consecutive requests
    RETRY_DELAY: 2000, // 2 seconds delay when rate limited before retry
    MAX_RETRIES: 1, // Number of retries on rate limit before giving up
    
    // Timeouts - Request timeout settings for reliability
    REQUEST_TIMEOUT: 10000, // 10 seconds timeout for API requests
} as const;

/**
 * Helper function to add delay between API requests
 * Prevents rate limiting by spacing out requests
 * 
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the specified delay
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper function to check if API response indicates rate limiting
 * Identifies HTTP 429 status code which indicates too many requests
 * 
 * @param status - HTTP status code from API response
 * @returns boolean indicating if the response indicates rate limiting
 */
export const isRateLimited = (status: number) => status === 429;

/**
 * Helper function to check if API response contains no data
 * Validates that the response contains meaningful data before processing
 * 
 * @param data - Array of data from API response
 * @returns boolean indicating if the response has no data
 */
export const hasNoData = (data: any[]) => !data || data.length === 0; 