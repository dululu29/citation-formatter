// offscreen.js - Runs in the offscreen document

console.log("Offscreen document loaded.");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Offscreen document received message:", message);

    if (message.target !== 'offscreen') {
        // console.log("Message not targeted for offscreen, ignoring.");
        return false; // Indicate message not handled synchronously or async
    }

    // Handle IEEE metadata request
    if (message.action === 'getIeeeMetadata' && message.url) {
        console.log("Offscreen: Fetching IEEE metadata for", message.url);
        fetchIeeeAndExtractMetadata(message.url)
            .then(metadata => {
                console.log("Offscreen: Sending IEEE metadata back:", metadata ? 'Found' : 'Not Found');
                sendResponse({ success: true, metadata: metadata });
            })
            .catch(error => {
                console.error("Offscreen: Error fetching/parsing IEEE:", error);
                sendResponse({ success: false, error: `Offscreen: ${error.message}` });
            });
        return true; // Indicate async response
    }
    // Handle MDPI metadata request (NEW)
    else if (message.action === 'getMdpiMetadata' && message.url) {
        console.log("Offscreen: Fetching MDPI metadata for", message.url);
        fetchMdpiAndExtractMetadata(message.url)
            .then(metadata => {
                console.log("Offscreen: Sending MDPI metadata back:", metadata ? 'Found' : 'Not Found');
                sendResponse({ success: true, metadata: metadata });
            })
            .catch(error => {
                console.error("Offscreen: Error fetching/parsing MDPI:", error);
                sendResponse({ success: false, error: `Offscreen: ${error.message}` });
            });
        return true; // Indicate async response
    }
    // Handle unknown actions
    else {
        console.warn("Offscreen: Received unknown message action or missing URL", message);
        sendResponse({ success: false, error: "Unknown action or missing URL received by offscreen document." });
        return false; // Indicate message not handled
    }
});

/**
 * Fetches the IEEE page content and extracts the metadata JSON.
 * (Unchanged from previous version)
 * @param {string} url - The IEEE Xplore document URL.
 * @returns {Promise<object>} - The parsed metadata object.
 */
async function fetchIeeeAndExtractMetadata(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch IEEE page (${response.status}): ${response.statusText}`);
        const htmlContent = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const scripts = doc.querySelectorAll('script');
        let metadataJson = null;
        const metadataRegex = /xplGlobal\.document\.metadata\s*=\s*({.*});/;
        for (const script of scripts) {
            if (script.textContent) {
                const match = script.textContent.match(metadataRegex);
                if (match && match[1]) {
                    try {
                        metadataJson = JSON.parse(match[1]);
                        console.log("Offscreen: Found and parsed IEEE metadata JSON.");
                        break;
                    } catch (jsonError) { console.error("Offscreen: Failed to parse IEEE metadata JSON:", jsonError); }
                }
            }
        }
        if (!metadataJson) {
             console.error("Offscreen: IEEE Metadata script tag or JSON object not found.");
             // Add basic check for abstract/title as fallback indicator
             const abstract = doc.querySelector('.abstract-text .u-mb-1')?.textContent.trim();
             const title = doc.querySelector('title')?.textContent.trim();
             console.log("Offscreen: IEEE Abstract:", abstract ? abstract.substring(0,100)+'...' : 'Not Found');
             console.log("Offscreen: IEEE Title:", title || 'Not Found');
             throw new Error("Could not find or parse metadata JSON in the IEEE page content.");
        }
        return metadataJson;
    } catch (error) {
        console.error("Offscreen: Error in fetchIeeeAndExtractMetadata:", error);
        throw error; // Re-throw
    }
}


/**
 * Fetches the MDPI page content and extracts metadata from meta tags.
 * (NEW function, contains the logic previously in background.js)
 * @param {string} url - The MDPI article URL.
 * @returns {Promise<object>} - The parsed metadata object.
 */
async function fetchMdpiAndExtractMetadata(url) {
    console.log("Offscreen: Starting MDPI fetch for:", url);
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch MDPI page (${response.status}): ${response.statusText}`);
        }

        const htmlContent = await response.text();
        console.log("Offscreen: MDPI HTML content fetched (length:", htmlContent.length, ")");

        // Use DOMParser available in the offscreen document context
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        console.log("Offscreen: MDPI HTML parsed.");

        // Extract metadata from <meta> tags
        const metadata = {};
        const metaSelectors = {
            title: 'meta[name="citation_title"]',
            authors: 'meta[name="citation_author"]', // Can have multiple
            journalTitle: 'meta[name="citation_journal_title"]',
            journalAbbrev: 'meta[name="citation_journal_abbrev"]',
            volume: 'meta[name="citation_volume"]',
            issue: 'meta[name="citation_issue"]',
            firstpage: 'meta[name="citation_firstpage"]', // Often the article number
            doi: 'meta[name="citation_doi"]',
            publicationDate: 'meta[name="citation_publication_date"]', // Format YYYY/MM/DD
            pdfUrl: 'meta[name="citation_pdf_url"]',
        };

        for (const key in metaSelectors) {
            const elements = doc.querySelectorAll(metaSelectors[key]);
            if (elements.length === 1) {
                metadata[key] = elements[0].getAttribute('content')?.trim() || '';
            } else if (elements.length > 1) {
                metadata[key] = Array.from(elements).map(el => el.getAttribute('content')?.trim() || '').filter(Boolean);
            } else {
                metadata[key] = ''; // Ensure key exists
            }
        }

         // Basic validation
        if (!metadata.title || !metadata.authors || !metadata.journalTitle) {
             console.warn("Offscreen: Could not extract essential metadata (title, authors, journal) from MDPI page:", url);
             if (!metadata.title) {
                 metadata.title = doc.querySelector('title')?.textContent.split('|')[0].trim() || 'N/A';
                 console.log("Offscreen: Using title tag as fallback:", metadata.title);
             }
             if (!metadata.authors || !metadata.journalTitle) {
                throw new Error("Failed to extract essential metadata (authors or journal title) from MDPI page via meta tags.");
             }
        }

        console.log("Offscreen: Extracted MDPI Metadata:", metadata);
        return metadata; // Return the extracted data

    } catch (error) {
        if (error.name === 'AbortError') {
             console.error("Offscreen: Fetching MDPI metadata timed out for", url);
             throw new Error("Fetching MDPI metadata timed out.");
        }
        console.error("Offscreen: Error in fetchMdpiAndExtractMetadata:", error);
        // Re-throw the error so the background script's catch block receives it
        throw error;
    }
}


console.log("Offscreen document script finished loading and listener is active.");
