// --- Constants and Configuration ---
const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';
const urlParserApi = (() => {
    if (typeof module !== 'undefined' && module.exports) {
        return require('./src/url/parseSupportedUrl');
    }

    const namespace = globalThis.CitationFormatterUrl || (globalThis.CitationFormatterUrl = {});
    if (typeof importScripts === 'function' && !namespace.parseSupportedUrl) {
        importScripts('src/url/parseSupportedUrl.js');
    }

    return namespace;
})();
const ieeeMetadataParserApi = (() => {
    if (typeof module !== 'undefined' && module.exports) {
        return require('./src/ieee/metadataParser');
    }

    const namespace = globalThis.CitationFormatterIeee || (globalThis.CitationFormatterIeee = {});
    if (typeof importScripts === 'function' && !namespace.metadataParser) {
        importScripts('src/ieee/metadataParser.js');
    }

    return namespace.metadataParser;
})();
const abbreviationResolverApi = (() => {
    if (typeof module !== 'undefined' && module.exports) {
        return require('./src/abbreviations/resolver');
    }

    const namespace = globalThis.CitationFormatterAbbreviations || (globalThis.CitationFormatterAbbreviations = {});
    if (typeof importScripts === 'function' && !namespace.resolver) {
        importScripts(
            'src/abbreviations/normalizeTitle.js',
            'src/abbreviations/sources/customSource.js',
            'src/abbreviations/sources/metadataSource.js',
            'src/abbreviations/sources/geminiSource.js',
            'src/abbreviations/journalRules.js',
            'src/abbreviations/conferenceResolver.js',
            'src/abbreviations/resolver.js'
        );
    }

    return namespace.resolver;
})();
const { parseSupportedUrl } = urlParserApi;
const { normalizeIeeeActiveTabMetadata } = ieeeMetadataParserApi;
const { resolvePublicationAbbreviation } = abbreviationResolverApi;

// --- Abbreviation Dictionaries ---
const standardJournalAbbreviations = {
    // Communications & Networking (unchanged)
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
    // Signal Processing (unchanged)
    'Transactions on Signal Processing': 'IEEE Trans. Signal Process.',
    'Signal Processing Letters': 'IEEE Signal Process. Lett.',
    'Journal of Selected Topics in Signal Processing': 'IEEE J. Sel. Topics Signal Process.',
    'Transactions on Image Processing': 'IEEE Trans. Image Process.',
    'Transactions on Audio, Speech, and Language Processing': 'IEEE/ACM Trans. Audio, Speech, Lang. Process.',
    // Computer Science & Engineering (unchanged)
    'Transactions on Computers': 'IEEE Trans. Comput.',
    'Transactions on Parallel and Distributed Systems': 'IEEE Trans. Parallel Distrib. Syst.',
    'Transactions on Software Engineering': 'IEEE Trans. Softw. Eng.',
    'Transactions on Knowledge and Data Engineering': 'IEEE Trans. Knowl. Data Eng.',
    'Transactions on Dependable and Secure Computing': 'IEEE Trans. Dependable Secure Comput.',
    'Computer': 'IEEE Comput.',
    // Circuits & Systems (unchanged)
    'Transactions on Circuits and Systems I: Regular Papers': 'IEEE Trans. Circuits Syst. I, Reg. Papers',
    'Transactions on Circuits and Systems II: Express Briefs': 'IEEE Trans. Circuits Syst. II, Exp. Briefs',
    'Transactions on Very Large Scale Integration (VLSI) Systems': 'IEEE Trans. Very Large Scale Integr. (VLSI) Syst.',
    'Journal on Emerging and Selected Topics in Circuits and Systems': 'IEEE J. Emerg. Sel. Topics Circuits Syst.',
    // Machine Learning / AI / Pattern Analysis (unchanged)
    'Transactions on Pattern Analysis and Machine Intelligence': 'IEEE Trans. Pattern Anal. Mach. Intell.',
    'Transactions on Neural Networks and Learning Systems': 'IEEE Trans. Neural Netw. Learn. Syst.',
    'Transactions on Fuzzy Systems': 'IEEE Trans. Fuzzy Syst.',
    'Transactions on Evolutionary Computation': 'IEEE Trans. Evol. Comput.',
    'Transactions on Artificial Intelligence': 'IEEE Trans. Artif. Intell.',
    // Other Engineering Areas (unchanged)
    'Transactions on Automatic Control': 'IEEE Trans. Autom. Control',
    'Transactions on Robotics': 'IEEE Trans. Robot.',
    'Transactions on Power Systems': 'IEEE Trans. Power Syst.',
    'Transactions on Power Electronics': 'IEEE Trans. Power Electron.',
    'Transactions on Industrial Electronics': 'IEEE Trans. Ind. Electron.',
    'Proceedings of the IEEE': 'Proc. IEEE',
    // MDPI Journals (unchanged)
    'Sensors': 'Sensors', 'Remote Sensing': 'Remote Sens.', 'Energies': 'Energies', 'Materials': 'Materials',
    'International Journal of Molecular Sciences': 'Int. J. Mol. Sci.', 'Molecules': 'Molecules',
    'Applied Sciences': 'Appl. Sci.', 'Sustainability': 'Sustainability', 'Electronics': 'Electronics',
    'Viruses': 'Viruses', 'Water': 'Water', 'Nutrients': 'Nutrients', 'Cancers': 'Cancers',
    'Polymers': 'Polymers', 'Journal of Clinical Medicine': 'J. Clin. Med.',
};
const standardConferenceAbbreviations = {
    // Communications & Networking (unchanged)
    'Global Communications Conference': 'IEEE GLOBECOM', 'Globecom Workshops': 'IEEE GC Wkshps',
    'International Conference on Communications': 'IEEE ICC', 'Conference on Computer Communications': 'IEEE INFOCOM',
    'Wireless Communications and Networking Conference': 'IEEE WCNC', 'Vehicular Technology Conference': 'IEEE VTC',
    'International Symposium on Personal, Indoor and Mobile Radio Communications': 'IEEE PIMRC',
    'International Conference on Wireless and Mobile Computing, Networking and Communications': 'IEEE WiMob',
    'Consumer Communications and Networking Conference': 'IEEE CCNC', 'Symposium on Computers and Communications': 'IEEE ISCC',
    'International Conference on Mobile Ad Hoc and Smart Systems': 'IEEE MASS',
    'International Symposium on a World of Wireless, Mobile and Multimedia Networks': 'IEEE WoWMoM',
    'International Conference on Communications in China (ICCC Workshops)': 'IEEE ICCC Wkshps',
    'Networking Conference': 'IEEE NetConf', 'Network Operations and Management Symposium': 'IEEE NOMS',
    // Signal Processing (unchanged)
    'International Conference on Acoustics, Speech and Signal Processing': 'IEEE ICASSP',
    'International Conference on Image Processing': 'IEEE ICIP',
    'Global Conference on Signal and Information Processing': 'IEEE GlobalSIP',
    'Workshop on Signal Processing Systems': 'IEEE SiPS',
    // Computer Science & Engineering (unchanged)
    'International Conference on Distributed Computing Systems': 'IEEE ICDCS',
    'Symposium on Security and Privacy': 'IEEE S&P', 'Computer Vision and Pattern Recognition': 'IEEE/CVF CVPR',
    'International Conference on Computer Vision': 'IEEE/CVF ICCV', 'International Conference on Data Engineering': 'IEEE ICDE',
    'Symposium on High-Performance Computer Architecture': 'IEEE HPCA', 'Real-Time Systems Symposium': 'IEEE RTSS',
    // Circuits & Systems (unchanged)
    'International Solid - State Circuits Conference': 'IEEE ISSCC',
    'Custom Integrated Circuits Conference': 'IEEE CICC',
    'International Symposium on Circuits and Systems': 'IEEE ISCAS', 'Design Automation Conference': 'ACM/IEEE DAC',
    // Machine Learning / AI (unchanged)
    'Conference on Neural Information Processing Systems': 'NeurIPS', 'International Conference on Machine Learning': 'ICML',
    'AAAI Conference on Artificial Intelligence': 'AAAI',
    // Robotics & Control (unchanged)
    'International Conference on Robotics and Automation': 'IEEE ICRA',
    'International Conference on Intelligent Robots and Systems': 'IEEE/RSJ IROS',
    'Conference on Decision and Control': 'IEEE CDC',
};

const shortAbbreviations = {
    // Communications & Networking (unchanged)
    'IEEE J. Sel. Areas Commun.': 'JSAC', 'IEEE Trans. Commun.': 'TCOM', 'IEEE Trans. Mobile Comput.': 'TMC',
    'IEEE Trans. Veh. Technol.': 'TVT', 'IEEE Commun. Lett.': 'CL', 'IEEE Wireless Commun. Lett.': 'WCL',
    'IEEE Commun. Mag.': 'COMMAG', 'IEEE Wireless Commun.': 'WCM', 'IEEE Commun. Surv. Tutor.': 'COMST',
    'IEEE Trans. Wirel. Commun.': 'TWC', 'IEEE Netw.': 'NETWORK', 'IEEE/ACM Trans. Netw.': 'TON',
    'IEEE Internet Things J.': 'IOT-J', 'IEEE GLOBECOM': 'GLOBECOM', 'IEEE GC Wkshps': 'GC Wkshps',
    'IEEE ICC': 'ICC', 'IEEE INFOCOM': 'INFOCOM', 'IEEE WCNC': 'WCNC', 'IEEE VTC': 'VTC',
    'IEEE PIMRC': 'PIMRC', 'IEEE WiMob': 'WiMob', 'IEEE CCNC': 'CCNC', 'IEEE ISCC': 'ISCC',
    'IEEE MASS': 'MASS', 'IEEE WoWMoM': 'WoWMoM', 'IEEE ICCC Wkshps': 'ICCC Wkshps',
    'IEEE NetConf': 'NetConf', 'IEEE NOMS': 'NOMS',
    // Signal Processing (unchanged)
    'IEEE Trans. Signal Process.': 'TSP', 'IEEE Signal Process. Lett.': 'SPL',
    'IEEE J. Sel. Topics Signal Process.': 'JSTSP', 'IEEE Trans. Image Process.': 'TIP',
    'IEEE/ACM Trans. Audio, Speech, Lang. Process.': 'TASLP', 'IEEE ICASSP': 'ICASSP',
    'IEEE ICIP': 'ICIP', 'IEEE GlobalSIP': 'GlobalSIP', 'IEEE SiPS': 'SiPS',
    // Computer Science & Engineering (unchanged)
    'IEEE Trans. Comput.': 'TC', 'IEEE Trans. Parallel Distrib. Syst.': 'TPDS',
    'IEEE Trans. Softw. Eng.': 'TSE', 'IEEE Trans. Knowl. Data Eng.': 'TKDE',
    'IEEE Trans. Dependable Secure Comput.': 'TDSC', 'IEEE Comput.': 'Computer',
    'IEEE ICDCS': 'ICDCS', 'IEEE S&P': 'S&P', 'IEEE/CVF CVPR': 'CVPR', 'IEEE/CVF ICCV': 'ICCV',
    'IEEE ICDE': 'ICDE', 'IEEE HPCA': 'HPCA', 'IEEE RTSS': 'RTSS',
    // Circuits & Systems (unchanged)
    'IEEE Trans. Circuits Syst. I, Reg. Papers': 'TCAS-I',
    'IEEE Trans. Circuits Syst. II, Exp. Briefs': 'TCAS-II',
    'IEEE Trans. Very Large Scale Integr. (VLSI) Syst.': 'TVLSI',
    'IEEE J. Emerg. Sel. Topics Circuits Syst.': 'JETCAS', 'IEEE ISSCC': 'ISSCC',
    'IEEE CICC': 'CICC', 'IEEE ISCAS': 'ISCAS', 'ACM/IEEE DAC': 'DAC',
    // Machine Learning / AI / Pattern Analysis (unchanged)
    'IEEE Trans. Pattern Anal. Mach. Intell.': 'TPAMI',
    'IEEE Trans. Neural Netw. Learn. Syst.': 'TNNLS', 'IEEE Trans. Fuzzy Syst.': 'TFS',
    'IEEE Trans. Evol. Comput.': 'TEC', 'IEEE Trans. Artif. Intell.': 'TAI',
    'NeurIPS': 'NeurIPS', 'ICML': 'ICML', 'AAAI': 'AAAI',
    // Other Engineering Areas (unchanged)
    'IEEE Trans. Autom. Control': 'TAC', 'IEEE Trans. Robot.': 'T-RO',
    'IEEE Trans. Power Syst.': 'TPWRS', 'IEEE Trans. Power Electron.': 'TPEL',
    'IEEE Trans. Ind. Electron.': 'TIE', 'Proc. IEEE': 'Proc. IEEE', 'IEEE ICRA': 'ICRA',
    'IEEE/RSJ IROS': 'IROS', 'IEEE CDC': 'CDC',
    // MDPI Short Names (unchanged)
    'Sensors': 'Sensors', 'Remote Sens.': 'RS', 'Energies': 'Energies', 'Materials': 'Materials',
    'Int. J. Mol. Sci.': 'IJMS', 'Molecules': 'Molecules', 'Appl. Sci.': 'Appl. Sci.',
    'Sustainability': 'Sustainability', 'Electronics': 'Electronics', 'Viruses': 'Viruses',
    'Water': 'Water', 'Nutrients': 'Nutrients', 'Cancers': 'Cancers', 'Polymers': 'Polymers',
    'J. Clin. Med.': 'JCM',
};


// --- Helper Functions ---
async function getSettings(defaults = {}) {
    try {
        const defaultValues = {
            geminiApiKey: null,
            useGemini: false,
            autoCopy: true,
            // citationMode: 'full', // REMOVED
            citationStyles: ['standard_abbr'], // CHANGED: Array, matches options.js default
            customAbbreviations: {},
            ...defaults
        };
        const items = await chrome.storage.sync.get(defaultValues);
        if (chrome.runtime.lastError) {
            console.error("Error retrieving settings:", chrome.runtime.lastError);
            return defaultValues;
        }
        if (typeof items.customAbbreviations !== 'object' || items.customAbbreviations === null) {
            items.customAbbreviations = {};
        }
        // Ensure citationStyles is an array
        if (!Array.isArray(items.citationStyles) || items.citationStyles.length === 0) {
            items.citationStyles = defaultValues.citationStyles;
        }
        return items;
    } catch (error) {
        console.error("Exception retrieving settings:", error);
        const fallbackDefaults = { // Define explicit fallback for catch block
            geminiApiKey: null, useGemini: false, autoCopy: true,
            citationStyles: ['standard_abbr'], customAbbreviations: {}, ...defaults
        };
        return fallbackDefaults;
    }
}

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
    } catch (e) { /* Ignore parsing errors */ }
    return '';
}

function formatMonthYear(monthIndex, year) {
    const monthAbbreviations = [
        'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
        'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
    ];

    if (monthIndex < 0 || monthIndex > 11) {
        return String(year);
    }

    return `${monthAbbreviations[monthIndex]} ${year}`;
}

async function suggestAbbreviationViaGemini(name, isConference, apiKey, useGemini) {
    // (This function remains largely the same as in the original file provided by the user)
    // Ensure it correctly uses apiKey and useGemini passed as arguments.
    if (!useGemini) {
        console.log("Gemini usage disabled by setting. Using fallback.");
        return fallbackAbbreviation(name, isConference);
    }
    if (!apiKey) {
        console.warn("Gemini enabled but API key is missing.");
        throw new Error("Gemini enabled, but API key is missing. Please set it in options.");
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Suggest a standard abbreviation (like IEEE style or ISO 4) for the following ${isConference ? 'conference' : 'journal'}: "${name}". Return only the abbreviation text itself, nothing else.`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

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
        const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (suggestion) {
            console.log(`Gemini Suggested Abbreviation for '${name}': ${suggestion}`);
            return suggestion.replace(/^\"|\"$/g, '').replace(/\.$/, '');
        } else {
            console.warn("Gemini response format unexpected or empty. Using fallback.");
            console.log("Gemini Raw Response:", JSON.stringify(data));
            return fallbackAbbreviation(name, isConference);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Gemini API call timed out.");
            throw new Error("Gemini API call timed out.");
        }
        console.error(`Gemini API call failed: ${error.message}`);
        if (error.message.includes('Gemini API key') || error.message.includes('timed out') || error.message.includes('forbidden') || error.message.includes('Gemini API request failed')) {
            throw error;
        }
        console.warn("Returning fallback due to unhandled Gemini error.");
        return fallbackAbbreviation(name, isConference);
    }
}

// In background.js
function fallbackAbbreviation(name, isConference) {
    if (!name || typeof name !== 'string') return 'N/A';
    const words = name.split(/\s+/);
    const skipWords = new Set([
        "ieee", "acm", "mdpi", "on", "and", "in", "of", "the", "for", "&", "an", "a", "with", "using",
        "computers", "communications", "networking", "mobile", "computing", "systems", "technology",
        "wireless", "vehicular", "selected", "areas", "transactions", "journal", "letters", "magazine",
        "conference", "symposium", "workshops", "proceedings", "international", "global", "society",
        "technical", "annual", "first", "second", "third", "fourth", "fifth", "sixth", "seventh",
        "eighth", "ninth", "tenth", "annual", "ieee/acm", "acm/ieee"
    ]);

    let significantWords = words.filter(w =>
        w && w.length > 1 && // 至少兩個字符
        /^[A-Za-z0-9]/.test(w) && // 以字母或數字開頭
        !skipWords.has(w.toLowerCase()) &&
        !/^\d+$/.test(w) // 不是純數字 (避免年份、届数被當作重要詞)
    );

    // 如果原始名稱中有括號，且括號內是典型的縮寫（全大寫或含數字）
    const parentheticalMatch = name.match(/\(([^)]+)\)/);
    if (parentheticalMatch && parentheticalMatch[1]) {
        const potentialAcronym = parentheticalMatch[1].trim();
        if (/^[A-Z0-9-]+$/.test(potentialAcronym) && potentialAcronym.length > 1 && potentialAcronym.length < 15) { // 典型的縮寫模式
            // 如果括號內的看起來是主要縮寫，且 significantWords 為空或不包含它
            if (significantWords.length === 0 || !significantWords.join(' ').includes(potentialAcronym)) {
                // 嘗試將括號內容與原始名稱中其他部分比較，如果它是核心，則使用它
                const nameWithoutParenthesis = name.replace(/\s*\([^)]+\)\s*/, '').trim();
                if (nameWithoutParenthesis.length < potentialAcronym.length * 2 && significantWords.length < 2) { // 粗略判斷括號內容更重要
                    significantWords = [potentialAcronym];
                }
            }
        }
    }


    if (significantWords.length === 0) { // 如果過濾後沒有詞，退回原始名稱
        return name;
    }

    let abbr;
    if (isConference) {
        // 對於會議，如果重要詞少於4個，直接拼接；否則取首字母（但這條規則可能導致 AS Conf.）
        // 更好的策略是，如果括號內有縮寫就用，否則用清理後的重要詞
        if (parentheticalMatch && parentheticalMatch[1] && /^[A-Z0-9-]+$/.test(parentheticalMatch[1]) && parentheticalMatch[1].length > 2) {
            abbr = parentheticalMatch[1]; // 例如 MASS, VTC2024-Spring
        } else if (significantWords.length <= 3 && significantWords.length > 0) {
            abbr = significantWords.join(' ');
        } else if (significantWords.length > 0) { // 如果詞太多，嘗試首字母縮寫（但這要小心）
            const firstLetters = significantWords.map(w => w[0].toUpperCase()).join('');
            if (firstLetters.length > 1 && firstLetters.length < 7) { // 避免過短或過長的無意義縮寫
                abbr = firstLetters;
            } else { // 首字母縮寫效果不好，還是拼接前幾個重要詞
                abbr = significantWords.slice(0, 3).join(' ');
            }
        } else {
            abbr = name; // 極端情況
        }
    } else { // Journal logic
        abbr = significantWords.map(w => {
            if (w.toLowerCase() === 'transactions') return 'Trans.';
            if (w.toLowerCase() === 'journal') return 'J.';
            if (w.toLowerCase() === 'letters') return 'Lett.';
            if (w.toLowerCase() === 'magazine') return 'Mag.';
            if (w.toLowerCase() === 'proceedings') return 'Proc.'; // 雖然 fallback 不加 Proc.，但如果詞本身是 Proc.
            if (w.toLowerCase() === 'international') return 'Int.';
            if (w.toLowerCase() === 'systems') return 'Syst.';
            if (w.toLowerCase() === 'circuits') return 'Circ.';
            if (w.toLowerCase() === 'communications') return 'Commun.';
            if (w.toLowerCase() === 'computer' || w.toLowerCase() === 'computers') return 'Comput.';
            if (w.toLowerCase() === 'sciences') return 'Sci.';
            if (w.toLowerCase() === 'applied') return 'Appl.';
            if (w.toLowerCase() === 'sensing') return 'Sens.';
            if (w.toLowerCase() === 'technology') return 'Technol.';
            if (w.toLowerCase() === 'engineering') return 'Eng.';
            // 可以根據需要添加更多映射
            return w;
        }).join(' ');
    }

    abbr = abbr.replace(/\s+/g, ' ').trim();
    // 避免返回無效的純 "IEEE" 或空的縮寫
    if (!abbr || abbr.toUpperCase() === "IEEE" || abbr.toUpperCase() === "ACM") {
        return name; // 返回原始名稱比返回無效縮寫好
    }
    console.log(`Fallback Abbreviation for '${name}': ${abbr}`);
    return abbr;
}

/**
 * Cleans a conference name by removing years, session numbers,
 * and ensures "Proceedings of " prefix, handling "IEEE" correctly.
 * @param {string} confNameFromAbbrStyle - The conference name obtained from getAbbreviationByInternalStyle.
 * @param {string} originalFullName - The original full publication title from metadata.
 * @param {string} currentStyleKey - The active citation style key (e.g., 'no_abbr', 'standard_abbr').
 * @returns {string} The fully formatted conference string, e.g., "in Proceedings of IEEE VTC".
 */
function normalizeAndPrefixConferenceName(confNameFromAbbrStyle, originalFullName, currentStyleKey) {
    let nameToProcess = confNameFromAbbrStyle;

    // 如果是 "No abbreviation" 模式，基礎名稱是原始全名，但也需要清理
    if (currentStyleKey === 'no_abbr') {
        nameToProcess = originalFullName;
    }

    // 1. 移除年份 (例如 "2024", ", 2024", "YYYY - YYYY")
    // \b 表示單詞邊界，確保只匹配完整的年份數字
    nameToProcess = nameToProcess.replace(/\s*,\s*\b\d{4}\b/g, ''); // 移除 ", YYYY"
    nameToProcess = nameToProcess.replace(/\b\d{4}\b\s*-\s*\b\d{4}\b/g, ''); // 移除 "YYYY - YYYY"
    // 移除開頭或結尾的年份，或後跟大寫字母的年份（如 "2024 IEEE..."）
    nameToProcess = nameToProcess.replace(/(^|\s)\b\d{4}\b(\s|,|$|(?=[A-Z]))/g, '$1').trim();
    // 移除括號中的年份，例如 (VTC2024-Spring) 中的 2024 (如果需要更精確，這條規則可能要小心)
    // 暫時先不移除括號內的年份，因為 (VTC2024-Spring) 本身可能就是一個有意義的縮寫部分

    // 2. 移除届数 (例如 "99th", "1st")
    nameToProcess = nameToProcess.replace(/\b\d{1,3}(st|nd|rd|th)\b\s*/gi, '');

    // 3. 清理由於移除年份或届数可能導致的多餘空格或符號
    nameToProcess = nameToProcess.replace(/\s\s+/g, ' ').trim();
    nameToProcess = nameToProcess.replace(/^[-\s,]+|[-\s,]+$/g, '').trim(); // 移除前後多餘的 , 或 -

    // 4. 處理 "IEEE" 和 "Proceedings of"
    let finalPrefixedName = "";
    const nameLc = nameToProcess.toLowerCase();
    const originalFullNameLc = originalFullName.toLowerCase();

    const alreadyHasProceedings = nameLc.startsWith("proceedings of") || nameLc.startsWith("proc.");
    const originalHadIEEE = originalFullNameLc.includes("ieee");
    let baseName = nameToProcess;

    if (alreadyHasProceedings) {
        // 如果已經有 "Proceedings of" 或 "Proc."，則直接使用，但要確保 IEEE 的位置
        // 例如，如果是 "Proc. VTC"，且原始名稱有 IEEE，我們希望是 "Proc. IEEE VTC"
        if (originalHadIEEE && !nameLc.includes("ieee")) {
            baseName = nameToProcess.replace(/^(Proceedings of\s*|Proc\.\s*)/i, `$1IEEE `);
        }
        finalPrefixedName = `in ${baseName}`;
    } else {
        // 如果沒有 "Proceedings of"，我們需要添加它
        if (originalHadIEEE || nameLc.includes("ieee")) {
            // 如果原始名稱或當前處理的名稱包含 IEEE
            if (nameLc.startsWith("ieee")) {
                finalPrefixedName = `in Proceedings of ${nameToProcess}`; // "in Proceedings of IEEE VTC"
            } else {
                finalPrefixedName = `in Proceedings of IEEE ${nameToProcess}`; // "in Proceedings of IEEE VTC" (如果 nameToProcess 是 VTC)
            }
        } else {
            finalPrefixedName = `in Proceedings of ${nameToProcess}`; // "in Proceedings of Some Conference"
        }
    }

    // 再次清理可能由於拼接產生的 "IEEE IEEE"
    finalPrefixedName = finalPrefixedName.replace(/IEEE\s+IEEE/gi, 'IEEE');
    // 確保 "in Proceedings of IEEE" 和 "in Proc. IEEE" 的正確性
    finalPrefixedName = finalPrefixedName.replace(/in\s+Proceedings of\s+Proc\./gi, 'in Proc.');
    finalPrefixedName = finalPrefixedName.replace(/in\s+Proc\.\s+Proceedings of/gi, 'in Proceedings of');


    // 處理您的特定範例：
    // "GLOBECOM 2020 - 2020 IEEE Global Communications Conference"
    // 假設 originalFullName 是這個，currentStyleKey 是 'standard_abbr'
    // confNameFromAbbrStyle 可能是 "IEEE GLOBECOM" (來自字典)
    // nameToProcess 會是 "IEEE GLOBECOM"
    // alreadyHasProceedings = false
    // originalHadIEEE = true
    // nameLc.startsWith("ieee") = true
    // finalPrefixedName = "in Proceedings of IEEE GLOBECOM" -> 正確

    // "2024 IEEE 99th Vehicular Technology Conference (VTC2024-Spring)"
    // originalFullName 是這個。
    // 如果 currentStyleKey = 'no_abbr':
    //   nameToProcess = "IEEE Vehicular Technology Conference (VTC2024-Spring)" (年份和届数被移除)
    //   alreadyHasProceedings = false
    //   originalHadIEEE = true
    //   nameLc.startsWith("ieee") = true (假設清理後 IEEE 在開頭)
    //   finalPrefixedName = "in Proceedings of IEEE Vehicular Technology Conference (VTC2024-Spring)" -> 正確

    // 如果 currentStyleKey = 'standard_abbr':
    //   confNameFromAbbrStyle 可能是 "IEEE VTC"
    //   nameToProcess = "IEEE VTC" (字典裡的，本身沒有年份/届数)
    //   alreadyHasProceedings = false
    //   originalHadIEEE = true
    //   nameLc.startsWith("ieee") = true
    //   finalPrefixedName = "in Proceedings of IEEE VTC" -> 這裡我們希望是 "in Proceedings of IEEE VTC2024-Spring"
    //   這意味著如果縮寫本身不包含年份等詳細資訊 (如 VTC2024-Spring)，我們可能需要從 originalFullName 的括號中提取。

    // 針對縮寫中可能存在的詳細版本號（如 VTC2024-Spring）
    const specificVersionMatch = originalFullName.match(/\(([^)]+)\)$/); // 提取括號內容
    if (specificVersionMatch && specificVersionMatch[1]) {
        const specificVersion = specificVersionMatch[1];
        // 如果最終的名稱不包含這個特定版本資訊，但它是個縮寫，則附加上
        if (currentStyleKey !== 'no_abbr' && !finalPrefixedName.includes(specificVersion) && !nameToProcess.includes(specificVersion)) {
            // 例如 finalPrefixedName 是 "in Proceedings of IEEE VTC"
            // 而 specificVersion 是 "VTC2024-Spring"
            // 我們需要將 VTC 替換為 VTC2024-Spring，或者將 VTC2024-Spring 加在後面
            // 更簡單的做法是，如果 confNameFromAbbrStyle 是純粹的縮寫 (如 "IEEE VTC")，
            // 而 originalFullName 包含括號裡的詳細版本，則優先使用括號裡的。
            // 但 getAbbreviationByInternalStyle 通常不會返回 "IEEE VTC (VTC2024-Spring)"

            // 簡化：如果 nameToProcess (通常是縮寫) 不包含括號，但 originalFullName 包含括號版本，則附加括號版本
            if (!nameToProcess.includes("(") && nameToProcess.trim().length < originalFullName.length / 2) { // 粗略判斷是縮寫
                // 查找 nameToProcess (例如 "IEEE VTC") 是否是 specificVersion (例如 "VTC2024-Spring") 的一部分
                if (specificVersion.toUpperCase().includes(nameToProcess.replace(/^IEEE\s*/i, '').trim())) {
                    // 如果 "VTC2024-Spring" 包含了 "VTC"，則用 "IEEE " + specificVersion
                    let baseForSpecific = "";
                    if (originalHadIEEE || nameLc.includes("ieee")) baseForSpecific = "IEEE ";
                    nameToProcess = baseForSpecific + specificVersion; //變成 "IEEE VTC2024-Spring"

                    // 重新計算 finalPrefixedName
                    if (alreadyHasProceedings) { // 雖然前面判斷是 false，但為了邏輯完整
                        if (originalHadIEEE && !nameToProcess.toLowerCase().includes("ieee") && nameToProcess.toLowerCase().startsWith("proc")) {
                            nameToProcess = nameToProcess.replace(/^(Proceedings of\s*|Proc\.\s*)/i, `$1IEEE `);
                        }
                        finalPrefixedName = `in ${nameToProcess}`;
                    } else {
                        if (originalHadIEEE || nameToProcess.toLowerCase().includes("ieee")) {
                            if (nameToProcess.toLowerCase().startsWith("ieee")) {
                                finalPrefixedName = `in Proceedings of ${nameToProcess}`;
                            } else {
                                finalPrefixedName = `in Proceedings of IEEE ${nameToProcess}`;
                            }
                        } else {
                            finalPrefixedName = `in Proceedings of ${nameToProcess}`;
                        }
                    }
                }
            }
        }
    }
    // 再次清理可能由於拼接產生的 "IEEE IEEE"
    finalPrefixedName = finalPrefixedName.replace(/IEEE\s+IEEE/gi, 'IEEE');
    finalPrefixedName = finalPrefixedName.replace(/in Proceedings of IEEE Proc\./gi, 'in Proc.'); // 如果 Proc. 後面已經有 IEEE


    return finalPrefixedName.trim();
}

/**
 * Determines the final abbreviation based on a *specific* internal style preference and available data.
 * Internal styles: 'custom', 'standard', 'short', 'none'.
 * This function is now more focused, the choice of which internal style to use is made by the caller (formatXyzCitation).
 */
async function getAbbreviationByInternalStyle(originalName, isConference, internalStyleTarget, settings, options = {}) {
    const result = await resolvePublicationAbbreviation({
        customAbbreviations: settings.customAbbreviations || {},
        fullTitle: originalName,
        geminiApiKey: settings.geminiApiKey,
        metadataAbbrev: options.metadataAbbrev || '',
        sourceType: isConference ? 'conference' : 'journal',
        style: internalStyleTarget,
        suggestViaGemini: suggestAbbreviationViaGemini,
        useGemini: settings.useGemini
    });

    return {
        abbreviation: result.abbreviation || originalName || 'N/A',
        suggestionError: ''
    };
}

/**
 * Cleans and formats a conference name for display, adding "in Proceedings of"
 * and handling "IEEE".
 * @param {string} confNameInput - The conference name (original, from dict, or fallback).
 * @param {string} originalFullMetaName - The original full publication title from metadata.
 * @param {string} styleKey - The citation style key (e.g., 'no_abbr', 'standard_abbr').
 * @param {object} standardConferenceAbbreviationsDict - The dictionary for reference.
 * @returns {string} Formatted conference string e.g., "in Proceedings of IEEE VTC (VTC2024-Spring)".
 */
function normalizeConferenceNameForDisplay(confNameInput, originalFullMetaName, styleKey, standardConferenceAbbreviationsDict) {
    let baseName = confNameInput;

    // For 'no_abbr', start with the original full name for cleaning.
    if (styleKey === 'no_abbr') {
        baseName = originalFullMetaName;
    }

    // --- Step 1: Extract specific version/detail from original name's parenthesis if any ---
    let specificDetailInParentheses = "";
    const parentheticalMatchFull = originalFullMetaName.match(/\(([^)]+)\)/);
    if (parentheticalMatchFull && parentheticalMatchFull[1]) {
        // 只提取那些看起來是會議系列/年份的，而不是普通的副標題
        if (parentheticalMatchFull[1].match(/([A-Z]+)?\d{4}(-[A-Z]+)?/i) || /^[A-Z\s&-]+$/.test(parentheticalMatchFull[1]) && parentheticalMatchFull[1].length < 20) {
            specificDetailInParentheses = parentheticalMatchFull[1].trim();
        }
    }

    // --- Step 2: Clean the baseName (remove years, session numbers from main string) ---
    // Remove session numbers like 99th, 1st, etc.
    baseName = baseName.replace(/\b\d{1,3}(st|nd|rd|th)\b\s*/gi, '');
    // Remove standalone years or year ranges
    baseName = baseName.replace(/(^|\s)\b\d{4}\b(\s*-\s*\d{2,4})?(\s|,|$)/g, '$1').trim(); //  " 2024," -> " ", "2024 Conf" -> "Conf"
    baseName = baseName.replace(/\s\s+/g, ' ').trim(); // Consolidate spaces
    baseName = baseName.replace(/^[-\s,]+|[-\s,]+$/g, '').trim(); // Trim leading/trailing junk

    // --- Step 3: Handle "Acronym - Full Name" structure ---
    // If we are in an abbreviation mode and the baseName (likely from dictionary)
    // contains " - ", prefer the part before " - " if it looks like an acronym.
    // Or if in 'no_abbr' mode and original name has this, try to isolate the core name.
    if (baseName.includes(" - ")) {
        const parts = baseName.split(" - ");
        // If the first part is short and all caps (likely acronym), use it.
        if (/^[A-Z\s&]+$/.test(parts[0]) && parts[0].length < parts[1].length && parts[0].length < 15) {
            baseName = parts[0].trim();
        } else {
            // Otherwise, try to find 'IEEE' in one of the parts or use the longer part if it seems more descriptive
            const ieeePart = parts.find(p => p.toLowerCase().includes("ieee"));
            if (ieeePart) {
                baseName = ieeePart.trim();
            } else { // Fallback to the part that doesn't look like a year or just an acronym if possible
                baseName = parts.find(p => !/^\d{4}$/.test(p.trim()) && p.length > parts[0].length) || parts[1] || parts[0];
                baseName = baseName.trim();
            }
        }
    }

    // --- Step 4: Remove parenthetical details from baseName *IF* we captured a specific one
    // and the baseName is not just the specific detail itself.
    if (specificDetailInParentheses && baseName !== specificDetailInParentheses) {
        baseName = baseName.replace(/\s*\([^)]+\)\s*$/, '').trim();
    }


    // --- Step 5: Ensure "IEEE" is present if original had it, and handle duplicates ---
    const originalHadIEEE = originalFullMetaName.toLowerCase().includes("ieee");
    let currentBaseHasIEEE = baseName.toLowerCase().includes("ieee");

    if (originalHadIEEE && !currentBaseHasIEEE) {
        baseName = "IEEE " + baseName;
        currentBaseHasIEEE = true; // Update status
    }
    if (currentBaseHasIEEE) { // If it has IEEE, ensure it's at the start and not duplicated
        baseName = baseName.replace(/(^|\s)IEEE/i, 'IEEE'); // Normalize to start
        baseName = baseName.replace(/^IEEE\s+IEEE/i, 'IEEE'); // Remove "IEEE IEEE"
    }

    // --- Step 6: Re-attach specific detail if it's not already part of baseName ---
    // And if baseName is now just the core acronym (e.g., "IEEE VTC")
    if (specificDetailInParentheses && !baseName.includes(specificDetailInParentheses)) {
        // Check if baseName is a known standard abbreviation.
        // If baseName (e.g. "IEEE VTC") should be combined with specific detail (e.g. "VTC2024-Spring")
        let standardAbbrForOriginal = "";
        const keyForDict = originalFullMetaName.replace(/^IEEE\s*?\/?\s*/i, '').replace(/\s*\(.*\)\s*$/, '').trim();
        if (standardConferenceAbbreviationsDict[keyForDict]) {
            standardAbbrForOriginal = standardConferenceAbbreviationsDict[keyForDict]; // e.g., "IEEE VTC"
        }

        // If baseName IS a standard pure acronym (like "IEEE VTC") and specificDetail is like "VTC2024-Spring",
        // we might prefer "IEEE VTC2024-Spring".
        if (baseName === standardAbbrForOriginal && specificDetailInParentheses.toUpperCase().includes(baseName.replace(/^IEEE\s*/i, '').toUpperCase())) {
            baseName = (baseName.toLowerCase().startsWith("ieee") ? "IEEE " : "") + specificDetailInParentheses;
        } else {
            baseName += ` (${specificDetailInParentheses})`;
        }
    }
    // Final trim after potential additions
    baseName = baseName.replace(/\s\s+/g, ' ').trim();


    // --- Step 7: Construct the final string with "in Proceedings of" ---
    let prefix = "in Proceedings of ";
    // If baseName already starts with "Proceedings of" or "Proc.", adjust prefix.
    if (baseName.toLowerCase().startsWith("proceedings of")) {
        prefix = "in "; // baseName is "Proceedings of XXX"
        baseName = baseName.substring("proceedings of".length).trim(); // Get "XXX"
        // Now re-add "Proceedings of" with correct casing and IEEE handling
        if (baseName.toLowerCase().startsWith("ieee")) {
            return `in Proceedings of ${baseName}`;
        } else if (originalHadIEEE) {
            return `in Proceedings of IEEE ${baseName}`;
        } else {
            return `in Proceedings of ${baseName}`;
        }
    } else if (baseName.toLowerCase().startsWith("proc.")) {
        prefix = "in "; // baseName is "Proc. XXX"
        // We want "in Proceedings of XXX", so we need to expand "Proc."
        baseName = baseName.substring("proc.".length).trim();
        if (baseName.toLowerCase().startsWith("ieee")) {
            return `in Proceedings of ${baseName}`; // e.g. baseName = "IEEE VTC" -> "in Proceedings of IEEE VTC"
        } else if (originalHadIEEE) {
            return `in Proceedings of IEEE ${baseName}`;
        } else {
            return `in Proceedings of ${baseName}`;
        }
    }

    // At this point, baseName is cleaned and doesn't start with "Proceedings of" or "Proc."
    if (baseName.toLowerCase().startsWith("ieee")) {
        return `${prefix}${baseName}`; // e.g., "in Proceedings of IEEE VTC (VTC2024-Spring)"
    } else if (originalHadIEEE) {
        return `${prefix}IEEE ${baseName}`; // e.g., "in Proceedings of IEEE VTC (VTC2024-Spring)" if baseName was just "VTC (VTC2024-Spring)"
    } else {
        return `${prefix}${baseName}`;
    }
}


function parseBibtex(bibtexContent) {
    // (This function remains the same as in the original file)
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


async function getArxivCitation(urlOrId) {
    // (This function remains the same as in the original file)
    const parsedUrl = typeof urlOrId === 'string' ? parseSupportedUrl(urlOrId) : null;
    const directIdMatch = typeof urlOrId === 'string'
        ? urlOrId.trim().match(/^(\d{4}\.\d{4,5}(?:v\d+)?)$/)
        : null;
    const paperId = parsedUrl?.site === 'arxiv' ? parsedUrl.arxivId : (directIdMatch?.[1] || '');

    if (!paperId) throw new Error("Could not extract paper ID from arXiv URL.");

    const bibtexUrl = `https://arxiv.org/bibtex/${paperId}`;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const response = await fetch(bibtexUrl, {
            signal: controller.signal,
            headers: { 'User-Agent': 'CitationFormatterExtension/1.8', 'Accept': 'application/x-bibtex; charset=utf-8' }
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

async function formatArxivCitation(citationInfo, settings, currentStyleKey) { // ADDED currentStyleKey
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
        if (parts.length === 1) {
            const names = author.split(/\s+/);
            lastName = names.pop() || '';
            givenNames = names.join(' ');
        }
        if (!lastName) return author;
        const initials = givenNames.split(/\s+|-/)
            .filter(n => n)
            .map(n => n[0].toUpperCase() + '.')
            .join('');
        return `${initials} ${lastName}`;
    });
    let authors = 'N/A';
    if (formattedAuthors.length > 0) {
        if (formattedAuthors.length === 1) authors = formattedAuthors[0];
        else if (formattedAuthors.length === 2) authors = formattedAuthors.join(' and ');
        else authors = formattedAuthors.slice(0, -1).join(', ') + ', and ' + formattedAuthors[formattedAuthors.length - 1];
    }
    const arxivId = `${citationInfo.archiveprefix || 'arXiv'}:${citationInfo.eprint || 'N/A'}`;

    let citationText = '';
    let suggestionErrorText = ''; // arXiv doesn't typically use abbreviation for pub name

    if (currentStyleKey === 'simplest_abbr') {
        const pubAbbrForSimplest = 'arXiv'; // Fixed for arXiv
        citationText = twoDigitYear
            ? `${title} (${twoDigitYear}'${pubAbbrForSimplest})`
            : `${title} (${pubAbbrForSimplest})`;
    } else { // 'no_abbr', 'standard_abbr', 'custom_list_abbr' all result in same full format for arXiv
        citationText = `${authors}, "${title}," ${arxivId}. [Online]. Available: ${citationInfo.url || 'N/A'}`;
    }
    // Clean up common issues
    citationText = citationText.replace(/,?\s*N\/A,?/g, '').replace(/,\s*,/g, ',').replace(/\s+,/g, ',')
        .replace(/,\s*\./g, '.').replace(/\s{2,}/g, ' ').replace(/\.\.+/g, '.').trim();

    return { citationText, suggestionError: suggestionErrorText };
}


async function getIeeeCitation(url) {
    // (This function remains the same as in the original file)
    try {
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
            await new Promise(resolve => setTimeout(resolve, 500));
        } else {
            console.log("Using existing offscreen document for IEEE parsing.");
        }
        console.log("Sending getIeeeMetadata message to offscreen document.");
        const response = await Promise.race([
            chrome.runtime.sendMessage({ target: 'offscreen', action: 'getIeeeMetadata', url: url }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Offscreen document communication timed out (20s).')), 20000))
        ]);
        if (!response) {
            throw new Error("No response received from offscreen document. It might have closed or failed.");
        }
        if (!response.success) {
            throw new Error(response.error || "Offscreen document reported an unspecified error during metadata extraction.");
        }
        return response;
    } catch (error) {
        console.error("Error communicating with/creating offscreen document:", error);
        closeOffscreenDocument();
        throw new Error(`Failed to get IEEE citation via offscreen document: ${error.message}`);
    }
}

async function getIeeeMetadataFromActiveTab(tabId) {
    try {
        const injectionResults = await chrome.scripting.executeScript({
            target: { tabId },
            world: 'MAIN',
            func: () => {
                const raw = window.xplGlobal?.document?.metadata;
                if (!raw || typeof raw !== 'object') {
                    return null;
                }

                const authorSource = raw.authors?.authors ?? raw.authors ?? raw.authorNames ?? [];

                const serializeAuthor = (author) => {
                    if (typeof author === 'string') {
                        return author;
                    }

                    if (!author || typeof author !== 'object') {
                        return null;
                    }

                    return {
                        name:
                            author.name ||
                            author.preferredName ||
                            author.fullName ||
                            author.displayName ||
                            author.authorName ||
                            ''
                    };
                };

                return {
                    articleNumber: raw.articleNumber ?? raw.arnumber ?? '',
                    authorNames: raw.authorNames ?? '',
                    authors: Array.isArray(authorSource) ? authorSource.map(serializeAuthor).filter(Boolean) : authorSource,
                    contentType: raw.contentType ?? raw.docType ?? '',
                    displayDocTitle: raw.displayDocTitle ?? '',
                    displayPublicationDate: raw.displayPublicationDate ?? '',
                    displayPublicationTitle: raw.displayPublicationTitle ?? '',
                    endPage: raw.endPage ?? raw.pageEnd ?? '',
                    formulaStrippedArticleTitle: raw.formulaStrippedArticleTitle ?? '',
                    issue: raw.issue ?? '',
                    publicationDate: raw.publicationDate ?? raw.displayPublicationDate ?? raw.publicationYear ?? '',
                    publicationTitle: raw.publicationTitle ?? raw.displayPublicationTitle ?? '',
                    publicationYear: raw.publicationYear ?? '',
                    startPage: raw.startPage ?? raw.pageStart ?? '',
                    title: raw.title ?? raw.formulaStrippedArticleTitle ?? raw.displayDocTitle ?? '',
                    volume: raw.volume ?? ''
                };
            }
        });

        const rawMetadata = injectionResults?.[0]?.result;
        if (!rawMetadata) {
            console.log("Background: Active-tab IEEE metadata unavailable; falling back to offscreen.");
            return null;
        }

        const normalizedMetadata = normalizeIeeeActiveTabMetadata(rawMetadata);
        if (!normalizedMetadata) {
            console.log("Background: Active-tab IEEE metadata unavailable; falling back to offscreen.");
            return null;
        }

        console.log("Background: Loaded IEEE metadata from active tab.");
        return normalizedMetadata;
    } catch (error) {
        console.warn("Background: Active-tab IEEE metadata extraction failed:", error?.message || error);
        return null;
    }
}

async function formatIeeeCitation(metadata, settings, currentStyleKey) {
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

    // --- Authors Formatting (remains the same) ---
    const formattedAuthors = authorsList.map(author => {
        const name = author?.name ?? '';
        const names = name.split(' ');
        if (names.length < 2) return name;
        const lastName = names[names.length - 1];
        const givenNames = names.slice(0, -1);
        const initials = givenNames
            .map(n => n.split('-').map(part => part.length > 0 ? part[0].toUpperCase() + '.' : '').join('-'))
            .join('');
        return `${initials} ${lastName}`;
    });
    let authors = 'N/A';
    if (formattedAuthors.length > 0) {
        if (formattedAuthors.length === 1) authors = formattedAuthors[0];
        else if (formattedAuthors.length === 2) authors = formattedAuthors.join(' and ');
        else authors = formattedAuthors.slice(0, -1).join(', ') + ', and ' + formattedAuthors[formattedAuthors.length - 1];
    }

    // --- Pages String Logic (remains the same) ---
    let pagesStr = '';
    if (startPage && endPage && startPage !== endPage) pagesStr = `pp. ${startPage}-${endPage}`;
    else if (startPage) pagesStr = `p. ${startPage}`;
    else if (articleNumber) pagesStr = `Art. no. ${articleNumber}`;

    // --- Date Formatting Logic (remains the same) ---
    let formattedDate = '';
    let twoDigitYear = '';
    if (pubDateStr) {
        try {
            const normalizedDateStr = pubDateStr.replace(/-\s*/g, ' ').replace(/\.\s*/g, ' ');
            const dateObj = new Date(normalizedDateStr);
            if (!isNaN(dateObj.getTime())) {
                const year = dateObj.getFullYear();
                twoDigitYear = year.toString().slice(-2);
                if (normalizedDateStr.trim().length === 4 && /^\d{4}$/.test(normalizedDateStr.trim())) {
                    formattedDate = year.toString();
                } else {
                    const monthIndex = dateObj.getMonth();
                    if (monthIndex >= 0 && monthIndex <= 11) {
                        formattedDate = formatMonthYear(monthIndex, year);
                    } else {
                        formattedDate = year.toString();
                        console.warn("Parsed invalid month, using year only for:", pubDateStr);
                    }
                }
            } else {
                const yearMatch = pubDateStr.match(/\b(\d{4})\b/);
                if (yearMatch) {
                    formattedDate = yearMatch[1];
                    twoDigitYear = yearMatch[1].slice(-2);
                } else { console.warn("Could not reliably parse date:", pubDateStr); }
            }
        } catch (e) { console.warn("Error parsing date:", pubDateStr, e); }
    }


    let citationText = '';
    let finalSuggestionError = '';
    let pubName = originalPubName; // Start with original for 'no_abbr' or as base for others

    if (currentStyleKey === 'simplest_abbr') {
        let pubAbbrForSimplest = '';
        let errSimple = '';
        // For simplest, try custom first, then short as a fallback
        const customResult = await getAbbreviationByInternalStyle(originalPubName, isConference, 'custom', settings);
        // Check if custom actually provided a different abbreviation (not just original or basic fallback)
        // and also ensure it wasn't a "key missing" error, as Gemini shouldn't be primary for this.
        if (customResult.abbreviation !== originalPubName &&
            customResult.abbreviation !== fallbackAbbreviation(originalPubName, isConference) &&
            !customResult.suggestionError.includes("API key is missing") &&
            !customResult.suggestionError.includes("API key is invalid")) {
            pubAbbrForSimplest = customResult.abbreviation;
            errSimple = customResult.suggestionError;
        } else {
            // If custom didn't yield a specific result, or if it errored cleanly, try 'short'
            const shortResult = await getAbbreviationByInternalStyle(originalPubName, isConference, 'short', settings);
            pubAbbrForSimplest = shortResult.abbreviation;
            // Prioritize error from 'short' if 'custom' wasn't specifically used or it was a clean fallback from custom
            if (!errSimple || (customResult.abbreviation === originalPubName || customResult.abbreviation === fallbackAbbreviation(originalPubName, isConference))) {
                errSimple = shortResult.suggestionError;
            }
        }
        finalSuggestionError = errSimple;

        citationText = twoDigitYear
            ? `${title} (${twoDigitYear}'${pubAbbrForSimplest})`
            : `${title} (${pubAbbrForSimplest})`;
        if (finalSuggestionError) citationText += finalSuggestionError;

    } else { // For 'no_abbr', 'standard_abbr', 'custom_list_abbr'
        let internalAbbrTarget;
        if (currentStyleKey === 'no_abbr') internalAbbrTarget = 'none';
        else if (currentStyleKey === 'standard_abbr') internalAbbrTarget = 'standard';
        else if (currentStyleKey === 'custom_list_abbr') internalAbbrTarget = 'custom';
        else internalAbbrTarget = 'standard';

        const abbrResult = await getAbbreviationByInternalStyle(originalPubName, isConference, internalAbbrTarget, settings);
        let pubNameToFormat = abbrResult.abbreviation;
        finalSuggestionError = abbrResult.suggestionError;

        let displayPubName = pubNameToFormat; // For journals or if not a conference

        if (isConference) {
            // 使用新的輔助函數來處理會議名稱和前綴
            displayPubName = normalizeConferenceNameForDisplay(pubNameToFormat, originalPubName, currentStyleKey, standardConferenceAbbreviations);
        }
        // 對於期刊，pubName 不需要 "in Proceedings of" 前綴
        // displayPubName 此時已經是最終的出版物名稱（對期刊而言）或會議的完整 "in Proceedings of..." 字串

        citationText = `${authors}, "${title}," ${displayPubName}`;

        // ... (後續的 volume, issue, pages, date, final period, suggestionError, cleanup) ...
        if (volume) citationText += `, vol. ${volume}`;
        if (issue) citationText += `, no. ${issue}`;
        if (pagesStr) citationText += `, ${pagesStr}`;
        if (formattedDate) citationText += `, ${formattedDate}`;
        citationText += '.'; // 最終句點

        if (finalSuggestionError && !finalSuggestionError.toLowerCase().includes("api key")) {
            citationText += finalSuggestionError;
        }

        citationText = citationText.replace(/,?\s*N\/A,?/g, '').replace(/vol\.\s*,/g, 'vol.').replace(/no\.\s*,/g, 'no.')
            .replace(/Art\. no\.\s*,/g, 'Art. no.').replace(/,\s*,/g, ',').replace(/\s+,/g, ',')
            .replace(/,\s*\.(?!\s*\[)/g, '.').replace(/\s{2,}/g, ' ').replace(/\.\.+/g, '.').trim();
        // 移除可能的多餘 "in in" 或 "Proceedings of Proceedings of" (雖然 normalize 函數應已處理大部分)
        citationText = citationText.replace(/\bin\s+in\b/gi, "in");
        citationText = citationText.replace(/\bProceedings of\s+Proceedings of\b/gi, "Proceedings of");
    }
    return { citationText, suggestionError: finalSuggestionError };
}

async function getMdpiCitation(url) {
    // (This function remains the same as in the original file)
    console.log("Requesting MDPI metadata fetching via offscreen for:", url);
    try {
        const existingContexts = await chrome.runtime.getContexts({
            contextTypes: ['OFFSCREEN_DOCUMENT'],
            documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)]
        });
        if (existingContexts.length === 0) {
            console.log("Creating new offscreen document for MDPI parsing.");
            await chrome.offscreen.createDocument({
                url: OFFSCREEN_DOCUMENT_PATH,
                reasons: [chrome.offscreen.Reason.DOM_PARSER],
                justification: 'Parse MDPI page metadata'
            });
            await new Promise(resolve => setTimeout(resolve, 500));
        } else {
            console.log("Using existing offscreen document for MDPI parsing.");
        }
        console.log("Sending getMdpiMetadata message to offscreen document.");
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
        console.log("Received MDPI metadata from offscreen:", response.metadata);
        return response.metadata;
    } catch (error) {
        console.error("Error communicating with/creating offscreen document for MDPI:", error);
        closeOffscreenDocument();
        throw new Error(`Failed to get MDPI citation via offscreen document: ${error.message}`);
    }
}


async function formatMdpiCitation(metadata, settings, currentStyleKey) { // ADDED currentStyleKey
    // (Similar logic to formatIeeeCitation, adapted for MDPI metadata structure and applying the new citationStyle)
    const authorsList = Array.isArray(metadata.authors) ? metadata.authors : (metadata.authors ? [metadata.authors] : []);
    const title = metadata.title || 'N/A';
    const originalJournalTitle = metadata.journalTitle || 'N/A';
    const metadataJournalAbbrev = metadata.journalAbbrev || '';
    const volume = metadata.volume || '';
    const articleNumber = metadata.firstpage || ''; // MDPI often uses this as article ID
    // const doi = metadata.doi || ''; 
    const pubDateStr = metadata.publicationDate || ''; // Format YYYY/MM/DD

    const formattedAuthors = authorsList.map(author => {
        if (!author || typeof author !== 'string') return '';
        const parts = author.split(/,\s*/);
        const lastName = parts[0].trim();
        let givenNames = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
        if (!lastName) return author;
        const initials = givenNames.split(/\s+|-/)
            .filter(n => n)
            .map(n => n[0].toUpperCase() + '.')
            .join(' ');
        return `${initials} ${lastName}`;
    }).filter(Boolean);

    let authors = 'N/A';
    if (formattedAuthors.length > 0) {
        if (formattedAuthors.length === 1) authors = formattedAuthors[0];
        else if (formattedAuthors.length === 2) authors = formattedAuthors.join(' and ');
        else authors = formattedAuthors.slice(0, -1).join(', ') + ', and ' + formattedAuthors[formattedAuthors.length - 1];
    }

    let formattedDate = ''; let twoDigitYear = '';
    if (pubDateStr) {
        try {
            const dateParts = pubDateStr.split('/');
            if (dateParts.length === 3 && /^\d{4}$/.test(dateParts[0]) && /^\d{1,2}$/.test(dateParts[1])) {
                const year = dateParts[0];
                const monthIndex = parseInt(dateParts[1], 10) - 1;
                twoDigitYear = year.slice(-2);
                if (monthIndex >= 0 && monthIndex <= 11) {
                    formattedDate = formatMonthYear(monthIndex, year);
                } else { formattedDate = year; }
            } else {
                const yearMatch = pubDateStr.match(/\b(\d{4})\b/);
                if (yearMatch) {
                    formattedDate = yearMatch[1];
                    twoDigitYear = yearMatch[1].slice(-2);
                }
            }
        } catch (e) { console.warn("Error parsing MDPI date:", pubDateStr, e); }
    }
    if (!formattedDate && pubDateStr) {
        const yearMatch = pubDateStr.match(/\b(\d{4})\b/);
        if (yearMatch) formattedDate = yearMatch[1];
    }
    if (!twoDigitYear && pubDateStr) {
        const yearMatch = pubDateStr.match(/\b(\d{4})\b/);
        if (yearMatch) twoDigitYear = yearMatch[1].slice(-2);
    }

    let citationText = '';
    let finalSuggestionError = '';
    let pubName = originalJournalTitle;

    if (currentStyleKey === 'simplest_abbr') {
        const shortResult = await getAbbreviationByInternalStyle(
            originalJournalTitle,
            false,
            'short',
            settings,
            { metadataAbbrev: metadataJournalAbbrev }
        );
        const pubAbbrForSimplest = shortResult.abbreviation;
        finalSuggestionError = shortResult.suggestionError;

        citationText = twoDigitYear
            ? `${title} (${twoDigitYear}'${pubAbbrForSimplest})`
            : `${title} (${pubAbbrForSimplest})`;
        if (finalSuggestionError) {
            // Append error only if it's not a benign "key missing" or similar if Gemini was involved via 'short'
            if (!finalSuggestionError.toLowerCase().includes("api key is missing") &&
                !finalSuggestionError.toLowerCase().includes("api key is invalid")) {
                citationText += finalSuggestionError;
            } else {
                console.log("Simplest Abbr: Gemini suggestion error related to API key, not appending to citation text.", finalSuggestionError);
            }
        }
    } else { // 'no_abbr', 'standard_abbr', 'custom_list_abbr'
        let internalAbbrTarget;
        if (currentStyleKey === 'no_abbr') internalAbbrTarget = 'none';
        else if (currentStyleKey === 'standard_abbr') internalAbbrTarget = 'standard';
        else if (currentStyleKey === 'custom_list_abbr') internalAbbrTarget = 'custom';
        else internalAbbrTarget = 'short';

        const abbrResult = await getAbbreviationByInternalStyle(
            pubName,
            false,
            internalAbbrTarget,
            settings,
            { metadataAbbrev: metadataJournalAbbrev }
        );
        pubName = abbrResult.abbreviation; // This is the (potentially) abbreviated journal title
        finalSuggestionError = abbrResult.suggestionError;

        citationText = `${authors}, "${title}," ${pubName}`;
        // MDPI citations usually don't end journal names with a period if they are multi-word and not standard abbrevs.
        // The abbreviation from getAbbreviationByInternalStyle should be correctly formatted.
        if (metadata.volume) citationText += `, vol. ${metadata.volume}`;
        if (metadata.firstpage) citationText += `, Art. no. ${metadata.firstpage}`; // MDPI uses firstpage as article number
        if (formattedDate) citationText += `, ${formattedDate}`;
        citationText += '.'; // Final period
        if (finalSuggestionError) citationText += finalSuggestionError;

        citationText = citationText.replace(/,?\s*N\/A,?/g, '').replace(/vol\.\s*,/g, 'vol.')
            .replace(/Art\. no\.\s*,/g, 'Art. no.').replace(/,\s*,/g, ',').replace(/\s+,/g, ',')
            .replace(/,\s*\.(?!\s*\[)/g, '.').replace(/\s{2,}/g, ' ').replace(/\.\.+/g, '.').trim();
    }
    return { citationText, suggestionError: finalSuggestionError };
}


// --- Lifecycle Events & Offscreen Doc Management ---
async function closeOffscreenDocument() {
    try {
        const contexts = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
        if (contexts.length > 0 && chrome.offscreen.closeDocument) {
            console.log("Closing existing offscreen document.");
            await chrome.offscreen.closeDocument();
        } else if (contexts.length > 0) {
            console.log("Offscreen document exists but closeDocument API not available. It will close automatically.");
        }
    } catch (error) { console.error("Error trying to close offscreen document:", error); }
}

if (typeof chrome !== 'undefined' && chrome.runtime) {
    // --- Background Script Event Listener ---
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'fetchCitation' && (message.url || message.originalUrl) && !sender.tab) {
            const receivedUrl = message.url || message.originalUrl;
            console.log(`Background: Received fetchCitation request for ${receivedUrl}`);
            (async () => {
                let settings = {};
                let fetchedMetadata;
                let results = [];

                try {
                    settings = await getSettings();
                    console.log("Background: Using citation styles:", settings.citationStyles);

                    const parsedMessageUrl = parseSupportedUrl(message.originalUrl || message.url);
                    const routingInfo = {
                        site: message.site || parsedMessageUrl?.site || null,
                        originalUrl: message.originalUrl || parsedMessageUrl?.originalUrl || receivedUrl,
                        canonicalUrl: message.url || parsedMessageUrl?.canonicalUrl || receivedUrl,
                        documentId: message.documentId || parsedMessageUrl?.documentId || '',
                        arxivId: message.arxivId || parsedMessageUrl?.arxivId || ''
                    };

                    if (!routingInfo.site) {
                        throw new Error("Unsupported URL.");
                    }

                    if (routingInfo.site === 'arxiv') {
                        fetchedMetadata = await getArxivCitation(routingInfo.arxivId || routingInfo.canonicalUrl);
                        for (const styleKey of settings.citationStyles) {
                            const { citationText, suggestionError } = await formatArxivCitation(fetchedMetadata, settings, styleKey);
                            results.push({ styleKey, citationText, suggestionError });
                        }
                    } else if (routingInfo.site === 'ieee') {
                        if (message.tabId) {
                            fetchedMetadata = await getIeeeMetadataFromActiveTab(message.tabId);
                        }

                        if (!fetchedMetadata) {
                            const ieeeResponse = await getIeeeCitation(routingInfo.canonicalUrl);
                            fetchedMetadata = ieeeResponse.metadata;
                        }

                        for (const styleKey of settings.citationStyles) {
                            const { citationText, suggestionError } = await formatIeeeCitation(fetchedMetadata, settings, styleKey);
                            results.push({ styleKey, citationText, suggestionError });
                        }
                    } else if (routingInfo.site === 'mdpi') {
                        fetchedMetadata = await getMdpiCitation(routingInfo.canonicalUrl);
                        for (const styleKey of settings.citationStyles) {
                            const { citationText, suggestionError } = await formatMdpiCitation(fetchedMetadata, settings, styleKey);
                            results.push({ styleKey, citationText, suggestionError });
                        }
                    } else {
                        throw new Error("Unsupported URL.");
                    }

                    console.log("Formatted citation results:", results);
                    sendResponse({ success: true, citations: results }); // CHANGED: send array

                } catch (error) {
                    console.error("Error processing citation in background:", error);
                    let finalErrorMsg = error.message || "An unknown error occurred.";
                    // ... (error message enhancement remains) ...
                    sendResponse({ success: false, error: finalErrorMsg, citations: [] }); // Send empty array on error
                }
            })();
            return true; // Keep the message channel open for sendResponse
        }
        return false;
    });

    chrome.runtime.onInstalled.addListener(details => {
        console.log("Extension installed/updated:", details.reason);
        const defaults = {
            geminiApiKey: null, useGemini: false, autoCopy: true,
            citationStyles: ['standard_abbr'], // New default for array
            customAbbreviations: {}
        };
        if (details.reason === "install") {
            chrome.storage.sync.set(defaults, () => { /* ... */ });
        } else if (details.reason === "update") {
            chrome.storage.sync.get(null, (items) => {
                const settingsToSet = { ...defaults };
                Object.assign(settingsToSet, items);

                let keysToRemove = [];
                if (items.hasOwnProperty('fullModeAbbrStyle')) keysToRemove.push('fullModeAbbrStyle');
                if (items.hasOwnProperty('pptModeAbbrStyle')) keysToRemove.push('pptModeAbbrStyle');
                if (items.hasOwnProperty('abbreviationStyle')) keysToRemove.push('abbreviationStyle');
                if (items.hasOwnProperty('citationMode')) keysToRemove.push('citationMode'); // Remove old citationMode

                // Ensure citationStyles is an array, migrate if old citationStyle (single string) exists
                if (items.citationStyle && typeof items.citationStyle === 'string' && !items.citationStyles) {
                    // Simple migration: map old single style to new array key
                    let newStyleKey = 'standard_abbr'; // default
                    if (items.citationStyle === 'standard_ieee') newStyleKey = 'standard_abbr';
                    else if (items.citationStyle === 'abbreviate_pub') newStyleKey = 'standard_abbr'; // Or map to a new 'short_explicit_abbr' if you add one
                    else if (items.citationStyle === 'simplest_t_y_p') newStyleKey = 'simplest_abbr';
                    else if (items.citationStyle === 'no_abbr') newStyleKey = 'no_abbr';
                    else if (items.citationStyle === 'custom_list') newStyleKey = 'custom_list_abbr';
                    settingsToSet.citationStyles = [newStyleKey];
                } else if (!Array.isArray(settingsToSet.citationStyles) || settingsToSet.citationStyles.length === 0) {
                    settingsToSet.citationStyles = defaults.citationStyles;
                }
                if (items.hasOwnProperty('citationStyle')) keysToRemove.push('citationStyle'); // Remove old single string citationStyle

                if (keysToRemove.length > 0) {
                    chrome.storage.sync.remove(keysToRemove, () => { /* ... */ });
                }
                chrome.storage.sync.set(settingsToSet, () => { /* ... */ });
            });
        }
        closeOffscreenDocument();
    });

    chrome.runtime.onStartup.addListener(() => {
        console.log("Extension started up via browser startup.");
        closeOffscreenDocument();
    });

    console.log("Background service worker started/awoken.");
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fallbackAbbreviation,
        formatMonthYear,
        formatArxivCitation,
        formatIeeeCitation,
        formatMdpiCitation,
        getAbbreviationByInternalStyle,
        getTwoDigitYear,
        normalizeConferenceNameForDisplay,
        parseBibtex,
        resolvePublicationAbbreviation,
        shortAbbreviations,
        standardConferenceAbbreviations,
        standardJournalAbbreviations
    };
}
