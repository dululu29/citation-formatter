const test = require('node:test');
const assert = require('node:assert/strict');

const { parseSupportedUrl } = require('../src/url/parseSupportedUrl');

test('parses IEEE /document/<id> URL', () => {
    const url = 'https://ieeexplore.ieee.org/document/10487785';

    assert.deepEqual(parseSupportedUrl(url), {
        site: 'ieee',
        originalUrl: url,
        canonicalUrl: 'https://ieeexplore.ieee.org/document/10487785',
        documentId: '10487785'
    });
});

test('parses IEEE /abstract/document/<id> URL with query params', () => {
    const url = 'https://ieeexplore.ieee.org/abstract/document/10487785?casa_token=dummy';

    assert.deepEqual(parseSupportedUrl(url), {
        site: 'ieee',
        originalUrl: url,
        canonicalUrl: 'https://ieeexplore.ieee.org/document/10487785',
        documentId: '10487785'
    });
});

test('parses IEEE stamp URL with arnumber query param', () => {
    const url = 'https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10487785';

    assert.deepEqual(parseSupportedUrl(url), {
        site: 'ieee',
        originalUrl: url,
        canonicalUrl: 'https://ieeexplore.ieee.org/document/10487785',
        documentId: '10487785'
    });
});

test('parses arXiv abs URL', () => {
    const url = 'https://arxiv.org/abs/2405.12345';

    assert.deepEqual(parseSupportedUrl(url), {
        site: 'arxiv',
        originalUrl: url,
        canonicalUrl: 'https://arxiv.org/abs/2405.12345',
        arxivId: '2405.12345'
    });
});

test('parses arXiv abs URL with version suffix', () => {
    const url = 'https://arxiv.org/abs/2405.12345v2';

    assert.deepEqual(parseSupportedUrl(url), {
        site: 'arxiv',
        originalUrl: url,
        canonicalUrl: 'https://arxiv.org/abs/2405.12345v2',
        arxivId: '2405.12345v2'
    });
});

test('parses arXiv pdf URL and strips only the trailing .pdf extension', () => {
    const url = 'https://arxiv.org/pdf/2405.12345.pdf';

    assert.deepEqual(parseSupportedUrl(url), {
        site: 'arxiv',
        originalUrl: url,
        canonicalUrl: 'https://arxiv.org/abs/2405.12345',
        arxivId: '2405.12345'
    });
});

test('parses arXiv pdf URL with version suffix', () => {
    const url = 'https://arxiv.org/pdf/2405.12345v2.pdf';

    assert.deepEqual(parseSupportedUrl(url), {
        site: 'arxiv',
        originalUrl: url,
        canonicalUrl: 'https://arxiv.org/abs/2405.12345v2',
        arxivId: '2405.12345v2'
    });
});

test('parses arXiv html URL', () => {
    const url = 'https://arxiv.org/html/2405.12345';

    assert.deepEqual(parseSupportedUrl(url), {
        site: 'arxiv',
        originalUrl: url,
        canonicalUrl: 'https://arxiv.org/abs/2405.12345',
        arxivId: '2405.12345'
    });
});

test('parses MDPI article URL with query string', () => {
    const url = 'https://www.mdpi.com/2072-4292/16/1/12345?utm_source=dummy';

    assert.deepEqual(parseSupportedUrl(url), {
        site: 'mdpi',
        originalUrl: url,
        canonicalUrl: 'https://www.mdpi.com/2072-4292/16/1/12345?utm_source=dummy'
    });
});

test('returns null for unsupported URLs', () => {
    assert.equal(parseSupportedUrl('https://example.com/paper/123'), null);
});
