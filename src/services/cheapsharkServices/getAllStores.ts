interface Store {
    storeID: string;
    storeName: string;
    isActive: boolean;
    images: {
        logo: string;
        icon: string;
    };
}

export async function fetchAllStores(): Promise<Store[]> {

    const allStoresResponse = await fetch('https://www.cheapshark.com/api/1.0/stores');

    const allStores = await allStoresResponse.json();

    return allStores;
}