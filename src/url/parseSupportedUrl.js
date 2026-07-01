(() => {
    function hostEndsWith(hostname, suffix) {
        return hostname === suffix || hostname.endsWith(`.${suffix}`);
    }

    function buildResult(base) {
        const result = {
            site: base.site,
            originalUrl: base.originalUrl,
            canonicalUrl: base.canonicalUrl
        };

        if (base.documentId) {
            result.documentId = base.documentId;
        }

        if (base.arxivId) {
            result.arxivId = base.arxivId;
        }

        return result;
    }

    function parseIeeeUrl(parsedUrl, originalUrl) {
        if (!hostEndsWith(parsedUrl.hostname.toLowerCase(), 'ieeexplore.ieee.org')) {
            return null;
        }

        const documentPathMatch = parsedUrl.pathname.match(/^\/document\/(\d+)\/?$/);
        const abstractPathMatch = parsedUrl.pathname.match(/^\/abstract\/document\/(\d+)\/?$/);
        const queryDocumentId = parsedUrl.searchParams.get('arnumber');
        const documentId = documentPathMatch?.[1] || abstractPathMatch?.[1] || (/^\d+$/.test(queryDocumentId || '') ? queryDocumentId : '');

        if (!documentId) {
            return null;
        }

        return buildResult({
            site: 'ieee',
            originalUrl,
            canonicalUrl: `https://ieeexplore.ieee.org/document/${documentId}`,
            documentId
        });
    }

    function parseArxivUrl(parsedUrl, originalUrl) {
        if (!hostEndsWith(parsedUrl.hostname.toLowerCase(), 'arxiv.org')) {
            return null;
        }

        const arxivPathMatch = parsedUrl.pathname.match(/^\/(abs|pdf|html)\/([^/?#]+)\/?$/);
        if (!arxivPathMatch) {
            return null;
        }

        const [, routeType, rawId] = arxivPathMatch;
        const cleanId = routeType === 'pdf' ? rawId.replace(/\.pdf$/i, '') : rawId;
        if (!cleanId) {
            return null;
        }

        return buildResult({
            site: 'arxiv',
            originalUrl,
            canonicalUrl: `https://arxiv.org/abs/${cleanId}`,
            arxivId: cleanId
        });
    }

    function parseMdpiUrl(parsedUrl, originalUrl) {
        if (!hostEndsWith(parsedUrl.hostname.toLowerCase(), 'mdpi.com')) {
            return null;
        }

        parsedUrl.hash = '';
        return buildResult({
            site: 'mdpi',
            originalUrl,
            canonicalUrl: parsedUrl.toString()
        });
    }

    function parseSupportedUrl(url) {
        if (!url || typeof url !== 'string') {
            return null;
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch (error) {
            return null;
        }

        return (
            parseIeeeUrl(parsedUrl, url) ||
            parseArxivUrl(parsedUrl, url) ||
            parseMdpiUrl(parsedUrl, url) ||
            null
        );
    }

    const api = { parseSupportedUrl };

    globalThis.CitationFormatterUrl = globalThis.CitationFormatterUrl || {};
    globalThis.CitationFormatterUrl.parseSupportedUrl = parseSupportedUrl;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})();
