const abbreviationNamespace = globalThis.CitationFormatterAbbreviations || (globalThis.CitationFormatterAbbreviations = {});

async function resolveGeminiAbbreviation({
    fullTitle,
    geminiApiKey,
    sourceType,
    suggestViaGemini,
    useGemini
}) {
    if (!useGemini || typeof suggestViaGemini !== 'function') {
        return null;
    }

    try {
        const suggestion = await suggestViaGemini(
            fullTitle,
            sourceType === 'conference',
            geminiApiKey,
            useGemini
        );

        if (!suggestion || suggestion === fullTitle) {
            return null;
        }

        return {
            abbreviation: suggestion,
            confidence: 0.35,
            needsReview: true,
            source: 'gemini'
        };
    } catch (error) {
        return null;
    }
}

const api = {
    resolveGeminiAbbreviation
};

abbreviationNamespace.geminiSource = api;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
