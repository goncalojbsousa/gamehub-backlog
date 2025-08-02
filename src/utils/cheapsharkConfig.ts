// Configuration for CheapShark API
export const CHEAPSHARK_CONFIG = {
    // API Settings
    BASE_URL: 'https://www.cheapshark.com/api/1.0',
    ITEMS_PER_PAGE: 60, // Maximum allowed by CheapShark
    MAX_PAGES: 5, // Limit to prevent excessive requests
    
    // Rate Limiting
    DELAY_BETWEEN_REQUESTS: 500, // 500ms between requests
    RETRY_DELAY: 2000, // 2 seconds when rate limited
    MAX_RETRIES: 1, // Number of retries on rate limit
    
    // Timeouts
    REQUEST_TIMEOUT: 10000, // 10 seconds timeout
} as const;

// Helper function to add delay between requests
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check if response is rate limited
export const isRateLimited = (status: number) => status === 429;

// Helper function to check if response indicates no data
export const hasNoData = (data: any[]) => !data || data.length === 0; 