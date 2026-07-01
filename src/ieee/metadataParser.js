(() => {
    function extractJsonObjectAfterAssignment(scriptText, assignmentPattern) {
        if (!scriptText || typeof scriptText !== 'string') {
            return null;
        }

        const match = assignmentPattern.exec(scriptText);
        if (!match) {
            return null;
        }

        let index = match.index + match[0].length;
        while (index < scriptText.length && /\s/.test(scriptText[index])) {
            index += 1;
        }

        if (scriptText[index] !== '{') {
            return null;
        }

        const startIndex = index;
        let depth = 0;
        let inString = false;
        let stringQuote = '';
        let isEscaped = false;

        for (; index < scriptText.length; index += 1) {
            const currentChar = scriptText[index];

            if (inString) {
                if (isEscaped) {
                    isEscaped = false;
                    continue;
                }

                if (currentChar === '\\') {
                    isEscaped = true;
                    continue;
                }

                if (currentChar === stringQuote) {
                    inString = false;
                    stringQuote = '';
                }
                continue;
            }

            if (currentChar === '"' || currentChar === '\'') {
                inString = true;
                stringQuote = currentChar;
                continue;
            }

            if (currentChar === '{') {
                depth += 1;
                continue;
            }

            if (currentChar === '}') {
                depth -= 1;
                if (depth === 0) {
                    return scriptText.slice(startIndex, index + 1);
                }
            }
        }

        throw new Error('Unterminated JSON object after IEEE metadata assignment.');
    }

    function extractIeeeMetadataFromHtml(html) {
        if (!html || typeof html !== 'string') {
            return null;
        }

        const assignmentPattern = /(?:window\.)?xplGlobal\.document\.metadata\s*=\s*/;
        const objectText = extractJsonObjectAfterAssignment(html, assignmentPattern);
        if (!objectText) {
            return null;
        }

        try {
            return JSON.parse(objectText);
        } catch (error) {
            throw new Error(`Failed to parse IEEE metadata JSON: ${error.message}`);
        }
    }

    function getPath(source, path) {
        if (!source || typeof source !== 'object') {
            return undefined;
        }

        return path.split('.').reduce((value, segment) => {
            if (value && typeof value === 'object' && segment in value) {
                return value[segment];
            }
            return undefined;
        }, source);
    }

    function pickFirst(source, paths) {
        for (const path of paths) {
            const value = getPath(source, path);
            if (value !== undefined && value !== null && value !== '') {
                return value;
            }
        }
        return '';
    }

    function toStringValue(value) {
        if (value === undefined || value === null) {
            return '';
        }

        if (typeof value === 'string') {
            return value.trim();
        }

        return String(value).trim();
    }

    function normalizeAuthors(raw) {
        const candidateAuthors =
            getPath(raw, 'authors.authors') ||
            getPath(raw, 'authors') ||
            getPath(raw, 'authorNames') ||
            [];

        if (Array.isArray(candidateAuthors)) {
            return candidateAuthors
                .map((author) => {
                    if (typeof author === 'string') {
                        return author.trim();
                    }

                    if (!author || typeof author !== 'object') {
                        return '';
                    }

                    return toStringValue(
                        author.name ||
                        author.fullName ||
                        author.preferredName ||
                        author.displayName ||
                        author.authorName
                    );
                })
                .filter(Boolean)
                .map((name) => ({ name }));
        }

        if (typeof candidateAuthors === 'string') {
            return candidateAuthors
                .split(/\s*;\s*|\s+and\s+/)
                .map((author) => author.trim())
                .filter(Boolean)
                .map((name) => ({ name }));
        }

        return [];
    }

    function normalizeIeeeRestMetadata(raw) {
        if (!raw || typeof raw !== 'object') {
            return null;
        }

        const source = raw.data && typeof raw.data === 'object' ? raw.data : raw;
        const normalized = {
            authors: normalizeAuthors(source),
            title: toStringValue(pickFirst(source, ['title', 'articleTitle', 'documentTitle', 'displayTitle', 'formulaStrippedArticleTitle', 'displayDocTitle'])),
            publicationTitle: toStringValue(pickFirst(source, ['publicationTitle', 'publicationName', 'displayPublicationTitle', 'journalTitle', 'conferenceTitle', 'publisher'])),
            publicationDate: toStringValue(pickFirst(source, ['publicationDate', 'publicationYear', 'date', 'publicationDateFormatted', 'displayPublicationDate', 'coverDate'])),
            volume: toStringValue(pickFirst(source, ['volume'])),
            issue: toStringValue(pickFirst(source, ['issue'])),
            startPage: toStringValue(pickFirst(source, ['startPage', 'pageStart'])),
            endPage: toStringValue(pickFirst(source, ['endPage', 'pageEnd'])),
            articleNumber: toStringValue(pickFirst(source, ['articleNumber', 'arnumber'])),
            contentType: toStringValue(pickFirst(source, ['contentType', 'docType']))
        };

        const hasUsefulData =
            normalized.title ||
            normalized.publicationTitle ||
            normalized.authors.length > 0 ||
            normalized.articleNumber;

        return hasUsefulData ? normalized : null;
    }

    function normalizeIeeeActiveTabMetadata(raw) {
        if (!raw || typeof raw !== 'object') {
            return null;
        }

        const normalized = {
            authors: normalizeAuthors(raw),
            title: toStringValue(pickFirst(raw, ['title', 'formulaStrippedArticleTitle', 'displayDocTitle', 'articleTitle'])),
            publicationTitle: toStringValue(pickFirst(raw, ['publicationTitle', 'displayPublicationTitle'])),
            publicationDate: toStringValue(pickFirst(raw, ['publicationDate', 'displayPublicationDate', 'publicationYear'])),
            volume: toStringValue(pickFirst(raw, ['volume'])),
            issue: toStringValue(pickFirst(raw, ['issue'])),
            startPage: toStringValue(pickFirst(raw, ['startPage', 'pageStart'])),
            endPage: toStringValue(pickFirst(raw, ['endPage', 'pageEnd'])),
            articleNumber: toStringValue(pickFirst(raw, ['articleNumber', 'arnumber'])),
            contentType: toStringValue(pickFirst(raw, ['contentType', 'docType']))
        };

        const hasUsefulData =
            normalized.title ||
            normalized.publicationTitle ||
            normalized.authors.length > 0 ||
            normalized.articleNumber;

        return hasUsefulData ? normalized : null;
    }

    const api = {
        extractIeeeMetadataFromHtml,
        extractJsonObjectAfterAssignment,
        normalizeIeeeActiveTabMetadata,
        normalizeIeeeRestMetadata
    };

    globalThis.CitationFormatterIeee = globalThis.CitationFormatterIeee || {};
    globalThis.CitationFormatterIeee.metadataParser = api;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
})();
