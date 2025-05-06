// offscreen.js - Runs in the offscreen document

console.log("Offscreen document loaded.");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Offscreen document received message:", message);

    if (message.target !== 'offscreen') {
        // console.log("Message not targeted for offscreen, ignoring.");
        return false; // Indicate message not handled synchronously or async
    }

    if (message.action === 'getIeeeMetadata' && message.url) {
        console.log("Offscreen: Fetching IEEE metadata for", message.url);
        fetchIeeeAndExtractMetadata(message.url)
            .then(metadata => {
                console.log("Offscreen: Sending metadata back:", metadata);
                sendResponse({ success: true, metadata: metadata });
            })
            .catch(error => {
                console.error("Offscreen: Error fetching/parsing IEEE:", error);
                sendResponse({ success: false, error: error.message });
            });
        return true; // Indicate async response
    } else {
        console.warn("Offscreen: Received unknown message action or missing URL", message);
        return false; // Indicate message not handled
    }
});

/**
 * Fetches the IEEE page content and extracts the metadata JSON.
 * @param {string} url - The IEEE Xplore document URL.
 * @returns {Promise<object>} - The parsed metadata object.
 */
async function fetchIeeeAndExtractMetadata(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Mimic a browser request - might help bypass simple blocks
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch IEEE page (${response.status}): ${response.statusText}`);
        }

        const htmlContent = await response.text();

        // Use DOMParser to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Find the script tag containing the metadata (same logic as Python)
        const scripts = doc.querySelectorAll('script');
        let metadataJson = null;
        const metadataRegex = /xplGlobal\.document\.metadata\s*=\s*({.*});/;

        for (const script of scripts) {
            if (script.textContent) {
                const match = script.textContent.match(metadataRegex);
                if (match && match[1]) {
                    try {
                        metadataJson = JSON.parse(match[1]);
                        console.log("Offscreen: Found and parsed metadata JSON.");
                        break; // Found it, stop searching
                    } catch (jsonError) {
                        console.error("Offscreen: Failed to parse metadata JSON:", jsonError);
                        // Continue searching in case there are multiple script tags
                    }
                }
            }
        }

        if (!metadataJson) {
            console.error("Offscreen: Metadata script tag or JSON object not found in IEEE HTML.");
            // Attempt to find abstract or title as a fallback indicator
            const abstract = doc.querySelector('.abstract-text .u-mb-1')?.textContent.trim();
            const title = doc.querySelector('title')?.textContent.trim();
            console.log("Offscreen: Found Abstract:", abstract ? abstract.substring(0,100)+'...' : 'Not Found');
            console.log("Offscreen: Found Title:", title || 'Not Found');

            throw new Error("Could not find or parse metadata JSON in the IEEE page content. The page structure might have changed.");
        }

        return metadataJson; // Return the parsed metadata object

    } catch (error) {
        console.error("Offscreen: Error in fetchIeeeAndExtractMetadata:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

console.log("Offscreen document script finished loading and listener is active.");
