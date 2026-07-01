const test = require('node:test');
const assert = require('node:assert/strict');

const {
    extractIeeeMetadataFromHtml,
    extractJsonObjectAfterAssignment,
    normalizeIeeeActiveTabMetadata,
    normalizeIeeeRestMetadata
} = require('../src/ieee/metadataParser');

test('extracts one-line xplGlobal.document.metadata assignment', () => {
    const html = '<script>xplGlobal.document.metadata = {"title":"Paper","publicationTitle":"Journal"};</script>';
    const metadata = extractIeeeMetadataFromHtml(html);

    assert.equal(metadata.title, 'Paper');
    assert.equal(metadata.publicationTitle, 'Journal');
});

test('extracts multiline window.xplGlobal.document.metadata assignment', () => {
    const html = `
        <script>
            window.xplGlobal.document.metadata = {
                "title": "Paper",
                "publicationTitle": "Journal",
                "authors": [{"name": "Alice Smith"}]
            };
        </script>
    `;

    const metadata = extractIeeeMetadataFromHtml(html);
    assert.equal(metadata.title, 'Paper');
    assert.equal(metadata.publicationTitle, 'Journal');
    assert.equal(metadata.authors[0].name, 'Alice Smith');
});

test('extractJsonObjectAfterAssignment handles nested braces and quoted strings', () => {
    const scriptText = `
        xplGlobal.document.metadata = {
            "title": "Paper with } brace",
            "nested": {"section": {"label": "{A}"}},
            "text": "quoted \\"value\\""
        };
    `;

    const objectText = extractJsonObjectAfterAssignment(
        scriptText,
        /(?:window\.)?xplGlobal\.document\.metadata\s*=\s*/
    );
    const parsed = JSON.parse(objectText);

    assert.equal(parsed.title, 'Paper with } brace');
    assert.equal(parsed.nested.section.label, '{A}');
    assert.equal(parsed.text, 'quoted "value"');
});

test('normalizes representative IEEE REST response into formatter metadata shape', () => {
    const raw = {
        articleTitle: 'REST Paper',
        publicationName: 'IEEE Transactions on Wireless Communications',
        publicationYear: 2026,
        volume: 25,
        issue: 7,
        pageStart: 101,
        pageEnd: 110,
        arnumber: 123456,
        docType: 'Journals',
        authors: {
            authors: [
                { preferredName: 'Alice Smith' },
                { name: 'Bob Jones' }
            ]
        }
    };

    const normalized = normalizeIeeeRestMetadata(raw);

    assert.deepEqual(normalized, {
        authors: [{ name: 'Alice Smith' }, { name: 'Bob Jones' }],
        title: 'REST Paper',
        publicationTitle: 'IEEE Transactions on Wireless Communications',
        publicationDate: '2026',
        volume: '25',
        issue: '7',
        startPage: '101',
        endPage: '110',
        articleNumber: '123456',
        contentType: 'Journals'
    });
});

test('normalizes live-page IEEE active-tab metadata into formatter metadata shape', () => {
    const raw = {
        articleNumber: '10972469',
        authors: [
            { preferredName: 'Alice Smith' },
            { displayName: 'Bob Jones' }
        ],
        displayPublicationDate: '2026',
        displayPublicationTitle: 'IEEE Transactions on Wireless Communications',
        endPage: '456',
        formulaStrippedArticleTitle: 'AoI-Aware Interference Mitigation for Task-Oriented Multicasting in Multi-Cell NOMA Networks',
        issue: '7',
        publicationYear: '2026',
        startPage: '445',
        volume: '25'
    };

    const normalized = normalizeIeeeActiveTabMetadata(raw);

    assert.deepEqual(normalized, {
        authors: [{ name: 'Alice Smith' }, { name: 'Bob Jones' }],
        title: 'AoI-Aware Interference Mitigation for Task-Oriented Multicasting in Multi-Cell NOMA Networks',
        publicationTitle: 'IEEE Transactions on Wireless Communications',
        publicationDate: '2026',
        volume: '25',
        issue: '7',
        startPage: '445',
        endPage: '456',
        articleNumber: '10972469',
        contentType: ''
    });
});

test('returns null for HTML without IEEE metadata assignment', () => {
    const html = '<html><head><title>No Metadata</title></head><body><p>Nothing here</p></body></html>';
    const metadata = extractIeeeMetadataFromHtml(html);

    assert.equal(metadata, null);
});
