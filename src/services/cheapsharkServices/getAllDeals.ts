import { CHEAPSHARK_CONFIG, delay, isRateLimited, hasNoData } from '@/src/utils/cheapsharkConfig';

interface Deal {
    steamAppID: string;
    salePrice: string;
    storeID?: string;
}

export async function fetchAllDeals(steamIds: string[]): Promise<Deal[]> {
    // If no steam IDs, return empty array
    if (!steamIds || steamIds.length === 0) {
        return [];
    }

    let allDeals: Deal[] = [];
    let pageNumber = 0;
    let hasMorePages = true;

    while (hasMorePages && pageNumber < CHEAPSHARK_CONFIG.MAX_PAGES) {
        const cheapSharkUrl = `${CHEAPSHARK_CONFIG.BASE_URL}/deals?steamAppID=${steamIds.join(',')}&pageNumber=${pageNumber}&pageSize=${CHEAPSHARK_CONFIG.ITEMS_PER_PAGE}`;

        try {
            const priceResponse = await fetch(cheapSharkUrl, {
                signal: AbortSignal.timeout(CHEAPSHARK_CONFIG.REQUEST_TIMEOUT)
            });
            
            if (priceResponse.ok) {
                const priceData: Deal[] = await priceResponse.json();
                
                // If no data returned, we've reached the end
                if (hasNoData(priceData)) {
                    hasMorePages = false;
                    break;
                }
                
                allDeals = allDeals.concat(priceData);

                // Check if there are more pages using the header
                const totalPageCount = parseInt(priceResponse.headers.get('X-Total-Page-Count') || '0');
                
                // If we have a valid total page count, use it
                if (totalPageCount > 0) {
                    hasMorePages = pageNumber < totalPageCount - 1; // -1 because pageNumber is 0-based
                } else {
                    // If no header info, assume no more pages if we got less than the page size
                    hasMorePages = priceData.length === CHEAPSHARK_CONFIG.ITEMS_PER_PAGE;
                }
                
                pageNumber++;
                
                // Add delay between requests to avoid rate limiting
                if (hasMorePages) {
                    await delay(CHEAPSHARK_CONFIG.DELAY_BETWEEN_REQUESTS);
                }
            } else if (isRateLimited(priceResponse.status)) {
                // Rate limited - wait longer and retry
                console.warn(`Rate limited by CheapShark, waiting ${CHEAPSHARK_CONFIG.RETRY_DELAY}ms before retry...`);
                await delay(CHEAPSHARK_CONFIG.RETRY_DELAY);
                
                // Try again up to MAX_RETRIES times
                for (let retry = 0; retry < CHEAPSHARK_CONFIG.MAX_RETRIES; retry++) {
                    try {
                        const retryResponse = await fetch(cheapSharkUrl, {
                            signal: AbortSignal.timeout(CHEAPSHARK_CONFIG.REQUEST_TIMEOUT)
                        });
                        if (retryResponse.ok) {
                            const retryData: Deal[] = await retryResponse.json();
                            if (!hasNoData(retryData)) {
                                allDeals = allDeals.concat(retryData);
                            }
                            break;
                        }
                    } catch (retryError) {
                        console.error(`Retry ${retry + 1} failed:`, retryError);
                    }
                }
                hasMorePages = false; // Stop after retry attempts
            } else if (priceResponse.status === 404) {
                // No deals found for this game - this is normal
                hasMorePages = false;
            } else {
                // Other error - log and stop
                console.error(`Failed to fetch prices from CheapShark for page ${pageNumber}: ${priceResponse.status}`);
                hasMorePages = false;
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'TimeoutError') {
                console.error(`Timeout fetching deals from CheapShark for page ${pageNumber}`);
            } else {
                console.error(`Error fetching deals from CheapShark for page ${pageNumber}:`, error);
            }
            hasMorePages = false;
        }
    }

    return allDeals;
}