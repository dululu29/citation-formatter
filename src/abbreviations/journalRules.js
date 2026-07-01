(() => {
const abbreviationNamespace = globalThis.CitationFormatterAbbreviations || (globalThis.CitationFormatterAbbreviations = {});

const normalizeTitleApi = typeof module !== 'undefined' && module.exports
    ? require('./normalizeTitle')
    : abbreviationNamespace.normalizeTitle;

const { normalizeForLookup, normalizeWhitespace, stripLeadingOrganizations } = normalizeTitleApi;

const EXACT_JOURNAL_ABBREVIATIONS = {
    'Journal on Selected Areas in Communications': 'IEEE J. Sel. Areas Commun.',
    'Transactions on Communications': 'IEEE Trans. Commun.',
    'Transactions on Mobile Computing': 'IEEE Trans. Mobile Comput.',
    'Transactions on Vehicular Technology': 'IEEE Trans. Veh. Technol.',
    'Communications Letters': 'IEEE Commun. Lett.',
    'Wireless Communications Letters': 'IEEE Wireless Commun. Lett.',
    'Communications Magazine': 'IEEE Commun. Mag.',
    'Wireless Communications': 'IEEE Wireless Commun.',
    'Communications Surveys & Tutorials': 'IEEE Commun. Surv. Tutor.',
    'Transactions on Wireless Communications': 'IEEE Trans. Wirel. Commun.',
    'Network': 'IEEE Netw.',
    'Transactions on Networking': 'IEEE/ACM Trans. Netw.',
    'Internet of Things Journal': 'IEEE Internet Things J.',
    'Transactions on Signal Processing': 'IEEE Trans. Signal Process.',
    'Signal Processing Letters': 'IEEE Signal Process. Lett.',
    'Journal of Selected Topics in Signal Processing': 'IEEE J. Sel. Topics Signal Process.',
    'Transactions on Image Processing': 'IEEE Trans. Image Process.',
    'Transactions on Audio, Speech, and Language Processing': 'IEEE/ACM Trans. Audio, Speech, Lang. Process.',
    'Transactions on Computers': 'IEEE Trans. Comput.',
    'Transactions on Parallel and Distributed Systems': 'IEEE Trans. Parallel Distrib. Syst.',
    'Transactions on Software Engineering': 'IEEE Trans. Softw. Eng.',
    'Transactions on Knowledge and Data Engineering': 'IEEE Trans. Knowl. Data Eng.',
    'Transactions on Dependable and Secure Computing': 'IEEE Trans. Dependable Secure Comput.',
    'Computer': 'IEEE Comput.',
    'Transactions on Circuits and Systems I: Regular Papers': 'IEEE Trans. Circuits Syst. I, Reg. Papers',
    'Transactions on Circuits and Systems II: Express Briefs': 'IEEE Trans. Circuits Syst. II, Exp. Briefs',
    'Transactions on Very Large Scale Integration (VLSI) Systems': 'IEEE Trans. Very Large Scale Integr. (VLSI) Syst.',
    'Journal on Emerging and Selected Topics in Circuits and Systems': 'IEEE J. Emerg. Sel. Topics Circuits Syst.',
    'Transactions on Pattern Analysis and Machine Intelligence': 'IEEE Trans. Pattern Anal. Mach. Intell.',
    'Transactions on Neural Networks and Learning Systems': 'IEEE Trans. Neural Netw. Learn. Syst.',
    'Transactions on Fuzzy Systems': 'IEEE Trans. Fuzzy Syst.',
    'Transactions on Evolutionary Computation': 'IEEE Trans. Evol. Comput.',
    'Transactions on Artificial Intelligence': 'IEEE Trans. Artif. Intell.',
    'Transactions on Automatic Control': 'IEEE Trans. Autom. Control',
    'Transactions on Robotics': 'IEEE Trans. Robot.',
    'Transactions on Power Systems': 'IEEE Trans. Power Syst.',
    'Transactions on Power Electronics': 'IEEE Trans. Power Electron.',
    'Transactions on Industrial Electronics': 'IEEE Trans. Ind. Electron.',
    'Proceedings of the IEEE': 'Proc. IEEE',
    'Sensors': 'Sensors',
    'Remote Sensing': 'Remote Sens.',
    'Energies': 'Energies',
    'Materials': 'Materials',
    'International Journal of Molecular Sciences': 'Int. J. Mol. Sci.',
    'Molecules': 'Molecules',
    'Applied Sciences': 'Appl. Sci.',
    'Sustainability': 'Sustainability',
    'Electronics': 'Electronics',
    'Viruses': 'Viruses',
    'Water': 'Water',
    'Nutrients': 'Nutrients',
    'Cancers': 'Cancers',
    'Polymers': 'Polymers',
    'Journal of Clinical Medicine': 'J. Clin. Med.'
};

const TOKEN_RULES = {
    transactions: 'Trans.',
    journal: 'J.',
    communications: 'Commun.',
    wireless: 'Wirel.',
    vehicular: 'Veh.',
    technology: 'Technol.',
    selected: 'Sel.',
    areas: 'Areas',
    computing: 'Comput.',
    mobile: 'Mobile',
    signal: 'Signal',
    processing: 'Process.',
    letters: 'Lett.',
    network: 'Netw.',
    networking: 'Netw.',
    tutorials: 'Tutor.',
    surveys: 'Surv.',
    image: 'Image',
    analysis: 'Anal.',
    machine: 'Mach.',
    intelligence: 'Intell.',
    software: 'Softw.',
    engineering: 'Eng.',
    computer: 'Comput.',
    computers: 'Comput.',
    parallel: 'Parallel',
    distributed: 'Distrib.',
    systems: 'Syst.',
    knowledge: 'Knowl.',
    data: 'Data',
    communications: 'Commun.',
    automatic: 'Autom.',
    control: 'Control',
    robotics: 'Robot.',
    robotics: 'Robot.',
    power: 'Power',
    electronics: 'Electron.',
    industrial: 'Ind.',
    image: 'Image',
    molecular: 'Mol.',
    sciences: 'Sci.',
    applied: 'Appl.',
    sensing: 'Sens.',
    clinical: 'Clin.',
    medicine: 'Med.',
    internet: 'Internet',
    things: 'Things',
    dependence: 'Dependable',
    secure: 'Secure',
    pattern: 'Pattern'
};

const STOP_WORDS = new Set(['a', 'an', 'and', 'for', 'in', 'of', 'on', 'the', 'to', 'with']);

let cachedSpecialAcronyms = null;

async function getSpecialAcronyms() {
    if (cachedSpecialAcronyms) {
        return cachedSpecialAcronyms;
    }

    if (typeof module !== 'undefined' && module.exports) {
        cachedSpecialAcronyms = require('./data/special-acronyms.json');
        return cachedSpecialAcronyms;
    }

    const url = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
        ? chrome.runtime.getURL('src/abbreviations/data/special-acronyms.json')
        : 'src/abbreviations/data/special-acronyms.json';

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load special acronyms data: ${response.status}`);
    }

    cachedSpecialAcronyms = await response.json();
    return cachedSpecialAcronyms;
}

function buildExactLookup() {
    const lookup = new Map();

    Object.entries(EXACT_JOURNAL_ABBREVIATIONS).forEach(([title, abbreviation]) => {
        lookup.set(normalizeForLookup(title), abbreviation);
        lookup.set(normalizeForLookup(stripLeadingOrganizations(title)), abbreviation);
    });

    return lookup;
}

const exactLookup = buildExactLookup();

async function resolveJournalAbbreviation(fullTitle) {
    const normalizedTitle = normalizeForLookup(fullTitle);
    const strippedTitle = normalizeForLookup(stripLeadingOrganizations(fullTitle));

    if (exactLookup.has(normalizedTitle)) {
        return {
            abbreviation: exactLookup.get(normalizedTitle),
            confidence: 0.98,
            needsReview: false,
            source: 'journalRules'
        };
    }

    if (exactLookup.has(strippedTitle)) {
        return {
            abbreviation: exactLookup.get(strippedTitle),
            confidence: 0.98,
            needsReview: false,
            source: 'journalRules'
        };
    }

    const specialAcronyms = await getSpecialAcronyms();
    const preserveTokens = new Set([
        ...specialAcronyms.organizations,
        ...specialAcronyms.compoundOrganizations,
        ...specialAcronyms.preserveTokens
    ]);

    const tokens = normalizeWhitespace(fullTitle).split(/\s+/);
    const outputTokens = [];
    let replacements = 0;
    let preservedOrganization = false;

    tokens.forEach((token) => {
        const cleanedToken = token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9./]+$/g, '');
        if (!cleanedToken) {
            return;
        }

        const lowerToken = cleanedToken.toLowerCase();
        const upperToken = cleanedToken.toUpperCase();

        if (STOP_WORDS.has(lowerToken)) {
            return;
        }

        if (preserveTokens.has(cleanedToken) || preserveTokens.has(upperToken) || /^[A-Z]{2,}(?:\/[A-Z]{2,})?$/.test(cleanedToken)) {
            outputTokens.push(upperToken);
            preservedOrganization = true;
            return;
        }

        if (TOKEN_RULES[lowerToken]) {
            outputTokens.push(TOKEN_RULES[lowerToken]);
            replacements += 1;
            return;
        }

        outputTokens.push(cleanedToken);
    });

    if (replacements < 2 || outputTokens.length === 0) {
        return null;
    }

    const abbreviation = outputTokens.join(' ').replace(/\s+/g, ' ').trim();
    if (!abbreviation || normalizeWhitespace(abbreviation) === normalizeWhitespace(fullTitle)) {
        return null;
    }

    return {
        abbreviation,
        confidence: preservedOrganization ? 0.8 : 0.7,
        needsReview: false,
        source: 'journalRules'
    };
}

const api = {
    resolveJournalAbbreviation
};

abbreviationNamespace.journalRules = api;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}
})();
