(() => {
    const abbreviationNamespace = globalThis.CitationFormatterAbbreviations || (globalThis.CitationFormatterAbbreviations = {});

    function normalizeWhitespace(value = '') {
        return String(value).replace(/\s+/g, ' ').trim();
    }

    function normalizeForLookup(value = '') {
        return normalizeWhitespace(value)
            .replace(/&/g, ' and ')
            .replace(/[.,:;()[\]{}]/g, ' ')
            .replace(/[/-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    function stripLeadingOrganizations(value = '') {
        return normalizeWhitespace(
            String(value).replace(/^(IEEE|ACM|MDPI)(?:\/(IEEE|ACM|CVF|RSJ))?\s+/i, '')
        );
    }

    function normalizeConferenceForMatch(value = '') {
        return normalizeForLookup(value)
            .replace(/\b\d{1,3}(st|nd|rd|th)\b/g, ' ')
            .replace(/\b\d{4}\b/g, ' ')
            .replace(/\b(spring|summer|fall|winter)\b/g, ' ')
            .replace(/\b(proceedings|proc|record|workshop|workshops)\b/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    const api = {
        normalizeConferenceForMatch,
        normalizeForLookup,
        normalizeWhitespace,
        stripLeadingOrganizations
    };

    abbreviationNamespace.normalizeTitle = api;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})();
