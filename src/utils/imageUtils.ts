/**
 * Utility functions for handling image URLs and validation
 */

/**
 * Validates if a URL is a valid image URL
 */
export const isValidImageUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    
    const trimmedUrl = url.trim();
    if (trimmedUrl === '' || trimmedUrl === 'undefined' || trimmedUrl === 'null') return false;
    
    // Special handling for Google user content URLs
    if (trimmedUrl.includes('googleusercontent.com')) {
        return true;
    }
    
    // Check if it's a valid HTTP/HTTPS URL
    try {
        const urlObj = new URL(trimmedUrl);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

/**
 * Processes Google profile image URLs to ensure they have the correct format
 */
export const processGoogleImageUrl = (url: string): string => {
    if (!url || !url.includes('googleusercontent.com')) return url;
    
    // Remove existing size parameters and add a consistent size
    // Handle different Google image URL formats
    let processedUrl = url;
    
    // Remove existing size parameters
    processedUrl = processedUrl.replace(/=s\d+-c$/, '');
    processedUrl = processedUrl.replace(/=s\d+$/, '');
    
    // Add consistent size parameter
    if (!processedUrl.includes('=')) {
        processedUrl += '=s200-c';
    } else {
        processedUrl += '=s200-c';
    }
    
    return processedUrl;
};

/**
 * Gets a valid image URL with fallback to placeholder
 */
export const getValidImageUrl = (imageUrl: string | null | undefined, placeholder: string = '/placeholder-user.webp'): string => {
    // If no image URL provided, return placeholder
    if (!imageUrl) {
        return placeholder;
    }
    
    // Trim the URL and check if it's empty
    const trimmedUrl = imageUrl.trim();
    if (trimmedUrl === '' || trimmedUrl === 'undefined' || trimmedUrl === 'null') {
        return placeholder;
    }
    
    // For Google images, always accept them and process
    if (trimmedUrl.includes('googleusercontent.com')) {
        return processGoogleImageUrl(trimmedUrl);
    }
    
    // For other URLs, validate them
    try {
        const urlObj = new URL(trimmedUrl);
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
            return trimmedUrl;
        }
    } catch {
        // Invalid URL
    }
    
    return placeholder;
};

/**
 * Checks if an image URL is from Google
 */
export const isGoogleImage = (url: string): boolean => {
    return Boolean(url && url.includes('googleusercontent.com'));
}; 