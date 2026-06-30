const abbreviationNamespace = globalThis.CitationFormatterAbbreviations || (globalThis.CitationFormatterAbbreviations = {});

const customSourceApi = typeof module !== 'undefined' && module.exports
    ? require('./sources/customSource')
    : abbreviationNamespace.customSource;
const metadataSourceApi = typeof module !== 'undefined' && module.exports
    ? require('./sources/metadataSource')
    : abbreviationNamespace.metadataSource;
const geminiSourceApi = typeof module !== 'undefined' && module.exports
    ? require('./sources/geminiSource')
    : abbreviationNamespace.geminiSource;
const journalRulesApi = typeof module !== 'undefined' && module.exports
    ? require('./journalRules')
    : abbreviationNamespace.journalRules;
const conferenceResolverApi = typeof module !== 'undefined' && module.exports
    ? require('./conferenceResolver')
    : abbreviationNamespace.conferenceResolver;

const { resolveCustomAbbreviation } = customSourceApi;
const { resolveMetadataAbbreviation } = metadataSourceApi;
const { resolveGeminiAbbreviation } = geminiSourceApi;
const { resolveJournalAbbreviation } = journalRulesApi;
const { resolveConferenceAbbreviation } = conferenceResolverApi;

async function resolvePublicationAbbreviation({
    customAbbreviations = {},
    fullTitle,
    geminiApiKey = null,
    metadataAbbrev = '',
    sourceType = 'journal',
    style = 'standard',
    suggestViaGemini,
    useGemini = false
}) {
    if (!fullTitle || typeof fullTitle !== 'string') {
        return {
            abbreviation: 'N/A',
            confidence: 0,
            needsReview: true,
            source: 'fallback'
        };
    }

    if (style === 'none') {
        return {
            abbreviation: fullTitle,
            confidence: 1,
            needsReview: false,
            source: 'style:none'
        };
    }

    const customResult = resolveCustomAbbreviation(fullTitle, customAbbreviations);
    if (customResult) {
        return customResult;
    }

    const metadataResult = resolveMetadataAbbreviation(metadataAbbrev);
    if (metadataResult) {
        return metadataResult;
    }

    if (sourceType === 'journal') {
        const journalResult = await resolveJournalAbbreviation(fullTitle);
        if (journalResult) {
            return journalResult;
        }
    }

    if (sourceType === 'conference') {
        const conferenceResult = await resolveConferenceAbbreviation(fullTitle);
        if (conferenceResult) {
            return conferenceResult;
        }
    }

    const geminiResult = await resolveGeminiAbbreviation({
        fullTitle,
        geminiApiKey,
        sourceType,
        suggestViaGemini,
        useGemini
    });
    if (geminiResult) {
        return geminiResult;
    }

    return {
        abbreviation: fullTitle,
        confidence: 0.1,
        needsReview: false,
        source: 'fallback'
    };
}

const api = {
    resolvePublicationAbbreviation
};

abbreviationNamespace.resolver = api;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
