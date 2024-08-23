interface Deal {
    steamAppID: string;
    salePrice: string;
    storeID?: string;
}

export async function fetchAllDeals(steamIds: string[]): Promise<Deal[]> {
    const ITEMS_PER_PAGE = 60; // CHEAPSHARK LIMIT
    let allDeals: Deal[] = [];
    let pageNumber = 0;
    let hasMorePages = true;

    while (hasMorePages) {
        const cheapSharkUrl = `https://www.cheapshark.com/api/1.0/deals?steamAppID=${steamIds.join(',')}&pageNumber=${pageNumber}&pageSize=${ITEMS_PER_PAGE}`;

        const priceResponse = await fetch(cheapSharkUrl);
        if (priceResponse.ok) {
            const priceData: Deal[] = await priceResponse.json();
            allDeals = allDeals.concat(priceData);

            // CHECK IF THERE IS MORE PAGES
            const totalPageCount = parseInt(priceResponse.headers.get('X-Total-Page-Count') || '0');

            hasMorePages = pageNumber < totalPageCount;
            pageNumber++;
        } else {
            console.error(`Failed to fetch prices from CheapShark for page ${pageNumber}`);
            hasMorePages = false;
        }
    }

    return allDeals;
}