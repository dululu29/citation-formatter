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
    // MDPI Journals
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
    'Journal of Clinical Medicine': 'J. Clin. Med.',
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
};

// Short Style Abbreviations (used for 'short' style and PPT mode)
// Key: Standard IEEE Abbreviation (from above lists) or Full Name if no standard exists
const shortAbbreviations = {
    // Communications & Networking
    'IEEE J. Sel. Areas Commun.': 'JSAC', 'IEEE Trans. Commun.': 'TCOM', 'IEEE Trans. Mobile Comput.': 'TMC',
    'IEEE Trans. Veh. Technol.': 'TVT', 'IEEE Commun. Lett.': 'CL', 'IEEE Wireless Commun. Lett.': 'WCL',
    'IEEE Commun. Mag.': 'COMMAG', 'IEEE Wireless Commun.': 'WCM', 'IEEE Commun. Surv. Tutor.': 'COMST',
    'IEEE Trans. Wirel. Commun.': 'TWC', 'IEEE Netw.': 'NETWORK', 'IEEE/ACM Trans. Netw.': 'TON',
    'IEEE Internet Things J.': 'IOT-J', 'IEEE GLOBECOM': 'GLOBECOM', 'IEEE GC Wkshps': 'GC Wkshps',
    'IEEE ICC': 'ICC', 'IEEE INFOCOM': 'INFOCOM', 'IEEE WCNC': 'WCNC', 'IEEE VTC': 'VTC',
    'IEEE PIMRC': 'PIMRC', 'IEEE WiMob': 'WiMob', 'IEEE CCNC': 'CCNC', 'IEEE ISCC': 'ISCC',
    'IEEE MASS': 'MASS', 'IEEE WoWMoM': 'WoWMoM', 'IEEE ICCC Wkshps': 'ICCC Wkshps',
    'IEEE NetConf': 'NetConf', 'IEEE NOMS': 'NOMS',
    // Signal Processing
    'IEEE Trans. Signal Process.': 'TSP', 'IEEE Signal Process. Lett.': 'SPL',
    'IEEE J. Sel. Topics Signal Process.': 'JSTSP', 'IEEE Trans. Image Process.': 'TIP',
    'IEEE/ACM Trans. Audio, Speech, Lang. Process.': 'TASLP', 'IEEE ICASSP': 'ICASSP',
    'IEEE ICIP': 'ICIP', 'IEEE GlobalSIP': 'GlobalSIP', 'IEEE SiPS': 'SiPS',
    // Computer Science & Engineering
    'IEEE Trans. Comput.': 'TC', 'IEEE Trans. Parallel Distrib. Syst.': 'TPDS',
    'IEEE Trans. Softw. Eng.': 'TSE', 'IEEE Trans. Knowl. Data Eng.': 'TKDE',
    'IEEE Trans. Dependable Secure Comput.': 'TDSC', 'IEEE Comput.': 'Computer',
    'IEEE ICDCS': 'ICDCS', 'IEEE S&P': 'S&P', 'IEEE/CVF CVPR': 'CVPR', 'IEEE/CVF ICCV': 'ICCV',
    'IEEE ICDE': 'ICDE', 'IEEE HPCA': 'HPCA', 'IEEE RTSS': 'RTSS',
    // Circuits & Systems
    'IEEE Trans. Circuits Syst. I, Reg. Papers': 'TCAS-I',
    'IEEE Trans. Circuits Syst. II, Exp. Briefs': 'TCAS-II',
    'IEEE Trans. Very Large Scale Integr. (VLSI) Syst.': 'TVLSI',
    'IEEE J. Emerg. Sel. Topics Circuits Syst.': 'JETCAS', 'IEEE ISSCC': 'ISSCC',
    'IEEE CICC': 'CICC', 'IEEE ISCAS': 'ISCAS', 'ACM/IEEE DAC': 'DAC',
    // Machine Learning / AI / Pattern Analysis
    'IEEE Trans. Pattern Anal. Mach. Intell.': 'TPAMI',
    'IEEE Trans. Neural Netw. Learn. Syst.': 'TNNLS', 'IEEE Trans. Fuzzy Syst.': 'TFS',
    'IEEE Trans. Evol. Comput.': 'TEC', 'IEEE Trans. Artif. Intell.': 'TAI',
    'NeurIPS': 'NeurIPS', 'ICML': 'ICML', 'AAAI': 'AAAI',
    // Other Engineering Areas
    'IEEE Trans. Autom. Control': 'TAC', 'IEEE Trans. Robot.': 'T-RO',
    'IEEE Trans. Power Syst.': 'TPWRS', 'IEEE Trans. Power Electron.': 'TPEL',
    'IEEE Trans. Ind. Electron.': 'TIE', 'Proc. IEEE': 'Proc. IEEE', 'IEEE ICRA': 'ICRA',
    'IEEE/RSJ IROS': 'IROS', 'IEEE CDC': 'CDC',
    // MDPI Short Names
    'Sensors': 'Sensors', 'Remote Sens.': 'RS', 'Energies': 'Energies', 'Materials': 'Materials',
    'Int. J. Mol. Sci.': 'IJMS', 'Molecules': 'Molecules', 'Appl. Sci.': 'Appl. Sci.',
    'Sustainability': 'Sustainability', 'Electronics': 'Electronics', 'Viruses': 'Viruses',
    'Water': 'Water', 'Nutrients': 'Nutrients', 'Cancers': 'Cancers', 'Polymers': 'Polymers',
    'J. Clin. Med.': 'JCM',
};

// --- Helper Functions ---

/**
 * Retrieves specified settings from storage with default values.
 * Handles potential errors during retrieval.
 * @param {object} defaults - Object with default values for the keys.
 * @returns {Promise<object>} Object containing the retrieved settings.
 */
async function getSettings(defaults) {
    try {
        const defaultValues = {
            geminiApiKey: null, useGemini: false, autoCopy: true,
            citationMode: 'full',
            fullModeAbbrStyle: 'standard', // Default Full Mode style
            pptModeAbbrStyle: 'short',     // Default PPT Mode style
            customAbbreviations: {},
            ...defaults
        };
        const items = await chrome.storage.sync.get(defaultValues);
        if (chrome.runtime.lastError) {
            console.error("Error retrieving settings:", chrome.runtime.lastError);
            return defaultValues; // Return defaults on error
        }
        // Ensure customAbbreviations is always an object
        if (typeof items.customAbbreviations !== 'object' || items.customAbbreviations === null) {
            console.warn("Invalid customAbbreviations found in storage, resetting to empty object.");
            items.customAbbreviations = {};
        }
        return items; // Returns object with keys present in storage or defaults
    } catch (error) {
        console.error("Exception retrieving settings:", error);
        // Return a safe default structure on exception
        return {
            geminiApiKey: null, useGemini: false, autoCopy: true,
            citationMode: 'full', fullModeAbbrStyle: 'standard', pptModeAbbrStyle: 'short',
            customAbbreviations: {}, ...defaults
        };
    }
}

/**
 * Extracts the last two digits of the year from various date formats.
 * @param {string} dateStr - The publication date string.
 * @returns {string} The two-digit year (e.g., '24') or empty string if not found.
 */
function getTwoDigitYear(dateStr) {
    if (!dateStr) return '';
    const yearMatch = dateStr.match(/\b(\d{4})\b/);
    if (yearMatch && yearMatch[1]) {
        return yearMatch[1].slice(-2); // Get last two digits
    }
    // Try parsing if no 4-digit year found directly
    try {
        const normalizedDateStr = dateStr.replace(/-\s*/g, ' ').replace(/\.\s*/g, ' ');
        const dateObj = new Date(normalizedDateStr);
        if (!isNaN(dateObj.getTime())) {
            const year = dateObj.getFullYear();
            return year.toString().slice(-2);
        }
    } catch (e) { /* Ignore parsing errors */ }
    return ''; // Fallback
}

/**
 * Calls the Gemini API to suggest an abbreviation.
 * NOTE: This function now takes the API key and useGemini flag as arguments
 * to avoid redundant storage reads within the abbreviation logic flow.
 * @param {string} name - The full conference or journal name.
 * @param {boolean} isConference - True if it's a conference, false for a journal.
 * @param {string|null} apiKey - The Gemini API key from settings.
 * @param {boolean} useGemini - The flag indicating if Gemini should be used.
 * @returns {Promise<string>} - The suggested abbreviation or a fallback. Throws specific errors.
 */
async function suggestAbbreviationViaGemini(name, isConference, apiKey, useGemini) {
    if (!useGemini) {
        console.log("Gemini usage disabled by setting. Using fallback.");
        // Return fallback directly, don't throw error here
        return fallbackAbbreviation(name, isConference);
    }
    if (!apiKey) {
        console.warn("Gemini enabled but API key is missing.");
        // Throw error to be caught by caller, indicating configuration issue
        throw new Error("Gemini enabled, but API key is missing. Please set it in options.");
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    // Updated prompt to be slightly more general
    const prompt = `Suggest a standard abbreviation (like IEEE style or ISO 4) for the following ${isConference ? 'conference' : 'journal'}: "${name}". Return only the abbreviation text itself, nothing else.`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(geminiApiUrl, {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 80 }
            }),
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorData = {};
            try { errorData = await response.json(); } catch (e) { /* Ignore */ }
            console.error('Gemini API Error:', response.status, response.statusText, errorData);
            if (response.status === 400 && errorData?.error?.message?.includes('API key not valid')) {
                 throw new Error(`Gemini API key is invalid. Please check it in options.`);
            }
             if (response.status === 403) {
                 throw new Error(`Gemini API request forbidden (check key permissions/billing).`);
            }
            throw new Error(`Gemini API request failed (${response.status}): ${errorData?.error?.message || response.statusText}`);
        }

        const data = await response.json();
        // Use optional chaining extensively for safety
        const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (suggestion) {
            console.log(`Gemini Suggested Abbreviation for '${name}': ${suggestion}`);
            // Basic cleanup for common Gemini additions
            return suggestion.replace(/^\"|\"$/g, '').replace(/\.$/, '');
        } else {
            console.warn("Gemini response format unexpected or empty. Using fallback.");
            console.log("Gemini Raw Response:", JSON.stringify(data)); // Log raw response for debugging
            return fallbackAbbreviation(name, isConference);
        }

    } catch (error) {
         if (error.name === 'AbortError') {
             console.error("Gemini API call timed out.");
             // Let the caller handle timeout, throw specific error
             throw new Error("Gemini API call timed out.");
         }
        console.error(`Gemini API call failed: ${error.message}`);
        // Re-throw specific API key errors or timeout errors to be caught by getAbbreviationForStyle
        if (error.message.includes('Gemini API key') || error.message.includes('timed out') || error.message.includes('forbidden') || error.message.includes('Gemini API request failed')) {
            throw error;
        }
        // For other unexpected errors, log and return fallback
        console.warn("Returning fallback due to unhandled Gemini error.");
        return fallbackAbbreviation(name, isConference); // Fallback for other errors
    }
}

/**
 * Generates a simple fallback abbreviation if no other method works.
 * @param {string} name - The full conference or journal name.
 * @param {boolean} isConference - True if it's a conference, false for a journal.
 * @returns {string} - The fallback abbreviation.
 */
function fallbackAbbreviation(name, isConference) {
    // This is the complex fallback logic from earlier versions
    if (!name || typeof name !== 'string') return 'N/A';
    const words = name.split(/\s+/);
    // More comprehensive skip list, including common publisher names
    const skipWords = new Set(["ieee", "acm", "mdpi", "on", "and", "in", "of", "the", "for", "&", "an", "a", "with", "using", "computers", "communications", "networking", "mobile", "computing", "systems", "technology", "wireless", "vehicular", "selected", "areas", "transactions", "journal", "letters", "magazine", "conference", "symposium", "workshops", "proceedings", "international", "global", "society", "technical", "annual", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"]);
    let abbr = "";

    // Filter significant words (start with capital, not skipped)
    let significantWords = words.filter(w => w && /^[A-Z]/.test(w) && !skipWords.has(w.toLowerCase()));

    // If few significant words, consider common nouns if capitalized
    if (significantWords.length < 2) {
        significantWords = words.filter(w => w && /^[A-Z]/.test(w) && !skipWords.has(w.toLowerCase()) || ["Communications", "Wireless", "Network", "Vehicular", "Technology", "Computing", "Mobile", "Signal", "Image", "Processing", "Systems", "Circuits", "Sensors", "Remote", "Sensing", "Materials", "Sciences", "Applied"].includes(w) );
        significantWords = [...new Set(significantWords)]; // Remove duplicates if any added
    }

    if (isConference) {
        // Join initials of significant words
        abbr = significantWords.map(w => w[0].toUpperCase()).join('');
        // Add standard suffixes based on original name patterns
        if (/Conference/i.test(name)) abbr = `Proc. ${abbr} Conf.`;
        else if (/Symposium/i.test(name)) abbr = `Proc. ${abbr} Symp.`;
        else if (/Workshops/i.test(name)) abbr = `Proc. ${abbr} Wkshps.`;
        else if (/Proceedings/i.test(name)) abbr = `Proc. ${abbr}`; // If name itself is Proc.
        else abbr = `Proc. ${abbr}`; // Default assumption

    } else { // Journal logic - simplified fallback, less reliant on IEEE structure
        // Use significant words, potentially abbreviating common terms
         abbr = significantWords.map(w => {
            if (w === 'Transactions') return 'Trans.';
            if (w === 'Journal') return 'J.';
            if (w === 'Letters') return 'Lett.';
            if (w === 'Magazine') return 'Mag.';
            if (w === 'Proceedings') return 'Proc.';
            if (w === 'International') return 'Int.';
            if (w === 'Systems') return 'Syst.';
            if (w === 'Circuits') return 'Circ.';
            if (w === 'Communications') return 'Commun.';
            if (w === 'Computer') return 'Comput.';
            if (w === 'Sciences') return 'Sci.';
            if (w === 'Applied') return 'Appl.';
            if (w === 'Sensing') return 'Sens.';
            // Add more common abbreviations if needed
            return w; // Keep others as is
         }).join(' ');
    }

    // Final cleanup
    abbr = abbr.replace(/\s+/g, ' ').replace(/Proc\. Proc\./i, 'Proc.').trim();
    // If abbreviation logic fails badly, return original name
    if (!abbr || abbr === "IEEE" || abbr === "Proc.") {
        abbr = name;
    }
    console.log(`Fallback Abbreviation for '${name}': ${abbr}`);
    return abbr;
}


/**
 * Determines the final abbreviation based on a *specific* style preference and available data.
 * This function is called separately for Full Mode and PPT Mode formatting.
 * Priority within this function depends on the targetStyle:
 * - If 'custom': Custom -> [Fallback Chain]
 * - If 'short': Short -> [Fallback Chain]
 * - If 'standard': Standard -> [Fallback Chain]
 * - If 'none': Returns originalName directly.
 * Fallback Chain: Extracted -> Gemini -> Basic Fallback -> Original Name
 *
 * @param {string} originalName - The full publication name.
 * @param {boolean} isConference - True if conference, false if journal.
 * @param {string} targetStyle - The desired style ('none', 'standard', 'short', 'custom').
 * @param {object} settings - The retrieved user settings object (contains customAbbrs, useGemini, apiKey).
 * @returns {Promise<{abbreviation: string, suggestionError: string}>} - The chosen abbreviation and any suggestion error message.
 */
async function getAbbreviationForStyle(originalName, isConference, targetStyle, settings) {
    const customAbbrs = settings.customAbbreviations || {};
    const useGemini = settings.useGemini;
    const apiKey = settings.geminiApiKey;

    console.log(`Getting abbreviation for "${originalName}" targeting style: ${targetStyle}`);

    // --- Style: None ---
    if (targetStyle === 'none') {
        console.log("Style 'none': Returning original name.");
        return { abbreviation: originalName, suggestionError: '' };
    }

    let abbreviation = originalName; // Default fallback
    let suggestionError = '';
    let found = false;

    // --- Check based on targetStyle priority ---

    // 1. Check Custom if style is 'custom'
    if (targetStyle === 'custom' && customAbbrs[originalName]) {
        abbreviation = customAbbrs[originalName];
        found = true;
        console.log(`Style 'custom': Found custom abbreviation: ${abbreviation}`);
    }

    // 2. Check Short if style is 'short' (and custom not found/applicable)
    if (!found && targetStyle === 'short') {
        const stdAbbrDict = isConference ? standardConferenceAbbreviations : standardJournalAbbreviations;
        // Find standard abbreviation first (case-insensitive for conf, sensitive for journal keys)
        let foundStdAbbrKey = Object.keys(stdAbbrDict).find(key =>
            isConference ? originalName.toLowerCase().includes(key.toLowerCase()) : originalName === key
        );
        const stdAbbrValue = foundStdAbbrKey ? stdAbbrDict[foundStdAbbrKey] : null;

        if (stdAbbrValue && shortAbbreviations[stdAbbrValue]) {
            abbreviation = shortAbbreviations[stdAbbrValue];
            found = true;
            console.log(`Style 'short': Found short abbreviation via standard mapping ('${stdAbbrValue}'): ${abbreviation}`);
        } else if (shortAbbreviations[originalName]) { // Direct match in short list (e.g., MDPI full name -> short name)
            abbreviation = shortAbbreviations[originalName];
            found = true;
            console.log(`Style 'short': Found direct short abbreviation: ${abbreviation}`);
        }
    }

    // 3. Check Standard if style is 'standard' (and custom/short not found/applicable)
    if (!found && targetStyle === 'standard') {
        const stdAbbrDict = isConference ? standardConferenceAbbreviations : standardJournalAbbreviations;
        let foundStdAbbrKey = Object.keys(stdAbbrDict).find(key =>
            isConference ? originalName.toLowerCase().includes(key.toLowerCase()) : originalName === key
        );
        const stdAbbrValue = foundStdAbbrKey ? stdAbbrDict[foundStdAbbrKey] : null;

        if (stdAbbrValue) {
            abbreviation = stdAbbrValue;
            found = true;
            console.log(`Style 'standard': Found standard abbreviation: ${abbreviation}`);
        }
    }

    // --- Fallback Chain (if no match found for the target style) ---
    if (!found) {
        console.log(`Style '${targetStyle}': No match found for target style. Trying fallback chain...`);

        // a. Try extracting from name "Name (N)"
        const abbrMatch = originalName.match(/\(([^)]+)\)\s*$/);
        if (!found && abbrMatch) {
            let extractedAbbr = abbrMatch[1].trim();
            // Normalize common variations
            if (extractedAbbr.toLowerCase().includes("workshops")) extractedAbbr = extractedAbbr.replace(/workshops/i, 'Wkshps');
            if (extractedAbbr.toLowerCase().includes("proceedings")) extractedAbbr = extractedAbbr.replace(/proceedings/i, 'Proc.');
            // Basic sanity check
            if (/[a-zA-Z]/.test(extractedAbbr) && extractedAbbr.length > 1 && extractedAbbr.length < 50) {
                abbreviation = extractedAbbr;
                found = true; // Consider extraction a success
                console.log(`Fallback: Used extracted abbreviation: ${abbreviation}`);
            }
        }

        // b. Try Gemini Suggestion (if extraction failed)
        if (!found) {
            try {
                // Pass settings directly to avoid re-reading storage
                abbreviation = await suggestAbbreviationViaGemini(originalName, isConference, apiKey, useGemini);
                // If Gemini returns the original name, it might still be the best option if fallback is worse
                console.log(`Fallback: Gemini suggestion result: ${abbreviation}`);
                // Don't mark 'found=true' here, let the basic fallback run if Gemini wasn't helpful
            } catch (suggError) {
                console.error("Abbreviation suggestion failed:", suggError.message);
                // Store specific error message if it's useful for user feedback
                if (suggError.message.includes('API key') || suggError.message.includes('timed out') || suggError.message.includes('forbidden') || suggError.message.includes('API request failed')) {
                    suggestionError = ` [Suggestion Error: ${suggError.message}]`;
                }
                // Use basic fallback immediately ONLY if suggestion fails catastrophically
                // Otherwise, let the next step handle the basic fallback.
                if (!abbreviation || abbreviation === originalName) { // Check if Gemini failed or returned original
                   abbreviation = fallbackAbbreviation(originalName, isConference);
                   console.log(`Fallback: Using basic fallback after suggestion error/no result: ${abbreviation}`);
                }
            }
        }

         // c. Basic Fallback (as last resort if Gemini didn't provide a good result)
         // Check if abbreviation is still the original name after potential Gemini attempt
         if (abbreviation === originalName) {
             abbreviation = fallbackAbbreviation(originalName, isConference);
             console.log(`Fallback: Using basic fallback as final attempt: ${abbreviation}`);
         }
    }

    // --- Final Cleanup ---
    // Ensure we don't return 'N/A' if the original name was valid
    if ((!abbreviation || abbreviation === 'N/A') && originalName && originalName !== 'N/A') {
         abbreviation = originalName;
         console.log(`Style '${targetStyle}': Final result reverted to original name: ${abbreviation}`);
    } else if (!abbreviation) {
         abbreviation = 'N/A'; // Absolute fallback
         console.log(`Style '${targetStyle}': Final result is N/A`);
    }


    return { abbreviation, suggestionError };
}


/**
 * Parses BibTeX content into a key-value object.
 * @param {string} bibtexContent - The raw BibTeX string.
 * @returns {object} - Parsed citation info.
 */
function parseBibtex(bibtexContent) {
    const citationInfo = {};
    // Regex to capture key = {value} or key = "value"
    // Handles nested braces reasonably well for typical BibTeX values
    const regex = /(\w+)\s*=\s*(?:\{((?:[^{}]|\{[^{}]*\})*)\}|\"((?:[^\"\\]|\\.)*)\")/g;
    let match;

    while ((match = regex.exec(bibtexContent)) !== null) {
        const key = match[1].toLowerCase().trim();
        // Use value from braces (match[2]) or quotes (match[3])
        // Clean up: remove escaping backslashes, normalize whitespace
        const value = (match[2] !== undefined ? match[2] : match[3])
                      .replace(/\\(['"`\\{}%&~#^])/g, '$1') // Handle common escaped chars
                      .replace(/\{\\relax\s*\}/g, '') // Remove \relax
                      .replace(/\s+/g, ' ') // Normalize whitespace
                      .trim();
        citationInfo[key] = value;
    }

    // Extract entry type and key (e.g., @article{key, ...})
    const entryMatch = bibtexContent.match(/^@(\w+)\s*\{\s*([^,]+)/);
    if (entryMatch) {
        citationInfo._entryType = entryMatch[1].toLowerCase();
        citationInfo._entryKey = entryMatch[2].trim();
    }
    return citationInfo;
}


// --- Citation Fetching and Formatting ---

/**
 * Fetches and parses arXiv BibTeX data.
 * @param {string} url - The arXiv URL.
 * @returns {Promise<object>} - Parsed citation info including 'year'.
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
             // Added User-Agent as good practice
             headers: { 'User-Agent': 'CitationFormatterExtension/1.7', 'Accept': 'application/x-bibtex; charset=utf-8' }
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`Failed to fetch arXiv BibTeX (${response.status}): ${response.statusText}`);

        const bibtexContent = await response.text();
        // Basic check for valid BibTeX start
        if (!bibtexContent || !bibtexContent.trim().startsWith('@')) throw new Error(`Unexpected BibTeX content received`);

        const citationInfo = parseBibtex(bibtexContent);
        citationInfo.url = `https://arxiv.org/abs/${paperId}`; // Add the canonical URL

        // Extract year specifically
        const yearMatch = bibtexContent.match(/year\s*=\s*(?:\{?(\d{4})\}?|\"?(\d{4})\"?)/i);
        citationInfo.year = yearMatch ? (yearMatch[1] || yearMatch[2]) : '';

        return citationInfo;
    } catch (error) {
        if (error.name === 'AbortError') throw new Error("Fetching arXiv data timed out.");
        console.error("Error fetching/parsing arXiv BibTeX:", error);
        throw new Error(`Failed to get arXiv citation: ${error.message}`); // Re-throw specific error
    }
}

/**
 * Formats arXiv citation info into requested modes.
 * Uses a fixed 'arXiv' abbreviation for PPT mode.
 * @param {object} citationInfo - Parsed citation data from BibTeX.
 * @param {string} citationMode - 'full', 'ppt', or 'both'.
 * @returns {object} - Object containing formatted citations { full: '...', ppt: '...' }.
 */
function formatArxivCitation(citationInfo, citationMode) {
    const authorsStr = citationInfo.author || 'N/A';
    const title = citationInfo.title || 'N/A';
    const eprint = citationInfo.eprint || 'N/A';
    const archivePrefix = citationInfo.archiveprefix || 'arXiv';
    const url = citationInfo.url || 'N/A';
    const year = citationInfo.year || '';
    const twoDigitYear = getTwoDigitYear(year); // Use helper

    // Format authors (handle "Last, First" and "First Last")
    const authorList = authorsStr.split(/\s+and\s+/);
    const formattedAuthors = authorList.map(author => {
        const parts = author.split(/,\s*/);
        let lastName = parts[0].trim();
        let givenNames = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
        if (parts.length === 1) { // Assume "First Last"
            const names = author.split(/\s+/);
            lastName = names.pop() || '';
            givenNames = names.join(' ');
        }
        if (!lastName) return author; // Return original if parsing failed
        const initials = givenNames.split(/\s+|-/)
                                  .filter(n => n)
                                  .map(n => n[0].toUpperCase() + '.')
                                  .join(''); // Join with only period, no space
        return `${initials} ${lastName}`; // F.M. Last
    });
    let authors = 'N/A';
    if (formattedAuthors.length > 0) {
        if (formattedAuthors.length === 1) authors = formattedAuthors[0];
        else if (formattedAuthors.length === 2) authors = formattedAuthors.join(' and ');
        else authors = formattedAuthors.slice(0, -1).join(', ') + ', and ' + formattedAuthors[formattedAuthors.length - 1];
    }

    const arxivId = `${archivePrefix}:${eprint}`;

    // --- Generate Full Citation ---
    // NOTE: arXiv doesn't use abbreviations in the same way journals/conferences do.
    const fullCitation = `${authors}, "${title}," ${arxivId}. [Online]. Available: ${url}`;

    // --- Generate PowerPoint Citation ---
    const pptAbbr = 'arXiv'; // Fixed for arXiv
    const pptCitation = twoDigitYear
        ? `${title} (${twoDigitYear}'${pptAbbr})`
        : `${title} (${pptAbbr})`;

    // --- Return based on mode ---
    const result = { full: fullCitation, ppt: pptCitation };
    // Return only requested fields based on citationMode
    if (citationMode === 'full') return { full: fullCitation, ppt: null };
    if (citationMode === 'ppt') return { full: null, ppt: pptCitation };
    return result; // Return both for 'both' mode
}

/**
 * Fetches IEEE metadata using the offscreen document.
 * @param {string} url - The IEEE Xplore URL.
 * @returns {Promise<object>} - The response object from the offscreen script.
 */
async function getIeeeCitation(url) {
    try {
        // Check if offscreen document already exists
        const existingContexts = await chrome.runtime.getContexts({
            contextTypes: ['OFFSCREEN_DOCUMENT'],
            documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)]
        });

        if (existingContexts.length === 0) {
            console.log("Creating new offscreen document for IEEE parsing.");
            await chrome.offscreen.createDocument({
                url: OFFSCREEN_DOCUMENT_PATH,
                reasons: [chrome.offscreen.Reason.DOM_PARSER],
                justification: 'Parse IEEE Xplore metadata'
            });
            // Optional: Short delay to allow the document to initialize
            await new Promise(resolve => setTimeout(resolve, 500));
        } else {
            console.log("Using existing offscreen document for IEEE parsing.");
        }

        console.log("Sending getIeeeMetadata message to offscreen document.");
        // Send message and implement timeout for response
        const response = await Promise.race([
            chrome.runtime.sendMessage({ target: 'offscreen', action: 'getIeeeMetadata', url: url }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Offscreen document communication timed out (20s).')), 20000)) // 20s timeout
        ]);

        if (!response) {
            // This might happen if the offscreen doc closes unexpectedly or fails to respond
            throw new Error("No response received from offscreen document. It might have closed or failed.");
        }
        if (!response.success) {
            // Error reported by the offscreen document itself
            throw new Error(response.error || "Offscreen document reported an unspecified error during metadata extraction.");
        }
        // Success case
        return response; // Contains { success: true, metadata: {...} }

    } catch (error) {
        console.error("Error communicating with/creating offscreen document:", error);
        // Attempt to close the potentially problematic offscreen document to reset state
        closeOffscreenDocument();
        // Re-throw a more informative error
        throw new Error(`Failed to get IEEE citation via offscreen document: ${error.message}`);
    }
}

/**
 * Formats IEEE citation info into requested modes using the selected abbreviation style.
 * @param {object} metadata - Parsed metadata object from IEEE.
 * @param {string} citationMode - 'full', 'ppt', or 'both'.
 * @param {object} settings - The retrieved user settings.
 * @returns {Promise<object>} - Object containing formatted citations { full: '...', ppt: '...', suggestionError: '...' }.
 */
async function formatIeeeCitation(metadata, citationMode, settings) {
    // --- Data Extraction ---
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

    // --- Author Formatting ---
    const formattedAuthors = authorsList.map(author => {
        const name = author?.name ?? '';
        const names = name.split(' ');
        if (names.length < 2) return name; // Handle single names or empty strings
        const lastName = names[names.length - 1];
        const givenNames = names.slice(0, -1);
        // Generate initials, handling hyphens
        const initials = givenNames
            .map(n => n.split('-').map(part => part.length > 0 ? part[0].toUpperCase() + '.' : '').join('-'))
            .join(''); // Join initials directly, e.g., F.M.
        return `${initials} ${lastName}`; // F.M. Last
    });
    let authors = 'N/A';
    if (formattedAuthors.length > 0) {
        if (formattedAuthors.length === 1) authors = formattedAuthors[0];
        else if (formattedAuthors.length === 2) authors = formattedAuthors.join(' and ');
        else authors = formattedAuthors.slice(0, -1).join(', ') + ', and ' + formattedAuthors[formattedAuthors.length - 1];
    }

    // --- Pages/Article Number Formatting ---
    let pagesStr = '';
    if (startPage && endPage && startPage !== endPage) pagesStr = `pp. ${startPage}-${endPage}`;
    else if (startPage) pagesStr = `p. ${startPage}`;
    else if (articleNumber) pagesStr = `Art. no. ${articleNumber}`;

    // --- Date Formatting ---
    let formattedDate = ''; let twoDigitYear = '';
    if (pubDateStr) {
        try {
            // Normalize separators and attempt parsing
            const normalizedDateStr = pubDateStr.replace(/-\s*/g, ' ').replace(/\.\s*/g, ' ');
            const dateObj = new Date(normalizedDateStr);

            if (!isNaN(dateObj.getTime())) { // Check if parsing was successful
                const year = dateObj.getFullYear();
                twoDigitYear = year.toString().slice(-2); // Always get YY

                // Determine full date format (Mon. Year or just Year)
                if (normalizedDateStr.trim().length === 4 && /^\d{4}$/.test(normalizedDateStr.trim())) {
                    formattedDate = year.toString(); // Only year provided
                } else {
                    const monthIndex = dateObj.getMonth(); // 0-indexed month
                    if (monthIndex >= 0 && monthIndex <= 11) {
                        const month = dateObj.toLocaleString('en-US', { month: 'short' }); // Get 'Jan', 'Feb', etc.
                        formattedDate = `${month}. ${year}`;
                    } else {
                        // Fallback if month parsing seems off, but year is valid
                        formattedDate = year.toString();
                        console.warn("Parsed invalid month, using year only for:", pubDateStr);
                    }
                }
            } else {
                // If Date parsing failed, try regex for YYYY
                const yearMatch = pubDateStr.match(/\b(\d{4})\b/);
                if (yearMatch) {
                    formattedDate = yearMatch[1];
                    twoDigitYear = yearMatch[1].slice(-2);
                } else {
                    console.warn("Could not reliably parse date:", pubDateStr);
                    // Keep formattedDate and twoDigitYear empty
                }
            }
        } catch (e) {
            console.warn("Error parsing date:", pubDateStr, e);
            // Keep formattedDate and twoDigitYear empty on error
        }
    }

    // --- Get Abbreviations ---
    const { abbreviation: fullModeAbbr, suggestionError } = await getAbbreviationForStyle(originalPubName, isConference, settings.fullModeAbbrStyle, settings);
    const { abbreviation: pptModeAbbr } = await getAbbreviationForStyle(originalPubName, isConference, settings.pptModeAbbrStyle, settings);

    // --- Construct Full Citation String (IEEE Style) ---
    let fullCitation = `${authors}, "${title}," `;
    // Add abbreviation
    if (isConference) {
        // For conferences, 'in' prefix is common
        fullCitation += (/proc\.|proceedings|conf\.|conference|symp\.|symposium|wkshps\.|workshops/i.test(fullModeAbbr))
            ? `in ${fullModeAbbr}` : `${fullModeAbbr}`;
    } else {
        // For journals, just add the abbreviation
        fullCitation += `${fullModeAbbr}`;
        // ** CORRECTED CONDITIONAL PERIOD LOGIC **
        // Add period if the abbreviation contains a space OR a period,
        // AND it doesn't already end with a period.
        if ((fullModeAbbr.includes(' ') || fullModeAbbr.includes('.')) && !/\.$/.test(fullModeAbbr.trim())) {
             fullCitation += '.';
        }
    }

    // Add remaining parts
    if (volume) fullCitation += `, vol. ${volume}`;
    if (issue) fullCitation += `, no. ${issue}`;
    if (pagesStr) fullCitation += `, ${pagesStr}`;
    if (formattedDate) fullCitation += `, ${formattedDate}`;
    fullCitation += '.'; // Final period
    fullCitation += suggestionError; // Append suggestion error if any

    // Cleanup
    fullCitation = fullCitation.replace(/,?\s*N\/A,?/g, '') // Remove N/A placeholders
                               .replace(/vol\.\s*,/g, 'vol.') // Fix space after vol. if comma removed
                               .replace(/no\.\s*,/g, 'no.')   // Fix space after no. if comma removed
                               .replace(/Art\. no\.\s*,/g, 'Art. no.') // Fix space after Art. no.
                               .replace(/,\s*,/g, ',')      // Remove double commas
                               .replace(/\s+,/g, ',')       // Remove space before comma
                               .replace(/,\s*\./g, '.')     // Remove comma before period
                               .replace(/\s{2,}/g, ' ')     // Collapse multiple spaces
                               .replace(/\.\.+/g, '.')      // Collapse multiple periods (e.g., from abbr + added period)
                               .trim();


    // --- Construct PowerPoint Citation String ---
    const pptCitation = twoDigitYear ? `${title} (${twoDigitYear}'${pptModeAbbr})` : `${title} (${pptModeAbbr})`;


    // --- Return based on requested display mode ---
    const result = { full: fullCitation, ppt: pptCitation, suggestionError: suggestionError };
    if (citationMode === 'full') return { full: fullCitation, ppt: null, suggestionError: suggestionError };
    if (citationMode === 'ppt') return { full: null, ppt: pptCitation, suggestionError: suggestionError }; // Suggestion error might be empty here
    return result; // Return both for 'both' mode
}


// --- MDPI Specific Functions ---

/**
 * Fetches MDPI metadata using the offscreen document.
 * @param {string} url - The MDPI article URL.
 * @returns {Promise<object>} - The response object from the offscreen script containing metadata.
 */
async function getMdpiCitation(url) {
    console.log("Requesting MDPI metadata fetching via offscreen for:", url);
     try {
        // Ensure offscreen document exists (similar to getIeeeCitation)
        const existingContexts = await chrome.runtime.getContexts({
            contextTypes: ['OFFSCREEN_DOCUMENT'],
            documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)]
        });
        if (existingContexts.length === 0) {
            console.log("Creating new offscreen document for MDPI parsing.");
            await chrome.offscreen.createDocument({
                url: OFFSCREEN_DOCUMENT_PATH,
                // Add DOM_SCRAPING if not already covered by DOM_PARSER, though parser should be sufficient
                reasons: [chrome.offscreen.Reason.DOM_PARSER],
                justification: 'Parse MDPI page metadata'
            });
            await new Promise(resolve => setTimeout(resolve, 500)); // Allow init time
        } else {
             console.log("Using existing offscreen document for MDPI parsing.");
        }

        console.log("Sending getMdpiMetadata message to offscreen document.");
        // Send message and implement timeout
        const response = await Promise.race([
            chrome.runtime.sendMessage({ target: 'offscreen', action: 'getMdpiMetadata', url: url }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Offscreen document communication timed out (20s) for MDPI.')), 20000))
        ]);

        if (!response) {
            throw new Error("No response received from offscreen document for MDPI metadata.");
        }
        if (!response.success) {
            throw new Error(response.error || "Offscreen document reported an unspecified error during MDPI metadata extraction.");
        }
        // Success case
        console.log("Received MDPI metadata from offscreen:", response.metadata);
        return response.metadata; // Return only the metadata object

    } catch (error) {
        console.error("Error communicating with/creating offscreen document for MDPI:", error);
        closeOffscreenDocument(); // Attempt to close potentially problematic doc
        throw new Error(`Failed to get MDPI citation via offscreen document: ${error.message}`);
    }
}

/**
 * Formats MDPI citation info into requested modes, aiming for IEEE journal style.
 * @param {object} metadata - Parsed metadata from MDPI page.
 * @param {string} citationMode - 'full', 'ppt', or 'both'.
 * @param {object} settings - The retrieved user settings.
 * @returns {Promise<object>} - Object containing formatted citations { full: '...', ppt: '...', suggestionError: '...' }.
 */
async function formatMdpiCitation(metadata, citationMode, settings) {
    // --- Data Extraction ---
    const authorsList = Array.isArray(metadata.authors) ? metadata.authors : [metadata.authors];
    const title = metadata.title || 'N/A';
    const originalJournalTitle = metadata.journalTitle || 'N/A';
    const volume = metadata.volume || '';
    const articleNumber = metadata.firstpage || ''; // MDPI often uses this
    const doi = metadata.doi || ''; // Keep DOI for potential future use, but omit from string
    const pubDateStr = metadata.publicationDate || ''; // Format YYYY/MM/DD

    // --- Author Formatting (IEEE Style: F. M. Last) ---
    const formattedAuthors = authorsList.map(author => {
        if (!author || typeof author !== 'string') return '';
        // Handle "Last, First M." or "Last, First" from MDPI meta
        const parts = author.split(/,\s*/);
        const lastName = parts[0].trim();
        let givenNames = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
        if (!lastName) return author; // Return original if parsing failed badly

        // Create initials like F. M. (with spaces if multiple initials)
        const initials = givenNames.split(/\s+|-/)
                                  .filter(n => n)
                                  .map(n => n[0].toUpperCase() + '.')
                                  .join(' '); // Join initials with space
        return `${initials} ${lastName}`; // Format as F. M. Last
    }).filter(Boolean); // Remove any empty strings from failed parsing

    let authors = 'N/A';
    if (formattedAuthors.length > 0) {
        if (formattedAuthors.length === 1) authors = formattedAuthors[0];
        else if (formattedAuthors.length === 2) authors = formattedAuthors.join(' and ');
        else authors = formattedAuthors.slice(0, -1).join(', ') + ', and ' + formattedAuthors[formattedAuthors.length - 1];
    }

    // --- Date Formatting (Try for Mon. Year) ---
    let formattedDate = ''; let twoDigitYear = '';
    if (pubDateStr) {
        try {
            // MDPI uses YYYY/MM/DD - directly parse this
            const dateParts = pubDateStr.split('/');
            if (dateParts.length === 3 && /^\d{4}$/.test(dateParts[0]) && /^\d{1,2}$/.test(dateParts[1])) {
                const year = dateParts[0];
                const monthIndex = parseInt(dateParts[1], 10) - 1; // 0-indexed
                twoDigitYear = year.slice(-2);

                if (monthIndex >= 0 && monthIndex <= 11) {
                    const tempDate = new Date(year, monthIndex); // Create date to get month name
                    const month = tempDate.toLocaleString('en-US', { month: 'short' });
                    formattedDate = `${month}. ${year}`;
                } else {
                    formattedDate = year; // Fallback to year if month is invalid
                }
            } else { // Fallback if format is unexpected
                const yearMatch = pubDateStr.match(/\b(\d{4})\b/);
                if (yearMatch) {
                    formattedDate = yearMatch[1];
                    twoDigitYear = yearMatch[1].slice(-2);
                }
            }
        } catch (e) { console.warn("Error parsing MDPI date:", pubDateStr, e); }
    }
    if (!formattedDate) { // Ensure year is set if parsing failed but regex worked
       const yearMatch = pubDateStr.match(/\b(\d{4})\b/);
       if (yearMatch) formattedDate = yearMatch[1];
    }
    if (!twoDigitYear) { // Ensure twoDigitYear is set if possible
        const yearMatch = pubDateStr.match(/\b(\d{4})\b/);
        if (yearMatch) twoDigitYear = yearMatch[1].slice(-2);
    }


    // --- Get Abbreviations ---
    const { abbreviation: fullModeAbbr, suggestionError } = await getAbbreviationForStyle(
        originalJournalTitle, false, settings.fullModeAbbrStyle, settings // isConference = false
    );
    const { abbreviation: pptModeAbbr } = await getAbbreviationForStyle(
        originalJournalTitle, false, settings.pptModeAbbrStyle, settings // isConference = false
    );

    // --- Construct Full Citation String (IEEE Journal Style) ---
    // Format: Authors, "Title," JournalAbbr., vol. Volume, Art. no. ArticleNumber, Date.
    let fullCitation = `${authors}, "${title}," ${fullModeAbbr}`; // Use abbreviation determined by fullModeAbbrStyle

    // ** CORRECTED CONDITIONAL PERIOD LOGIC **
    // Add period only if it contains a space OR a period,
    // AND it doesn't already end with a period.
    if ((fullModeAbbr.includes(' ') || fullModeAbbr.includes('.')) && !/\.$/.test(fullModeAbbr.trim())) {
         fullCitation += '.';
    }


    if (volume) fullCitation += `, vol. ${volume}`;
    // Use Art. no. for MDPI's 'firstpage' field
    if (articleNumber) fullCitation += `, Art. no. ${articleNumber}`;
    if (formattedDate) fullCitation += `, ${formattedDate}`;
    fullCitation += '.'; // End with period

    fullCitation += suggestionError; // Append suggestion error if any
    // Cleanup
    fullCitation = fullCitation.replace(/,?\s*N\/A,?/g, '')
                               .replace(/vol\.\s*,/g, 'vol.')
                               .replace(/no\.\s*,/g, 'no.') // Keep just in case 'issue' is ever present
                               .replace(/Art\. no\.\s*,/g, 'Art. no.')
                               .replace(/,\s*,/g, ',')
                               .replace(/\s+,/g, ',')
                               .replace(/,\s*\./g, '.')
                               .replace(/\s{2,}/g, ' ')
                               .replace(/\.\.+/g, '.') // Collapse multiple periods
                               .trim();


    // --- Construct PowerPoint Citation String ---
    const pptCitation = twoDigitYear
        ? `${title} (${twoDigitYear}'${pptModeAbbr})`
        : `${title} (${pptModeAbbr})`;


    // --- Return based on requested display mode ---
    const result = { full: fullCitation, ppt: pptCitation, suggestionError: suggestionError };
    if (citationMode === 'full') return { full: fullCitation, ppt: null, suggestionError: suggestionError };
    if (citationMode === 'ppt') return { full: null, ppt: pptCitation, suggestionError: suggestionError };
    return result;
}


// --- Background Script Event Listener ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // This listener remains unchanged from v8
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
                const isMdpi = url.includes('mdpi.com/');
                const isIeee = url.includes('ieeexplore.ieee.org/document/');
                const isArxiv = url.includes('arxiv.org/abs/') || url.includes('arxiv.org/pdf/');

                if (isArxiv) {
                    const citationInfo = await getArxivCitation(url);
                    citationResult = formatArxivCitation(citationInfo, citationMode);
                } else if (isIeee) {
                    const ieeeResponse = await getIeeeCitation(url);
                    citationResult = await formatIeeeCitation(ieeeResponse.metadata, citationMode, settings);
                } else if (isMdpi) {
                    const mdpiMetadata = await getMdpiCitation(url); // Uses offscreen
                    citationResult = await formatMdpiCitation(mdpiMetadata, citationMode, settings);
                }
                 else {
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
    // This function remains unchanged from v5
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
    // This function remains unchanged from v5
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
             if (items.abbreviationStyle !== undefined) {
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
    // This function remains unchanged from v5
    console.log("Extension started up via browser startup.");
    closeOffscreenDocument();
});

console.log("Background service worker started/awoken.");
