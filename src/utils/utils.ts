/**
 * Converts Unix timestamp to a human-readable date string
 * Transforms Unix timestamp (seconds since epoch) to localized date format
 * @param unixTimestamp - Unix timestamp number (seconds since epoch)
 * @returns Localized date string in Brazilian Portuguese format
 */
export const convertUnixToDate = (unixTimestamp: number): string => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString('pt-BR');
};

/**
 * Transforms IGDB image URL to get high-resolution cover image
 * Replaces 'thumb' with 'cover_big' in the URL to get larger cover images
 * @param url - Original IGDB image URL
 * @returns Modified URL for high-resolution cover image
 */
export const getCoverBigUrl = (url: string): string => {
    return url.replace('thumb', 'cover_big');
};

/**
 * Transforms IGDB image URL to get 720p resolution image
 * Replaces 't_thumb' with 't_720p' in the URL for better quality images
 * @param url - Original IGDB image URL
 * @returns Modified URL for 720p resolution image
 */
export const getCoverImageUrl = (url: string) => {
    return url.replace('t_thumb', 't_720p');
};

/**
 * Transforms IGDB image URL to get 1080p resolution screenshot
 * Replaces 't_thumb' with 't_1080p' in the URL for high-quality screenshots
 * @param url - Original IGDB image URL
 * @returns Modified URL for 1080p resolution screenshot
 */
export const getScreenShotImageUrl = (url: string) => {
    return url.replace('t_thumb', 't_1080p');
};