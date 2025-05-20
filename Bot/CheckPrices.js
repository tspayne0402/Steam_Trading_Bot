async function getCsgoItemPrice(marketHashName, currencyCode = 1) {
    // CS:GO's App ID on Steam is 730
    const appId = 730;
    const encodedMarketHashName = encodeURIComponent(marketHashName);

    // This is a widely used public endpoint for getting item price overviews.
    // It does not require a Steam API key for this basic usage.
    const url = `https://steamcommunity.com/market/priceoverview/?appid=${appId}&currency=${currencyCode}&market_hash_name=${encodedMarketHashName}`;

    console.log(`Fetching price for: ${marketHashName}`);
    console.log(`Request URL: ${url}`);

    try {
        // We're using a proxy to bypass potential CORS issues when running this in a browser.
        // For a simple script or Node.js environment, you might fetch directly.
        // A common free CORS proxy is allorigins.win (use with caution for production).
        // For this example, let's assume direct access or a Node.js environment.
        // If running in a browser and facing CORS, you'd need a proxy:
        // const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        // const data = await response.json();
        // const marketData = JSON.parse(data.contents);

        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Error fetching price: ${response.status} ${response.statusText}`);
            // Log the response body if there's an error message from Steam
            const errorBody = await response.text();
            console.error("Response body:", errorBody);
            return null;
        }

        const marketData = await response.json();
        console.log(marketData)

        if (marketData && marketData.success) {
            console.log("Price data received:", marketData);
            return {
                lowestPrice: marketData.lowest_price,
                medianPrice: marketData.median_price,
                volume: marketData.volume,
                marketHashName: marketHashName
            };
        } else {
            console.error("Failed to get price data or item not found. Response:", marketData);
            return null;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

// --- Example Usage ---
async function main() {
    // Replace with the market_hash_name of the CS:GO item you want to check
    const itemName = "AK-47 | Redline (Field-Tested)";
    // const itemName = "Glove Case Key"; // Another example

    const priceInfo = await getCsgoItemPrice(itemName, 21); // 21 for AUD

    if (priceInfo) {
        console.log(`\n--- Price Information for ${priceInfo.marketHashName} ---`);
        console.log(`Lowest Price: ${priceInfo.lowestPrice}`);
        if (priceInfo.medianPrice) {
            console.log(`Median Price: ${priceInfo.medianPrice}`);
        }
        console.log(`Volume (24hr): ${priceInfo.volume}`);
    } else {
        console.log(`Could not retrieve price for ${itemName}. Check console for errors.`);
    }

    console.log("\n--- Another Example: Different Currency (EUR = 3) ---");
    const itemName2 = "AWP | Asiimov (Field-Tested)";
    const priceInfoEur = await getCsgoItemPrice(itemName2, 21);

    if (priceInfoEur) {
        console.log(`\n--- Price Information for ${priceInfoEur.marketHashName} ---`);
        console.log(`Lowest Price: ${priceInfoEur.lowestPrice}`);
        if (priceInfoEur.medianPrice) {
            console.log(`Median Price: ${priceInfoEur.medianPrice}`);
        }
        console.log(`Volume (24hr): ${priceInfoEur.volume}`);
    } else {
        console.log(`Could not retrieve price for ${itemName2}. Check console for errors.`);
    }
}

// Run the example
main();