// offscreen.js - Runs in the offscreen document

console.log("Offscreen document loaded.");

const ieeeMetadataParserApi = globalThis.CitationFormatterIeee?.metadataParser;
if (!ieeeMetadataParserApi) {
    throw new Error("IEEE metadata parser helper failed to load in offscreen document.");
}

const {
    extractIeeeMetadataFromHtml,
    normalizeIeeeRestMetadata
} = ieeeMetadataParserApi;

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
 * Fetches the IEEE page content and extracts metadata from either the
 * page assignment script or the IEEE REST document endpoint.
 * @param {string} url - The IEEE Xplore document URL.
 * @returns {Promise<object>} - The parsed metadata object.
 */
async function fetchIeeeAndExtractMetadata(url) {
    let htmlFailureMessage = 'HTML metadata not attempted.';
    let restFailureMessage = 'REST fallback unavailable.';
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
        const documentTitle = doc.querySelector('title')?.textContent.trim() || '';

        try {
            const metadataJson = extractIeeeMetadataFromHtml(htmlContent);
            if (metadataJson) {
                console.log("Offscreen: Found and parsed IEEE metadata from HTML assignment.");
                return metadataJson;
            }

            htmlFailureMessage = 'HTML metadata not found.';
        } catch (htmlError) {
            htmlFailureMessage = htmlError.message || 'HTML metadata parse failed.';
        }

        console.warn("Offscreen: IEEE HTML metadata extraction failed.", {
            contentLength: htmlContent.length,
            containsDocumentMetadata: htmlContent.includes('document.metadata'),
            containsXplGlobal: htmlContent.includes('xplGlobal'),
            responseUrl: response.url || url,
            status: response.status,
            title: documentTitle || 'Not Found'
        });

        const documentIdMatch = url.match(/\/document\/(\d+)/);
        if (!documentIdMatch) {
            restFailureMessage = 'REST fallback unavailable (no IEEE document ID in URL).';
            throw new Error(`${htmlFailureMessage} ${restFailureMessage}`);
        }

        const documentId = documentIdMatch[1];
        const restUrl = `https://ieeexplore.ieee.org/rest/document/${documentId}`;

        try {
            const restResponse = await fetch(restUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Referer': url,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!restResponse.ok) {
                restFailureMessage = `REST fallback failed (${restResponse.status}): ${restResponse.statusText}`;
                throw new Error(restFailureMessage);
            }

            const restText = await restResponse.text();
            const looksLikeJson = !!restText && /^[\s\n\r\t]*[{[]/.test(restText);
            if (!looksLikeJson) {
                const contentType = restResponse.headers.get('content-type') || 'unknown';
                const preview = restText.replace(/\s+/g, ' ').slice(0, 200);
                restFailureMessage = `REST fallback returned non-JSON (status ${restResponse.status}, content-type ${contentType}, text length ${restText.length}, preview "${preview}")`;
                throw new Error(restFailureMessage);
            }

            let restJson;
            try {
                restJson = JSON.parse(restText);
            } catch (jsonError) {
                const contentType = restResponse.headers.get('content-type') || 'unknown';
                const preview = restText.replace(/\s+/g, ' ').slice(0, 200);
                restFailureMessage = `REST fallback JSON parse failed (status ${restResponse.status}, content-type ${contentType}, text length ${restText.length}, preview "${preview}")`;
                throw new Error(restFailureMessage);
            }
            const normalizedRestMetadata = normalizeIeeeRestMetadata(restJson);
            if (!normalizedRestMetadata) {
                restFailureMessage = 'REST fallback returned JSON but could not be normalized.';
                throw new Error(restFailureMessage);
            }

            console.log("Offscreen: Loaded IEEE metadata from REST fallback.");
            return normalizedRestMetadata;
        } catch (restError) {
            restFailureMessage = restError.message || 'REST fallback failed.';
            throw new Error(`${htmlFailureMessage} REST fallback failed or was unavailable: ${restFailureMessage}`);
        }
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
