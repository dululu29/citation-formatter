// --- Constants and Configuration ---
const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

// --- Abbreviation Dictionaries ---
// NOTE: These lists are expanded but not exhaustive. Users should leverage the
//       Custom Abbreviations feature for publications not listed here.

// Standard IEEE Style Abbreviations
const standardJournalAbbreviations = {
    // Communications & Networking
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
    'Transactions on Networking': 'IEEE/ACM Trans. Netw.', // Note: ACM co-sponsor
    'Internet of Things Journal': 'IEEE Internet Things J.',
    // Signal Processing
    'Transactions on Signal Processing': 'IEEE Trans. Signal Process.',
    'Signal Processing Letters': 'IEEE Signal Process. Lett.',
    'Journal of Selected Topics in Signal Processing': 'IEEE J. Sel. Topics Signal Process.',
    'Transactions on Image Processing': 'IEEE Trans. Image Process.',
    'Transactions on Audio, Speech, and Language Processing': 'IEEE/ACM Trans. Audio, Speech, Lang. Process.',
    // Computer Science & Engineering
    'Transactions on Computers': 'IEEE Trans. Comput.',
    'Transactions on Parallel and Distributed Systems': 'IEEE Trans. Parallel Distrib. Syst.',
    'Transactions on Software Engineering': 'IEEE Trans. Softw. Eng.',
    'Transactions on Knowledge and Data Engineering': 'IEEE Trans. Knowl. Data Eng.',
    'Transactions on Dependable and Secure Computing': 'IEEE Trans. Dependable Secure Comput.',
    'Computer': 'IEEE Comput.',
    // Circuits & Systems
    'Transactions on Circuits and Systems I: Regular Papers': 'IEEE Trans. Circuits Syst. I, Reg. Papers',
    'Transactions on Circuits and Systems II: Express Briefs': 'IEEE Trans. Circuits Syst. II, Exp. Briefs',
    'Transactions on Very Large Scale Integration (VLSI) Systems': 'IEEE Trans. Very Large Scale Integr. (VLSI) Syst.',
    'Journal on Emerging and Selected Topics in Circuits and Systems': 'IEEE J. Emerg. Sel. Topics Circuits Syst.',
    // Machine Learning / AI / Pattern Analysis
    'Transactions on Pattern Analysis and Machine Intelligence': 'IEEE Trans. Pattern Anal. Mach. Intell.',
    'Transactions on Neural Networks and Learning Systems': 'IEEE Trans. Neural Netw. Learn. Syst.',
    'Transactions on Fuzzy Systems': 'IEEE Trans. Fuzzy Syst.',
    'Transactions on Evolutionary Computation': 'IEEE Trans. Evol. Comput.',
    'Transactions on Artificial Intelligence': 'IEEE Trans. Artif. Intell.',
    // Other Engineering Areas
    'Transactions on Automatic Control': 'IEEE Trans. Autom. Control',
    'Transactions on Robotics': 'IEEE Trans. Robot.',
    'Transactions on Power Systems': 'IEEE Trans. Power Syst.',
    'Transactions on Power Electronics': 'IEEE Trans. Power Electron.',
    'Transactions on Industrial Electronics': 'IEEE Trans. Ind. Electron.',
    'Proceedings of the IEEE': 'Proc. IEEE',
    // Add more standard journal names and their IEEE abbreviations here
};
const standardConferenceAbbreviations = {
    // Communications & Networking
    'Global Communications Conference': 'IEEE GLOBECOM',
    'Globecom Workshops': 'IEEE GC Wkshps',
    'International Conference on Communications': 'IEEE ICC',
    'Conference on Computer Communications': 'IEEE INFOCOM',
    'Wireless Communications and Networking Conference': 'IEEE WCNC',
    'Vehicular Technology Conference': 'IEEE VTC',
    'International Symposium on Personal, Indoor and Mobile Radio Communications': 'IEEE PIMRC',
    'International Conference on Wireless and Mobile Computing, Networking and Communications': 'IEEE WiMob',
    'Consumer Communications and Networking Conference': 'IEEE CCNC',
    'Symposium on Computers and Communications': 'IEEE ISCC',
    'International Conference on Mobile Ad Hoc and Smart Systems': 'IEEE MASS',
    'International Symposium on a World of Wireless, Mobile and Multimedia Networks': 'IEEE WoWMoM',
    'International Conference on Communications in China (ICCC Workshops)': 'IEEE ICCC Wkshps',
    'Networking Conference': 'IEEE NetConf', // Example, check official name
    'Network Operations and Management Symposium': 'IEEE NOMS',
    // Signal Processing
    'International Conference on Acoustics, Speech and Signal Processing': 'IEEE ICASSP',
    'International Conference on Image Processing': 'IEEE ICIP',
    'Global Conference on Signal and Information Processing': 'IEEE GlobalSIP',
    'Workshop on Signal Processing Systems': 'IEEE SiPS',
    // Computer Science & Engineering
    'International Conference on Distributed Computing Systems': 'IEEE ICDCS',
    'Symposium on Security and Privacy': 'IEEE S&P',
    'Computer Vision and Pattern Recognition': 'IEEE/CVF CVPR', // CVF co-sponsor
    'International Conference on Computer Vision': 'IEEE/CVF ICCV', // CVF co-sponsor
    'International Conference on Data Engineering': 'IEEE ICDE',
    'Symposium on High-Performance Computer Architecture': 'IEEE HPCA',
    'Real-Time Systems Symposium': 'IEEE RTSS',
    // Circuits & Systems
    'International Solid - State Circuits Conference': 'IEEE ISSCC',
    'Custom Integrated Circuits Conference': 'IEEE CICC',
    'International Symposium on Circuits and Systems': 'IEEE ISCAS',
    'Design Automation Conference': 'ACM/IEEE DAC', // ACM co-sponsor
    // Machine Learning / AI
    'Conference on Neural Information Processing Systems': 'NeurIPS', // Not IEEE, but common
    'International Conference on Machine Learning': 'ICML', // Not IEEE, but common
    'AAAI Conference on Artificial Intelligence': 'AAAI', // Not IEEE, but common
    // Robotics & Control
    'International Conference on Robotics and Automation': 'IEEE ICRA',
    'International Conference on Intelligent Robots and Systems': 'IEEE/RSJ IROS', // RSJ co-sponsor
    'Conference on Decision and Control': 'IEEE CDC',
    // Add more standard conference names and their IEEE abbreviations here
};

// Short Style Abbreviations (used for 'short' style and PPT mode)
// Key: Standard IEEE Abbreviation (from above lists) or Full Name if no standard exists
const shortAbbreviations = {
    // Communications & Networking
    'IEEE J. Sel. Areas Commun.': 'JSAC',
    'IEEE Trans. Commun.': 'TCOM',
    'IEEE Trans. Mobile Comput.': 'TMC',
    'IEEE Trans. Veh. Technol.': 'TVT',
    'IEEE Commun. Lett.': 'CL',
    'IEEE Wireless Commun. Lett.': 'WCL',
    'IEEE Commun. Mag.': 'COMMAG',
    'IEEE Wireless Commun.': 'WCM',
    'IEEE Commun. Surv. Tutor.': 'COMST',
    'IEEE Trans. Wirel. Commun.': 'TWC',
    'IEEE Netw.': 'NETWORK',
    'IEEE/ACM Trans. Netw.': 'TON',
    'IEEE Internet Things J.': 'IOT-J',
    'IEEE GLOBECOM': 'GLOBECOM',
    'IEEE GC Wkshps': 'GC Wkshps',
    'IEEE ICC': 'ICC',
    'IEEE INFOCOM': 'INFOCOM',
    'IEEE WCNC': 'WCNC',
    'IEEE VTC': 'VTC',
    'IEEE PIMRC': 'PIMRC',
    'IEEE WiMob': 'WiMob',
    'IEEE CCNC': 'CCNC',
    'IEEE ISCC': 'ISCC',
    'IEEE MASS': 'MASS',
    'IEEE WoWMoM': 'WoWMoM',
    'IEEE ICCC Wkshps': 'ICCC Wkshps',
    'IEEE NetConf': 'NetConf',
    'IEEE NOMS': 'NOMS',
    // Signal Processing
    'IEEE Trans. Signal Process.': 'TSP',
    'IEEE Signal Process. Lett.': 'SPL',
    'IEEE J. Sel. Topics Signal Process.': 'JSTSP',
    'IEEE Trans. Image Process.': 'TIP',
    'IEEE/ACM Trans. Audio, Speech, Lang. Process.': 'TASLP',
    'IEEE ICASSP': 'ICASSP',
    'IEEE ICIP': 'ICIP',
    'IEEE GlobalSIP': 'GlobalSIP',
    'IEEE SiPS': 'SiPS',
    // Computer Science & Engineering
    'IEEE Trans. Comput.': 'TC',
    'IEEE Trans. Parallel Distrib. Syst.': 'TPDS',
    'IEEE Trans. Softw. Eng.': 'TSE',
    'IEEE Trans. Knowl. Data Eng.': 'TKDE',
    'IEEE Trans. Dependable Secure Comput.': 'TDSC',
    'IEEE Comput.': 'Computer',
    'IEEE ICDCS': 'ICDCS',
    'IEEE S&P': 'S&P', // Or 'Oakland'
    'IEEE/CVF CVPR': 'CVPR',
    'IEEE/CVF ICCV': 'ICCV',
    'IEEE ICDE': 'ICDE',
    'IEEE HPCA': 'HPCA',
    'IEEE RTSS': 'RTSS',
    // Circuits & Systems
    'IEEE Trans. Circuits Syst. I, Reg. Papers': 'TCAS-I',
    'IEEE Trans. Circuits Syst. II, Exp. Briefs': 'TCAS-II',
    'IEEE Trans. Very Large Scale Integr. (VLSI) Syst.': 'TVLSI',
    'IEEE J. Emerg. Sel. Topics Circuits Syst.': 'JETCAS',
    'IEEE ISSCC': 'ISSCC',
    'IEEE CICC': 'CICC',
    'IEEE ISCAS': 'ISCAS',
    'ACM/IEEE DAC': 'DAC',
    // Machine Learning / AI / Pattern Analysis
    'IEEE Trans. Pattern Anal. Mach. Intell.': 'TPAMI',
    'IEEE Trans. Neural Netw. Learn. Syst.': 'TNNLS',
    'IEEE Trans. Fuzzy Syst.': 'TFS',
    'IEEE Trans. Evol. Comput.': 'TEC',
    'IEEE Trans. Artif. Intell.': 'TAI',
    'NeurIPS': 'NeurIPS', // Keep common non-IEEE short names
    'ICML': 'ICML',
    'AAAI': 'AAAI',
    // Other Engineering Areas
    'IEEE Trans. Autom. Control': 'TAC',
    'IEEE Trans. Robot.': 'T-RO',
    'IEEE Trans. Power Syst.': 'TPWRS',
    'IEEE Trans. Power Electron.': 'TPEL',
    'IEEE Trans. Ind. Electron.': 'TIE',
    'Proc. IEEE': 'Proc. IEEE', // Often not abbreviated further
    'IEEE ICRA': 'ICRA',
    'IEEE/RSJ IROS': 'IROS',
    'IEEE CDC': 'CDC',
    // Add more mappings here
};


// --- Helper Functions ---
// getSettings, getTwoDigitYear, suggestAbbreviationViaGemini, fallbackAbbreviation
// getAbbreviationForStyle, getArxivCitation, parseBibtex, formatArxivCitation
// getIeeeCitation, formatIeeeCitation
// (These functions remain the same as in the previous complete version - background_js_v5)
// ... (Paste the full implementation of these functions here) ...
// --- Helper Functions (Implementations from background_js_v5) ---

/**
 * Retrieves specified settings from storage with default values.
 */
async function getSettings(defaults) {
    try {
        const defaultValues = {
            geminiApiKey: null, useGemini: false, autoCopy: true,
            citationMode: 'full',
            fullModeAbbrStyle: 'standard',
            pptModeAbbrStyle: 'short',
            customAbbreviations: {},
            ...defaults
        };
        const items = await chrome.storage.sync.get(defaultValues);
        if (chrome.runtime.lastError) {
            console.error("Error retrieving settings:", chrome.runtime.lastError);
            return defaultValues;
        }
        if (typeof items.customAbbreviations !== 'object' || items.customAbbreviations === null) {
            console.warn("Invalid customAbbreviations found in storage, resetting to empty object.");
            items.customAbbreviations = {};
        }
        return items;
    } catch (error) {
        console.error("Exception retrieving settings:", error);
        return {
            geminiApiKey: null, useGemini: false, autoCopy: true,
            citationMode: 'full', fullModeAbbrStyle: 'standard', pptModeAbbrStyle: 'short',
            customAbbreviations: {}, ...defaults
        };
    }
}

/**
 * Extracts the last two digits of the year.
 */
function getTwoDigitYear(dateStr) {
    if (!dateStr) return '';
    const yearMatch = dateStr.match(/\b(\d{4})\b/);
    if (yearMatch && yearMatch[1]) {
        return yearMatch[1].slice(-2);
    }
    try {
        const normalizedDateStr = dateStr.replace(/-\s*/g, ' ').replace(/\.\s*/g, ' ');
        const dateObj = new Date(normalizedDateStr);
        if (!isNaN(dateObj.getTime())) {
            const year = dateObj.getFullYear();
            return year.toString().slice(-2);
        }
    } catch (e) { /* Ignore */ }
    return '';
}

/**
 * Calls the Gemini API to suggest an abbreviation.
 */
async function suggestAbbreviationViaGemini(name, isConference, apiKey, useGemini) {
    if (!useGemini) {
        console.log("Gemini usage disabled by setting. Using fallback.");
        return fallbackAbbreviation(name, isConference);
    }
    if (!apiKey) {
        console.warn("Gemini enabled but API key is missing.");
        throw new Error("Gemini enabled, but API key is missing. Please set it in options.");
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Suggest a standard IEEE-style abbreviation for the following ${isConference ? 'conference' : 'journal'}: "${name}". Return only the abbreviation text itself, nothing else.`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(geminiApiUrl, {
            method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 80 } }),
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorData = {}; try { errorData = await response.json(); } catch (e) { /* Ignore */ }
            console.error('Gemini API Error:', response.status, response.statusText, errorData);
            if (response.status === 400 && errorData?.error?.message?.includes('API key not valid')) throw new Error(`Gemini API key is invalid. Please check it in options.`);
            if (response.status === 403) throw new Error(`Gemini API request forbidden (check key permissions/billing).`);
            throw new Error(`Gemini API request failed (${response.status}): ${errorData?.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (suggestion) {
            console.log(`Gemini Suggested Abbreviation for '${name}': ${suggestion}`);
            return suggestion;
        } else {
            console.warn("Gemini response format unexpected or empty. Using fallback.");
            console.log("Gemini Raw Response:", JSON.stringify(data));
            return fallbackAbbreviation(name, isConference);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Gemini API call timed out."); throw new Error("Gemini API call timed out.");
        }
        console.error(`Gemini API call failed: ${error.message}`);
        if (error.message.includes('Gemini API key') || error.message.includes('timed out') || error.message.includes('forbidden') || error.message.includes('Gemini API request failed')) throw error;
        console.warn("Returning fallback due to unhandled Gemini error.");
        return fallbackAbbreviation(name, isConference);
    }
}

/**
 * Generates a simple fallback abbreviation.
 */
function fallbackAbbreviation(name, isConference) {
    if (!name || typeof name !== 'string') return 'N/A';
    const words = name.split(/\s+/);
    const skipWords = new Set(["ieee", "on", "and", "in", "of", "the", "for", "&", "an", "a", "with", "using", "computers", "communications", "networking", "mobile", "computing", "systems", "technology", "wireless", "vehicular", "selected", "areas", "transactions", "journal", "letters", "magazine", "conference", "symposium", "workshops", "proceedings", "international", "global", "society", "technical", "annual", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"]);
    let abbr = "";
    let significantWords = words.filter(w => w && /^[A-Z]/.test(w) && !skipWords.has(w.toLowerCase()));
    if (significantWords.length < 2) {
        significantWords = words.filter(w => w && /^[A-Z]/.test(w) && !skipWords.has(w.toLowerCase()) || ["Communications", "Wireless", "Network", "Vehicular", "Technology", "Computing", "Mobile"].includes(w) );
        significantWords = [...new Set(significantWords)];
    }
    if (isConference) {
        abbr = significantWords.map(w => w[0].toUpperCase()).join('');
        if (/Conference/i.test(name)) abbr = `Proc. ${abbr} Conf.`;
        else if (/Symposium/i.test(name)) abbr = `Proc. ${abbr} Symp.`;
        else if (/Workshops/i.test(name)) abbr = `Proc. ${abbr} Wkshps.`;
        else if (/Proceedings/i.test(name)) abbr = `Proc. ${abbr}`;
        else abbr = `Proc. ${abbr}`;
    } else {
        let prefix = "IEEE"; let coreWords = significantWords;
        if (name.toLowerCase().startsWith("ieee")) coreWords = significantWords.filter(w => w.toLowerCase() !== 'ieee');
        else if (!/Trans|Journal|Lett|Mag|Network/i.test(name)) prefix = "";
        let coreAbbr = coreWords.map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
        if (/Transactions on/i.test(name)) abbr = `${prefix} Trans. ${coreAbbr.replace(/Transactions on/i, '').trim()}`;
        else if (/Journal on/i.test(name)) abbr = `${prefix} J. ${coreAbbr.replace(/Journal on/i, '').trim()}`;
        else if (/Letters/i.test(name)) abbr = `${prefix} ${coreAbbr.replace(/Letters/i, '').trim()} Lett.`;
        else if (/Magazine/i.test(name)) abbr = `${prefix} ${coreAbbr.replace(/Magazine/i, '').trim()} Mag.`;
        else if (/Network/i.test(name)) abbr = `${prefix} Netw.`;
        else abbr = `${prefix} ${coreAbbr}`;
    }
    abbr = abbr.replace(/\s+/g, ' ').replace(/Proc\. Proc\./i, 'Proc.').trim();
    if (!abbr || abbr === "IEEE" || abbr === "Proc.") abbr = name;
    console.log(`Fallback Abbreviation for '${name}': ${abbr}`);
    return abbr;
}

/**
 * Determines the final abbreviation based on a *specific* style preference.
 */
async function getAbbreviationForStyle(originalName, isConference, targetStyle, settings) {
    const customAbbrs = settings.customAbbreviations || {};
    const useGemini = settings.useGemini;
    const apiKey = settings.geminiApiKey;

    console.log(`Getting abbreviation for "${originalName}" targeting style: ${targetStyle}`);

    if (targetStyle === 'none') {
        console.log("Style 'none': Returning original name.");
        return { abbreviation: originalName, suggestionError: '' };
    }

    let abbreviation = originalName;
    let suggestionError = '';
    let found = false;

    // 1. Check Custom if style is 'custom'
    if (targetStyle === 'custom' && customAbbrs[originalName]) {
        abbreviation = customAbbrs[originalName];
        found = true;
        console.log(`Style 'custom': Found custom abbreviation: ${abbreviation}`);
    }

    // 2. Check Short if style is 'short' (and custom not found/applicable)
    if (!found && targetStyle === 'short') {
        const stdAbbrDict = isConference ? standardConferenceAbbreviations : standardJournalAbbreviations;
        let foundStdAbbrKey = Object.keys(stdAbbrDict).find(key => isConference ? originalName.toLowerCase().includes(key.toLowerCase()) : originalName === key);
        const stdAbbrValue = foundStdAbbrKey ? stdAbbrDict[foundStdAbbrKey] : null;

        if (stdAbbrValue && shortAbbreviations[stdAbbrValue]) {
            abbreviation = shortAbbreviations[stdAbbrValue];
            found = true;
            console.log(`Style 'short': Found short abbreviation via standard mapping ('${stdAbbrValue}'): ${abbreviation}`);
        } else if (shortAbbreviations[originalName]) {
            abbreviation = shortAbbreviations[originalName];
            found = true;
            console.log(`Style 'short': Found direct short abbreviation: ${abbreviation}`);
        }
    }

    // 3. Check Standard if style is 'standard' (and custom/short not found/applicable)
    if (!found && targetStyle === 'standard') {
        const stdAbbrDict = isConference ? standardConferenceAbbreviations : standardJournalAbbreviations;
        let foundStdAbbrKey = Object.keys(stdAbbrDict).find(key => isConference ? originalName.toLowerCase().includes(key.toLowerCase()) : originalName === key);
        const stdAbbrValue = foundStdAbbrKey ? stdAbbrDict[foundStdAbbrKey] : null;

        if (stdAbbrValue) {
            abbreviation = stdAbbrValue;
            found = true;
            console.log(`Style 'standard': Found standard abbreviation: ${abbreviation}`);
        }
    }

    // Fallback Chain (if no match found for the target style)
    if (!found) {
        console.log(`Style '${targetStyle}': No match found for target style. Trying fallback chain...`);

        // a. Try extracting from name "Name (N)"
        const abbrMatch = originalName.match(/\(([^)]+)\)\s*$/);
        if (!found && abbrMatch) {
            let extractedAbbr = abbrMatch[1].trim();
            if (extractedAbbr.toLowerCase().includes("workshops")) extractedAbbr = extractedAbbr.replace(/workshops/i, 'Wkshps');
            if (extractedAbbr.toLowerCase().includes("proceedings")) extractedAbbr = extractedAbbr.replace(/proceedings/i, 'Proc.');
            if (/[a-zA-Z]/.test(extractedAbbr) && extractedAbbr.length > 1 && extractedAbbr.length < 50) {
                abbreviation = extractedAbbr;
                found = true;
                console.log(`Fallback: Used extracted abbreviation: ${abbreviation}`);
            }
        }

        // b. Try Gemini Suggestion
        if (!found) {
            try {
                abbreviation = await suggestAbbreviationViaGemini(originalName, isConference, apiKey, useGemini);
                console.log(`Fallback: Gemini suggestion result: ${abbreviation}`);
            } catch (suggError) {
                console.error("Abbreviation suggestion failed:", suggError.message);
                if (suggError.message.includes('API key') || suggError.message.includes('timed out') || suggError.message.includes('forbidden') || suggError.message.includes('API request failed')) {
                    suggestionError = ` [Suggestion Error: ${suggError.message}]`;
                }
                abbreviation = fallbackAbbreviation(originalName, isConference);
                console.log(`Fallback: Using basic fallback after suggestion error: ${abbreviation}`);
            }
        }

        // c. Basic Fallback (if Gemini didn't help or wasn't used)
        if (abbreviation === originalName) {
             abbreviation = fallbackAbbreviation(originalName, isConference);
             console.log(`Fallback: Using basic fallback as final attempt: ${abbreviation}`);
         }
    }

    // Final Cleanup
    if ((!abbreviation || abbreviation === 'N/A') && originalName && originalName !== 'N/A') {
         abbreviation = originalName;
         console.log(`Style '${targetStyle}': Final result reverted to original name: ${abbreviation}`);
    } else if (!abbreviation) {
         abbreviation = 'N/A';
         console.log(`Style '${targetStyle}': Final result is N/A`);
    }

    return { abbreviation, suggestionError };
}

/**
 * Fetches and parses arXiv BibTeX data.
 */
async function getArxivCitation(url) {
    const paperIdMatch = url.match(/arxiv\.org\/(?:abs|pdf|html|ps)\/([\d.]+)/);
    if (!paperIdMatch) throw new Error("Could not extract paper ID from arXiv URL.");
    const paperId = paperIdMatch[1];
    const bibtexUrl = `https://arxiv.org/bibtex/${paperId}`;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const response = await fetch(bibtexUrl, {
             signal: controller.signal,
             headers: { 'User-Agent': 'CitationFormatterExtension/1.6', 'Accept': 'application/x-bibtex; charset=utf-8' }
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`Failed to fetch arXiv BibTeX (${response.status}): ${response.statusText}`);
        const bibtexContent = await response.text();
        if (!bibtexContent || !bibtexContent.trim().startsWith('@')) throw new Error(`Unexpected BibTeX content received`);
        const citationInfo = parseBibtex(bibtexContent);
        citationInfo.url = `https://arxiv.org/abs/${paperId}`;
        const yearMatch = bibtexContent.match(/year\s*=\s*(?:\{?(\d{4})\}?|\"?(\d{4})\"?)/i);
        citationInfo.year = yearMatch ? (yearMatch[1] || yearMatch[2]) : '';
        return citationInfo;
    } catch (error) {
        if (error.name === 'AbortError') throw new Error("Fetching arXiv data timed out.");
        console.error("Error fetching/parsing arXiv BibTeX:", error);
        throw new Error(`Failed to get arXiv citation: ${error.message}`);
    }
}

/**
 * Parses BibTeX content into a key-value object.
 */
function parseBibtex(bibtexContent) {
    const citationInfo = {};
    const regex = /(\w+)\s*=\s*(?:\{((?:[^{}]|\{[^{}]*\})*)\}|\"((?:[^\"\\]|\\.)*)\")/g;
    let match;
    while ((match = regex.exec(bibtexContent)) !== null) {
        const key = match[1].toLowerCase().trim();
        const value = (match[2] !== undefined ? match[2] : match[3])
                      .replace(/\\(['"`\\{}%&~#^])/g, '$1')
                      .replace(/\{\\relax\s*\}/g, '')
                      .replace(/\s+/g, ' ')
                      .trim();
        citationInfo[key] = value;
    }
    const entryMatch = bibtexContent.match(/^@(\w+)\s*\{\s*([^,]+)/);
    if (entryMatch) {
        citationInfo._entryType = entryMatch[1].toLowerCase();
        citationInfo._entryKey = entryMatch[2].trim();
    }
    return citationInfo;
}

/**
 * Formats arXiv citation info into requested modes.
 */
function formatArxivCitation(citationInfo, citationMode) {
    const authorsStr = citationInfo.author || 'N/A';
    const title = citationInfo.title || 'N/A';
    const eprint = citationInfo.eprint || 'N/A';
    const archivePrefix = citationInfo.archiveprefix || 'arXiv';
    const url = citationInfo.url || 'N/A';
    const year = citationInfo.year || '';
    const twoDigitYear = getTwoDigitYear(year);

    const authorList = authorsStr.split(/\s+and\s+/);
    const formattedAuthors = authorList.map(author => {
        const parts = author.split(/,\s*/);
        let lastName = parts[0].trim();
        let givenNames = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
        if (parts.length === 1) { const names = author.split(/\s+/); lastName = names.pop() || ''; givenNames = names.join(' '); }
        if (!lastName) return author;
        const initials = givenNames.split(/\s+|-/).filter(n => n).map(n => n[0].toUpperCase() + '.').join('');
        return `${initials} ${lastName}`;
    });
    let authors = 'N/A';
    if (formattedAuthors.length > 0) {
        if (formattedAuthors.length === 1) authors = formattedAuthors[0];
        else if (formattedAuthors.length === 2) authors = formattedAuthors.join(' and ');
        else authors = formattedAuthors.slice(0, -1).join(', ') + ', and ' + formattedAuthors[formattedAuthors.length - 1];
    }

    const arxivId = `${archivePrefix}:${eprint}`;
    const fullCitation = `${authors}, "${title}," ${arxivId}. [Online]. Available: ${url}`;
    const pptAbbr = 'arXiv';
    const pptCitation = twoDigitYear ? `${title} (${twoDigitYear}'${pptAbbr})` : `${title} (${pptAbbr})`;

    const result = { full: fullCitation, ppt: pptCitation };
    if (citationMode === 'full') return { full: fullCitation, ppt: null };
    if (citationMode === 'ppt') return { full: null, ppt: pptCitation };
    return result;
}

/**
 * Fetches IEEE metadata using the offscreen document.
 */
async function getIeeeCitation(url) {
    try {
        const existingContexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'], documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)] });
        if (existingContexts.length === 0) {
            console.log("Creating new offscreen document for IEEE parsing.");
            await chrome.offscreen.createDocument({ url: OFFSCREEN_DOCUMENT_PATH, reasons: [chrome.offscreen.Reason.DOM_PARSER], justification: 'Parse IEEE Xplore metadata' });
            await new Promise(resolve => setTimeout(resolve, 500));
        } else { console.log("Using existing offscreen document for IEEE parsing."); }

        console.log("Sending getIeeeMetadata message to offscreen document.");
        const response = await Promise.race([
            chrome.runtime.sendMessage({ target: 'offscreen', action: 'getIeeeMetadata', url: url }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Offscreen document communication timed out (20s).')), 20000))
        ]);

        if (!response) throw new Error("No response received from offscreen document. It might have closed or failed.");
        if (!response.success) throw new Error(response.error || "Offscreen document reported an unspecified error during metadata extraction.");
        return response;

    } catch (error) {
        console.error("Error communicating with/creating offscreen document:", error);
        closeOffscreenDocument();
        throw new Error(`Failed to get IEEE citation via offscreen document: ${error.message}`);
    }
}

/**
 * Formats IEEE citation info into requested modes.
 */
async function formatIeeeCitation(metadata, citationMode, settings) {
    const authorsList = metadata?.authors ?? [];
    const title = metadata?.title ?? 'N/A';
    let originalPubName = metadata?.publicationTitle ?? 'N/A';
    const pubDateStr = metadata?.publicationDate ?? '';
    const volume = metadata?.volume ?? '';
    const issue = metadata?.issue ?? '';
    const startPage = metadata?.startPage ?? '';
    const endPage = metadata?.endPage ?? '';
    const articleNumber = metadata?.articleNumber ?? '';
    const contentType = metadata?.contentType?.toLowerCase() ?? '';
    const isConference = contentType.includes('conference') || contentType.includes('proceeding') ||
                         originalPubName.toLowerCase().includes('conference') || originalPubName.toLowerCase().includes('symposium') ||
                         originalPubName.toLowerCase().includes('workshop') || originalPubName.toLowerCase().includes('wkshps');

    const formattedAuthors = authorsList.map(author => {
        const name = author?.name ?? ''; const names = name.split(' '); if (names.length < 2) return name;
        const lastName = names[names.length - 1]; const givenNames = names.slice(0, -1);
        const initials = givenNames.map(n => n.split('-').map(part => part.length > 0 ? part[0].toUpperCase() + '.' : '').join('-')).join('');
        return `${initials} ${lastName}`;
    });
    let authors = 'N/A';
    if (formattedAuthors.length > 0) { authors = formattedAuthors.length === 1 ? formattedAuthors[0] : (formattedAuthors.length === 2 ? formattedAuthors.join(' and ') : formattedAuthors.slice(0, -1).join(', ') + ', and ' + formattedAuthors[formattedAuthors.length - 1]); }

    let pagesStr = '';
    if (startPage && endPage && startPage !== endPage) pagesStr = `pp. ${startPage}-${endPage}`;
    else if (startPage) pagesStr = `p. ${startPage}`;
    else if (articleNumber) pagesStr = `Art. no. ${articleNumber}`;

    let formattedDate = ''; let twoDigitYear = '';
    if (pubDateStr) {
        try {
            const normalizedDateStr = pubDateStr.replace(/-\s*/g, ' ').replace(/\.\s*/g, ' ');
            const dateObj = new Date(normalizedDateStr);
            if (!isNaN(dateObj.getTime())) {
                const year = dateObj.getFullYear(); twoDigitYear = year.toString().slice(-2);
                if (normalizedDateStr.trim().length === 4 && /^\d{4}$/.test(normalizedDateStr.trim())) { formattedDate = year.toString(); }
                else { const monthIndex = dateObj.getMonth(); if (monthIndex >= 0 && monthIndex <= 11) { const month = dateObj.toLocaleString('en-US', { month: 'short' }); formattedDate = `${month}. ${year}`; } else { formattedDate = year.toString(); } }
            } else { const yearMatch = pubDateStr.match(/\b(\d{4})\b/); if (yearMatch) { formattedDate = yearMatch[1]; twoDigitYear = yearMatch[1].slice(-2); } }
        } catch (e) { console.warn("Error parsing date:", pubDateStr, e); }
    }

    const { abbreviation: fullModeAbbr, suggestionError } = await getAbbreviationForStyle(originalPubName, isConference, settings.fullModeAbbrStyle, settings);
    const { abbreviation: pptModeAbbr } = await getAbbreviationForStyle(originalPubName, isConference, settings.pptModeAbbrStyle, settings);

    let fullCitation = `${authors}, "${title}," `;
    if (isConference) { fullCitation += (/proc\.|proceedings|conf\.|conference|symp\.|symposium|wkshps\.|workshops/i.test(fullModeAbbr)) ? `in ${fullModeAbbr}` : `${fullModeAbbr}`; }
    else { fullCitation += `${fullModeAbbr}`; }
    if (volume) fullCitation += `, vol. ${volume}`;
    if (issue) fullCitation += `, no. ${issue}`;
    if (pagesStr) fullCitation += `, ${pagesStr}`;
    if (formattedDate) fullCitation += `, ${formattedDate}`;
    fullCitation += '.';
    fullCitation += suggestionError;
    fullCitation = fullCitation.replace(/,?\s*N\/A,?/g, '').replace(/vol\.\s*,/g, 'vol.').replace(/no\.\s*,/g, 'no.').replace(/,\s*,/g, ',').replace(/\s+,/g, ',').replace(/,\s*\./g, '.').replace(/\s{2,}/g, ' ').replace(/\.\.+/g, '.').trim();

    const pptCitation = twoDigitYear ? `${title} (${twoDigitYear}'${pptModeAbbr})` : `${title} (${pptModeAbbr})`;

    const result = { full: fullCitation, ppt: pptCitation, suggestionError: suggestionError };
    if (citationMode === 'full') return { full: fullCitation, ppt: null, suggestionError: suggestionError };
    if (citationMode === 'ppt') return { full: null, ppt: pptCitation, suggestionError: suggestionError };
    return result;
}


// --- Background Script Event Listener ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchCitation' && message.url && !sender.tab) {
        const url = message.url;
        console.log(`Background: Received fetchCitation request for ${url}`);
        (async () => {
            let settings = {};
            try {
                settings = await getSettings();
                const citationMode = settings.citationMode;
                console.log("Background: Using citation mode:", citationMode, "Full Abbr style:", settings.fullModeAbbrStyle, "PPT Abbr style:", settings.pptModeAbbrStyle);

                let citationResult;

                if (url.includes('arxiv.org')) {
                    const citationInfo = await getArxivCitation(url);
                    citationResult = formatArxivCitation(citationInfo, citationMode);
                } else if (url.includes('ieeexplore.ieee.org')) {
                    const ieeeResponse = await getIeeeCitation(url);
                    if (!ieeeResponse || !ieeeResponse.metadata) throw new Error(ieeeResponse.error || "No valid metadata received from IEEE source via offscreen document.");
                    citationResult = await formatIeeeCitation(ieeeResponse.metadata, citationMode, settings);
                } else {
                    throw new Error("Unsupported URL.");
                }

                console.log("Formatted citation result:", citationResult);
                sendResponse({ success: true, citation: citationResult });

            } catch (error) {
                console.error("Error processing citation in background:", error);
                let finalErrorMsg = error.message || "An unknown error occurred.";
                if (error.stack) { finalErrorMsg += `\nStack: ${error.stack.substring(0, 200)}...`; }
                if (settings.citationMode) { finalErrorMsg += ` (Settings: citationMode=${settings.citationMode}, fullModeAbbrStyle=${settings.fullModeAbbrStyle}, pptModeAbbrStyle=${settings.pptModeAbbrStyle})`; }
                sendResponse({ success: false, error: finalErrorMsg });
            }
        })();
        return true; // Indicates async response
    }
    return false;
});

// --- Lifecycle Events & Offscreen Doc Management ---
async function closeOffscreenDocument() {
    try {
        const contexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
        if (contexts.length > 0 && chrome.offscreen.closeDocument) {
            console.log("Closing existing offscreen document.");
            await chrome.offscreen.closeDocument();
        } else if (contexts.length > 0) {
             console.log("Offscreen document exists but closeDocument API not available (Chrome < 116). It will close automatically.");
        }
    } catch (error) { console.error("Error trying to close offscreen document:", error); }
}

chrome.runtime.onInstalled.addListener(details => {
    console.log("Extension installed/updated:", details.reason);
    const defaults = {
        geminiApiKey: null, useGemini: false, autoCopy: true,
        citationMode: 'full',
        fullModeAbbrStyle: 'standard',
        pptModeAbbrStyle: 'short',
        customAbbreviations: {}
    };
    if (details.reason === "install") {
        chrome.storage.sync.set(defaults, () => {
             if (chrome.runtime.lastError) console.error("Error initializing settings:", chrome.runtime.lastError);
             else console.log("Default settings initialized.");
        });
    } else if (details.reason === "update") {
         chrome.storage.sync.get(defaults, (items) => {
             const settingsToSet = {};
             if (items.fullModeAbbrStyle === undefined) settingsToSet.fullModeAbbrStyle = defaults.fullModeAbbrStyle;
             if (items.pptModeAbbrStyle === undefined) settingsToSet.pptModeAbbrStyle = defaults.pptModeAbbrStyle;
             if (items.customAbbreviations === undefined) settingsToSet.customAbbreviations = defaults.customAbbreviations;
             if (items.abbreviationStyle !== undefined) { // Check for legacy key
                 chrome.storage.sync.remove('abbreviationStyle', () => {
                     if (chrome.runtime.lastError) console.error("Error removing legacy 'abbreviationStyle':", chrome.runtime.lastError);
                     else console.log("Removed legacy 'abbreviationStyle' setting.");
                 });
             }
             if (Object.keys(settingsToSet).length > 0) {
                 chrome.storage.sync.set(settingsToSet, () => {
                     if (chrome.runtime.lastError) console.error("Error setting default values on update:", chrome.runtime.lastError);
                     else console.log("Ensured new settings exist with defaults on update.");
                 });
             } else { console.log("All settings already exist on update."); }
         });
    }
    closeOffscreenDocument();
});

chrome.runtime.onStartup.addListener(() => {
    console.log("Extension started up via browser startup.");
    closeOffscreenDocument();
});

console.log("Background service worker started/awoken.");

