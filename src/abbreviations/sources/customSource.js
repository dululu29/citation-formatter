(() => {
    const abbreviationNamespace = globalThis.CitationFormatterAbbreviations || (globalThis.CitationFormatterAbbreviations = {});

    function resolveCustomAbbreviation(fullTitle, customAbbreviations = {}) {
        if (!customAbbreviations || typeof customAbbreviations !== 'object') {
            return null;
        }

        const abbreviation = customAbbreviations[fullTitle];
        if (!abbreviation) {
            return null;
        }

        return {
            abbreviation,
            confidence: 1,
            needsReview: false,
            source: 'custom'
        };
    }

    const api = {
        resolveCustomAbbreviation
    };

    abbreviationNamespace.customSource = api;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})();
