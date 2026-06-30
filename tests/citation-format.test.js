const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
    formatArxivCitation,
    formatIeeeCitation,
    formatMdpiCitation,
    parseBibtex
} = require('../background.js');

const fixturesDir = path.join(__dirname, 'fixtures');

function readJsonFixture(name) {
    return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), 'utf8'));
}

function readArxivFixture() {
    const citationInfo = parseBibtex(fs.readFileSync(path.join(fixturesDir, 'arxiv.bib'), 'utf8'));
    citationInfo.url = 'https://arxiv.org/abs/2405.12345';
    return citationInfo;
}

function baseSettings(overrides = {}) {
    return {
        geminiApiKey: null,
        useGemini: false,
        autoCopy: false,
        customAbbreviations: {},
        ...overrides
    };
}

test('IEEE journal standard_abbr matches current output', async () => {
    const result = await formatIeeeCitation(
        readJsonFixture('ieee-journal.json'),
        baseSettings(),
        'standard_abbr'
    );

    assert.equal(
        result.citationText,
        'A.B. Smith and C.D. Ng, "Massive MIMO for 6G," IEEE Trans. Wirel. Commun., vol. 23, no. 3, pp. 100-110, 2024.'
    );
    assert.equal(result.suggestionError, '');
});

test('IEEE conference standard_abbr matches current output', async () => {
    const result = await formatIeeeCitation(
        readJsonFixture('ieee-conference.json'),
        baseSettings(),
        'standard_abbr'
    );

    assert.equal(
        result.citationText,
        'A.B. Smith and C.D. Ng, "Low-Latency Network Slicing," in Proceedings of IEEE GLOBECOM, pp. 220-225, 2020.'
    );
    assert.equal(result.suggestionError, '');
});

test('IEEE journal simplest_abbr matches current output', async () => {
    const result = await formatIeeeCitation(
        readJsonFixture('ieee-journal.json'),
        baseSettings(),
        'simplest_abbr'
    );

    assert.equal(
        result.citationText,
        "Massive MIMO for 6G (24'IEEE Trans. Wirel. Commun.)"
    );
    assert.equal(result.suggestionError, '');
});

test('IEEE conference simplest_abbr matches current output', async () => {
    const result = await formatIeeeCitation(
        readJsonFixture('ieee-conference.json'),
        baseSettings(),
        'simplest_abbr'
    );

    assert.equal(
        result.citationText,
        "Low-Latency Network Slicing (20'IEEE GLOBECOM)"
    );
    assert.equal(result.suggestionError, '');
});

test('MDPI standard_abbr matches current output', async () => {
    const result = await formatMdpiCitation(
        readJsonFixture('mdpi-article.json'),
        baseSettings(),
        'standard_abbr'
    );

    assert.equal(
        result.citationText,
        'A. B. Smith and C. D. Ng, "Satellite Sensing for Smart Agriculture," Remote Sens., vol. 16, Art. no. 12345, May. 2024.'
    );
    assert.equal(result.suggestionError, '');
});

test('MDPI simplest_abbr matches current output', async () => {
    const result = await formatMdpiCitation(
        readJsonFixture('mdpi-article.json'),
        baseSettings(),
        'simplest_abbr'
    );

    assert.equal(
        result.citationText,
        "Satellite Sensing for Smart Agriculture (24'Remote Sens.)"
    );
    assert.equal(result.suggestionError, '');
});

test('arXiv full citation matches current output', async () => {
    const result = await formatArxivCitation(
        readArxivFixture(),
        baseSettings(),
        'standard_abbr'
    );

    assert.equal(
        result.citationText,
        'A.B. Smith and C.D. Ng, "Scaling Multimodal Agents," arXiv:2405.12345. [Online]. Available: https://arxiv.org/abs/2405.12345'
    );
    assert.equal(result.suggestionError, '');
});

test('arXiv simplest citation matches current output', async () => {
    const result = await formatArxivCitation(
        readArxivFixture(),
        baseSettings(),
        'simplest_abbr'
    );

    assert.equal(
        result.citationText,
        "Scaling Multimodal Agents (24'arXiv)"
    );
    assert.equal(result.suggestionError, '');
});

test('custom abbreviation override is applied for IEEE journal citations', async () => {
    const result = await formatIeeeCitation(
        readJsonFixture('ieee-journal.json'),
        baseSettings({
            customAbbreviations: {
                'Transactions on Wireless Communications': 'MyTWC'
            }
        }),
        'custom_list_abbr'
    );

    assert.equal(
        result.citationText,
        'A.B. Smith and C.D. Ng, "Massive MIMO for 6G," MyTWC, vol. 23, no. 3, pp. 100-110, 2024.'
    );
    assert.equal(result.suggestionError, '');
});
