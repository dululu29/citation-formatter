// --- Global DOM Element References ---
let apiKeyInput, useGeminiToggle, autoCopyToggle, citationModeRadios,
    fullModeAbbrStyleRadios, // Radios for Full Mode style
    pptModeAbbrStyleRadios,  // Radios for PPT Mode style
    saveConfigButton, statusMessage,
    tabConfigButton, tabCustomAbbrButton, tabAboutButton,
    tabConfigContent, tabCustomAbbrContent, tabAboutContent,
    extensionVersionSpan,
    customAbbreviationsArea, saveCustomAbbrButton, customAbbrStatus;

// --- Helper function to display status messages ---
function showStatus(message, isError = false, duration = 3000, targetElement = statusMessage) {
    if (!targetElement) {
        console.error("Status message target element not found!");
        return;
    }
    targetElement.textContent = message;
    targetElement.classList.remove('opacity-0', 'text-green-600', 'text-red-600', 'text-gray-500'); // Reset classes
    targetElement.classList.add(isError ? 'text-red-600' : 'text-green-600');

    if (duration > 0) {
        setTimeout(() => {
            if (targetElement) targetElement.classList.add('opacity-0');
        }, duration);
    } else if (duration === 0) {
        targetElement.classList.remove('opacity-0');
    }
}

// --- Tab Switching Logic ---
function switchTab(targetTab) {
    const buttons = [tabConfigButton, tabCustomAbbrButton, tabAboutButton];
    const contents = [tabConfigContent, tabCustomAbbrContent, tabAboutContent];

    // Deactivate all
    buttons.forEach(button => button.classList.remove('active', 'border-indigo-500', 'text-indigo-600'));
    buttons.forEach(button => button.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300'));
    contents.forEach(content => content.classList.remove('active'));

    // Activate the target tab
    let activeIndex = 0; // Default to config
    if (targetTab === 'custom-abbr') activeIndex = 1;
    else if (targetTab === 'about') activeIndex = 2;

    buttons[activeIndex].classList.add('active', 'border-indigo-500', 'text-indigo-600');
    buttons[activeIndex].classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    contents[activeIndex].classList.add('active');
}

// --- Load existing settings ---
function loadSettings() {
    const defaultSettings = {
        geminiApiKey: '',
        useGemini: false,
        autoCopy: true,
        citationMode: 'full', // Default display mode
        fullModeAbbrStyle: 'standard', // Default Full Mode style
        pptModeAbbrStyle: 'short',     // Default PPT Mode style
        customAbbreviations: {}        // Default custom list
    };

    chrome.storage.sync.get(defaultSettings, (items) => {
        if (chrome.runtime.lastError) {
            console.error("Error loading settings:", chrome.runtime.lastError);
            showStatus("Error loading settings.", true, 5000);
            return;
        }
        console.log("Settings loaded:", items);
        // Populate General Config
        if (apiKeyInput) apiKeyInput.value = items.geminiApiKey || '';
        if (useGeminiToggle) useGeminiToggle.checked = items.useGemini;
        if (autoCopyToggle) autoCopyToggle.checked = items.autoCopy;
        if (citationModeRadios) {
            citationModeRadios.forEach(radio => {
                radio.checked = (radio.value === items.citationMode);
            });
        }
        // Populate Full Mode Abbreviation Style Radios
        if (fullModeAbbrStyleRadios) {
             fullModeAbbrStyleRadios.forEach(radio => {
                radio.checked = (radio.value === items.fullModeAbbrStyle);
            });
        }
        // Populate PPT Mode Abbreviation Style Radios
        if (pptModeAbbrStyleRadios) {
             pptModeAbbrStyleRadios.forEach(radio => {
                radio.checked = (radio.value === items.pptModeAbbrStyle);
            });
        }

        // Populate Custom Abbreviations Textarea
        if (customAbbreviationsArea) {
            try {
                customAbbreviationsArea.value = JSON.stringify(items.customAbbreviations || {}, null, 2);
            } catch (e) {
                console.error("Error stringifying custom abbreviations:", e);
                customAbbreviationsArea.value = '{}';
            }
        }
    });
}

// --- Save General Configuration Settings ---
function saveConfigSettings() {
    // Ensure all required elements exist
    if (!apiKeyInput || !useGeminiToggle || !autoCopyToggle || !citationModeRadios || !fullModeAbbrStyleRadios || !pptModeAbbrStyleRadios) {
         console.error("Cannot save, one or more config elements missing.");
         showStatus("Error: Config elements missing.", true, 5000);
         return;
    }
    // Read values from form elements
    const apiKey = apiKeyInput.value.trim();
    const useGemini = useGeminiToggle.checked;
    const autoCopy = autoCopyToggle.checked;
    let citationMode = 'full';
    citationModeRadios.forEach(radio => { if (radio.checked) citationMode = radio.value; });
    let fullModeAbbrStyle = 'standard';
    fullModeAbbrStyleRadios.forEach(radio => { if (radio.checked) fullModeAbbrStyle = radio.value; });
    let pptModeAbbrStyle = 'short';
    pptModeAbbrStyleRadios.forEach(radio => { if (radio.checked) pptModeAbbrStyle = radio.value; });


    // Prepare settings object for general config
    const settingsToSave = {
        geminiApiKey: apiKey,
        useGemini: useGemini,
        autoCopy: autoCopy,
        citationMode: citationMode,
        fullModeAbbrStyle: fullModeAbbrStyle, // Save full mode style
        pptModeAbbrStyle: pptModeAbbrStyle    // Save PPT mode style
    };

    console.log("Attempting to save general settings:", settingsToSave);
    chrome.storage.sync.set(settingsToSave, () => {
        if (chrome.runtime.lastError) {
            console.error("Error saving general settings:", chrome.runtime.lastError);
            showStatus(`Error saving settings: ${chrome.runtime.lastError.message}`, true, 5000);
        } else {
            console.log("General settings saved successfully.");
            showStatus("General Settings Saved!", false);
        }
    });
}

// --- Save Custom Abbreviations ---
function saveCustomAbbreviations() {
    if (!customAbbreviationsArea) {
        console.error("Custom abbreviations textarea not found.");
        showStatus("Error: Textarea element missing.", true, 5000, customAbbrStatus);
        return;
    }

    const jsonString = customAbbreviationsArea.value.trim();
    let abbreviationsObject = {};

    if (!jsonString) {
         console.log("Custom abbreviations input is empty. Saving empty object.");
         abbreviationsObject = {};
    } else {
        try {
            abbreviationsObject = JSON.parse(jsonString);
            if (typeof abbreviationsObject !== 'object' || abbreviationsObject === null || Array.isArray(abbreviationsObject)) {
                throw new Error("Input must be a valid JSON object (key-value pairs).");
            }
            console.log("Parsed custom abbreviations:", abbreviationsObject);
        } catch (e) {
            console.error("Error parsing custom abbreviations JSON:", e);
            showStatus(`Invalid JSON: ${e.message}`, true, 5000, customAbbrStatus);
            return;
        }
    }

    // Save only the customAbbreviations part
    chrome.storage.sync.set({ customAbbreviations: abbreviationsObject }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error saving custom abbreviations:", chrome.runtime.lastError);
            showStatus(`Error saving: ${chrome.runtime.lastError.message}`, true, 5000, customAbbrStatus);
        } else {
            console.log("Custom abbreviations saved successfully.");
            showStatus("Custom Abbreviations Saved!", false, 3000, customAbbrStatus);
            // Re-format the textarea content
            customAbbreviationsArea.value = JSON.stringify(abbreviationsObject, null, 2);
        }
    });
}


// --- Initialize Options Page ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Options page DOM fully loaded.");

    // Assign DOM elements
    apiKeyInput = document.getElementById('api-key-input');
    useGeminiToggle = document.getElementById('use-gemini-toggle');
    autoCopyToggle = document.getElementById('auto-copy-toggle');
    citationModeRadios = document.querySelectorAll('input[name="citation-mode"]');
    fullModeAbbrStyleRadios = document.querySelectorAll('input[name="full-mode-abbr-style"]'); // Get new radios
    pptModeAbbrStyleRadios = document.querySelectorAll('input[name="ppt-mode-abbr-style"]');   // Get new radios
    saveConfigButton = document.getElementById('save-config-button');
    statusMessage = document.getElementById('status-message');
    tabConfigButton = document.getElementById('tab-config-button');
    tabCustomAbbrButton = document.getElementById('tab-custom-abbr-button');
    tabAboutButton = document.getElementById('tab-about-button');
    tabConfigContent = document.getElementById('tab-config-content');
    tabCustomAbbrContent = document.getElementById('tab-custom-abbr-content');
    tabAboutContent = document.getElementById('tab-about-content');
    extensionVersionSpan = document.getElementById('extension-version');
    customAbbreviationsArea = document.getElementById('custom-abbreviations-area');
    saveCustomAbbrButton = document.getElementById('save-custom-abbr-button');
    customAbbrStatus = document.getElementById('custom-abbr-status');


    // Basic check if critical elements were found
    if (!saveConfigButton || !statusMessage || !tabConfigButton || !tabCustomAbbrButton || !tabAboutButton || !tabConfigContent || !tabCustomAbbrContent || !tabAboutContent || !extensionVersionSpan || !customAbbreviationsArea || !saveCustomAbbrButton || !customAbbrStatus || !fullModeAbbrStyleRadios || !pptModeAbbrStyleRadios) {
        console.error("One or more required elements not found in options.html!");
        if (statusMessage) showStatus("Error: Page elements missing. Cannot initialize options.", true, 0);
        return;
    }

    // Load settings into the form
    loadSettings();

    // Display extension version
    try {
        const manifest = chrome.runtime.getManifest();
        extensionVersionSpan.textContent = manifest.version || 'N/A';
    } catch (e) {
        console.error("Could not get manifest version:", e);
        extensionVersionSpan.textContent = 'Error';
    }

    // Set up event listeners
    saveConfigButton.addEventListener('click', saveConfigSettings);
    saveCustomAbbrButton.addEventListener('click', saveCustomAbbreviations);
    tabConfigButton.addEventListener('click', () => switchTab('config'));
    tabCustomAbbrButton.addEventListener('click', () => switchTab('custom-abbr'));
    tabAboutButton.addEventListener('click', () => switchTab('about'));


    console.log("Options page initialized.");
});
