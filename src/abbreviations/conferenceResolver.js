(() => {
    const abbreviationNamespace = globalThis.CitationFormatterAbbreviations || (globalThis.CitationFormatterAbbreviations = {});

    const normalizeTitleApi = typeof module !== 'undefined' && module.exports
        ? require('./normalizeTitle')
        : abbreviationNamespace.normalizeTitle;

    const { normalizeConferenceForMatch } = normalizeTitleApi;

    let cachedConferenceSeries = null;

    async function getConferenceSeries() {
        if (cachedConferenceSeries) {
            return cachedConferenceSeries;
        }

        if (typeof module !== 'undefined' && module.exports) {
            cachedConferenceSeries = require('./data/conference-series.json');
            return cachedConferenceSeries;
        }

        const url = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
            ? chrome.runtime.getURL('src/abbreviations/data/conference-series.json')
            : 'src/abbreviations/data/conference-series.json';

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load conference series data: ${response.status}`);
        }

        cachedConferenceSeries = await response.json();
        return cachedConferenceSeries;
    }

    async function resolveConferenceAbbreviation(fullTitle) {
        const normalizedInput = normalizeConferenceForMatch(fullTitle);
        const conferenceSeries = await getConferenceSeries();

        for (const series of conferenceSeries) {
            for (const title of series.titles) {
                const normalizedSeriesTitle = normalizeConferenceForMatch(title);
                if (normalizedInput.includes(normalizedSeriesTitle)) {
                    return {
                        abbreviation: series.abbreviation,
                        confidence: 0.97,
                        needsReview: false,
                        source: 'conferenceSeries'
                    };
                }
            }
        }

        return null;
    }

    const api = {
        resolveConferenceAbbreviation
    };

    abbreviationNamespace.conferenceResolver = api;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})();
