/**
 * Convert unix time stamp to date (which is more readable)
 * @param unixTimestamp Unix time stamp number
 * @returns {Date} Converted date
 */
export const convertUnixToDate = (unixTimestamp: number): string => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString('pt-BR');
};

/**
 * Change the image url to get an high resolution image
 * @param url The image url
 * @returns {string} Corrected image url
 */
export const getCoverBigUrl = (url: string): string => {
    return url.replace('thumb', 'cover_big');
};

export const getCoverImageUrl = (url: string) => {
    return url.replace('t_thumb', 't_720p');
};

export const getScreenShotImageUrl = (url: string) => {
    return url.replace('t_thumb', 't_1080p');
};