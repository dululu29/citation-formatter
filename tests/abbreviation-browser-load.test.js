const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const browserLoadOrder = [
    'src/abbreviations/normalizeTitle.js',
    'src/abbreviations/sources/customSource.js',
    'src/abbreviations/sources/metadataSource.js',
    'src/abbreviations/sources/geminiSource.js',
    'src/abbreviations/journalRules.js',
    'src/abbreviations/conferenceResolver.js',
    'src/abbreviations/resolver.js'
];

test('browser abbreviation modules load in shared scope without redeclaration errors', () => {
    const context = vm.createContext({
        console,
        globalThis: null
    });
    context.globalThis = context;

    assert.doesNotThrow(() => {
        for (const relativePath of browserLoadOrder) {
            const absolutePath = path.join(__dirname, '..', relativePath);
            const source = fs.readFileSync(absolutePath, 'utf8');
            vm.runInContext(source, context, { filename: relativePath });
        }
    });

    assert.equal(typeof context.CitationFormatterAbbreviations, 'object');
    assert.equal(
        typeof context.CitationFormatterAbbreviations.resolver.resolvePublicationAbbreviation,
        'function'
    );
});
