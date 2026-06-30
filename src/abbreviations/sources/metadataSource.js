const abbreviationNamespace = globalThis.CitationFormatterAbbreviations || (globalThis.CitationFormatterAbbreviations = {});

function resolveMetadataAbbreviation(metadataAbbrev) {
    if (!metadataAbbrev || typeof metadataAbbrev !== 'string') {
        return null;
    }

    return {
        abbreviation: metadataAbbrev.trim(),
        confidence: 0.99,
        needsReview: false,
        source: 'metadata'
    };
}

const api = {
    resolveMetadataAbbreviation
};

abbreviationNamespace.metadataSource = api;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
