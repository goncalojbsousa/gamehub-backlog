/**
 * Utility functions for handling image URLs and validation
 * Provides comprehensive image URL processing, validation, and fallback mechanisms
 * Handles Google profile images and other image sources with proper error handling
 */

/**
 * Validates if a URL is a valid image URL
 * Checks for proper URL format, protocol, and handles special cases like Google images
 * 
 * @param url - The URL string to validate
 * @returns boolean indicating if the URL is valid for image display
 */
export const isValidImageUrl = (url: string): boolean => {
    // Check for null, undefined, or non-string values
    if (!url || typeof url !== 'string') return false;
    
    // Trim whitespace and check for empty or invalid string values
    const trimmedUrl = url.trim();
    if (trimmedUrl === '' || trimmedUrl === 'undefined' || trimmedUrl === 'null') return false;
    
    // Special handling for Google user content URLs
    // Google images are always considered valid as they come from a trusted source
    if (trimmedUrl.includes('googleusercontent.com')) {
        return true;
    }
    
    // Check if it's a valid HTTP/HTTPS URL using URL constructor
    try {
        const urlObj = new URL(trimmedUrl);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        // URL constructor throws error for invalid URLs
        return false;
    }
};

// Note: We intentionally removed any Google image URL processing.
// We will use the image URL exactly as stored in the database.

/**
 * Gets a valid image URL with fallback to placeholder
 * Validates the provided image URL and returns a safe URL for display
 * Handles Google images, regular URLs, and provides fallback for invalid URLs
 * 
 * @param imageUrl - The image URL to validate and process
 * @param placeholder - Fallback image URL (defaults to user placeholder)
 * @returns Valid image URL or placeholder URL
 */
export const getValidImageUrl = (imageUrl: string | null | undefined, placeholder: string = '/placeholder-user.webp'): string => {
    // If no image URL provided, return placeholder
    if (!imageUrl) {
        return placeholder;
    }
    
    // Trim the URL and check if it's empty or contains invalid values
    const trimmedUrl = imageUrl.trim();
    if (trimmedUrl === '' || trimmedUrl === 'undefined' || trimmedUrl === 'null') {
        return placeholder;
    }
    
    // For Google images, always accept them as-is (no processing)
    if (trimmedUrl.includes('googleusercontent.com')) {
        return trimmedUrl;
    }
    
    // For other URLs, validate them using URL constructor
    try {
        const urlObj = new URL(trimmedUrl);
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
            return trimmedUrl;
        }
    } catch {
        // Invalid URL format - return placeholder
    }
    
    // Return placeholder for any unhandled cases
    return placeholder;
};

/**
 * Checks if an image URL is from Google
 * Simple utility function to identify Google profile images
 * 
 * @param url - The URL to check
 * @returns boolean indicating if the URL is a Google image
 */
export const isGoogleImage = (url: string): boolean => {
    return Boolean(url && url.includes('googleusercontent.com'));
}; 