const test = require('node:test');
const assert = require('node:assert/strict');

const { resolvePublicationAbbreviation } = require('../src/abbreviations/resolver');

test('custom override wins', async () => {
    const result = await resolvePublicationAbbreviation({
        customAbbreviations: {
            'IEEE Transactions on Wireless Communications': 'Custom TWC'
        },
        fullTitle: 'IEEE Transactions on Wireless Communications',
        sourceType: 'journal',
        style: 'standard'
    });

    assert.equal(result.abbreviation, 'Custom TWC');
    assert.equal(result.source, 'custom');
});

test('plain-title custom override format still works', async () => {
    const result = await resolvePublicationAbbreviation({
        customAbbreviations: {
            'Transactions on Wireless Communications': 'MyTWC'
        },
        fullTitle: 'Transactions on Wireless Communications',
        sourceType: 'journal',
        style: 'custom'
    });

    assert.equal(result.abbreviation, 'MyTWC');
    assert.equal(result.source, 'custom');
});

test('publisher metadata abbreviation wins over fallback', async () => {
    const result = await resolvePublicationAbbreviation({
        fullTitle: 'Remote Sensing',
        metadataAbbrev: 'Remote Sens.',
        sourceType: 'journal',
        style: 'standard'
    });

    assert.equal(result.abbreviation, 'Remote Sens.');
    assert.equal(result.source, 'metadata');
});

test('IEEE Transactions on Wireless Communications resolves to IEEE Trans. Wirel. Commun.', async () => {
    const result = await resolvePublicationAbbreviation({
        fullTitle: 'IEEE Transactions on Wireless Communications',
        sourceType: 'journal',
        style: 'standard'
    });

    assert.equal(result.abbreviation, 'IEEE Trans. Wirel. Commun.');
    assert.equal(result.source, 'journalRules');
});

test('Transactions on Wireless Communications resolves to IEEE Trans. Wirel. Commun.', async () => {
    const result = await resolvePublicationAbbreviation({
        fullTitle: 'Transactions on Wireless Communications',
        sourceType: 'journal',
        style: 'standard'
    });

    assert.equal(result.abbreviation, 'IEEE Trans. Wirel. Commun.');
    assert.equal(result.source, 'journalRules');
});

test('IEEE Transactions on Vehicular Technology resolves to IEEE Trans. Veh. Technol.', async () => {
    const result = await resolvePublicationAbbreviation({
        fullTitle: 'IEEE Transactions on Vehicular Technology',
        sourceType: 'journal',
        style: 'standard'
    });

    assert.equal(result.abbreviation, 'IEEE Trans. Veh. Technol.');
    assert.equal(result.source, 'journalRules');
});

test('IEEE Global Communications Conference resolves to IEEE GLOBECOM', async () => {
    const result = await resolvePublicationAbbreviation({
        fullTitle: 'IEEE Global Communications Conference',
        sourceType: 'conference',
        style: 'standard'
    });

    assert.equal(result.abbreviation, 'IEEE GLOBECOM');
    assert.equal(result.source, 'conferenceSeries');
});

test('2020 IEEE Global Communications Conference resolves to IEEE GLOBECOM', async () => {
    const result = await resolvePublicationAbbreviation({
        fullTitle: '2020 IEEE Global Communications Conference',
        sourceType: 'conference',
        style: 'standard'
    });

    assert.equal(result.abbreviation, 'IEEE GLOBECOM');
    assert.equal(result.source, 'conferenceSeries');
});

test('IEEE International Conference on Communications resolves to IEEE ICC', async () => {
    const result = await resolvePublicationAbbreviation({
        fullTitle: 'IEEE International Conference on Communications',
        sourceType: 'conference',
        style: 'standard'
    });

    assert.equal(result.abbreviation, 'IEEE ICC');
    assert.equal(result.source, 'conferenceSeries');
});

test('unknown journal falls back safely', async () => {
    const result = await resolvePublicationAbbreviation({
        fullTitle: 'Journal of Imaginary Results',
        sourceType: 'journal',
        style: 'standard'
    });

    assert.equal(result.abbreviation, 'Journal of Imaginary Results');
    assert.equal(result.source, 'fallback');
});

test('Gemini disabled means the Gemini callback is not called', async () => {
    let callbackCalls = 0;

    const result = await resolvePublicationAbbreviation({
        fullTitle: 'Unknown Conference on Novel Radios',
        sourceType: 'conference',
        style: 'standard',
        suggestViaGemini: async () => {
            callbackCalls += 1;
            return 'Should Not Happen';
        },
        useGemini: false
    });

    assert.equal(callbackCalls, 0);
    assert.equal(result.source, 'fallback');
});

test('Gemini enabled uses injected callback and returns low-confidence result', async () => {
    let callbackCalls = 0;

    const result = await resolvePublicationAbbreviation({
        fullTitle: 'Unknown Conference on Novel Radios',
        geminiApiKey: 'fake-key',
        sourceType: 'conference',
        style: 'standard',
        suggestViaGemini: async () => {
            callbackCalls += 1;
            return 'Novel Radios Conf.';
        },
        useGemini: true
    });

    assert.equal(callbackCalls, 1);
    assert.equal(result.abbreviation, 'Novel Radios Conf.');
    assert.equal(result.source, 'gemini');
    assert.equal(result.needsReview, true);
    assert.equal(result.confidence, 0.35);
});
