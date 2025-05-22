// --- Global DOM Element References ---
let apiKeyInput, useGeminiToggle, autoCopyToggle,
    citationStyleCheckboxes,
    saveConfigButton, statusMessage,
    tabConfigButton, tabCustomAbbrButton, tabAboutButton,
    tabConfigContent, tabCustomAbbrContent, tabAboutContent,
    extensionVersionSpan,
    customAbbreviationsArea, saveCustomAbbrButton, customAbbrStatus,
    customListDisabledNoteSpan;

// --- Helper function to display status messages ---
function showStatus(message, isError = false, duration = 3000, targetElement = statusMessage) {
    if (!targetElement) {
        console.error("Status message target element not found!");
        return;
    }
    targetElement.textContent = message;
    targetElement.classList.remove('opacity-0', 'text-green-600', 'text-red-600', 'text-gray-500'); // Reset classes
    targetElement.classList.add(isError ? 'text-red-600' : 'text-green-600');
    targetElement.classList.remove('opacity-0'); // Ensure it's visible

    if (duration > 0) {
        setTimeout(() => {
            if (targetElement) targetElement.classList.add('opacity-0');
        }, duration);
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
        citationStyles: ['standard_abbr'], // Default: an array with 'standard_abbr'
        customAbbreviations: {}
    };

    chrome.storage.sync.get(defaultSettings, (items) => {
        if (chrome.runtime.lastError) {
            console.error("Error loading settings:", chrome.runtime.lastError);
            showStatus("Error loading settings.", true, 5000);
            return;
        }
        console.log("Settings loaded:", items);
        if (apiKeyInput) apiKeyInput.value = items.geminiApiKey || '';
        if (useGeminiToggle) useGeminiToggle.checked = items.useGemini;
        if (autoCopyToggle) autoCopyToggle.checked = items.autoCopy;

        if (citationStyleCheckboxes) {
            const loadedStyles = Array.isArray(items.citationStyles) ? items.citationStyles : defaultSettings.citationStyles;
            citationStyleCheckboxes.forEach(checkbox => {
                // Ensure checkbox.value matches the values in your HTML (e.g., 'no_abbr', 'standard_abbr')
                checkbox.checked = loadedStyles.includes(checkbox.value);
            });
        }

        if (customAbbreviationsArea) {
            try {
                customAbbreviationsArea.value = JSON.stringify(items.customAbbreviations || {}, null, 2);
            } catch (e) {
                console.error("Error stringifying custom abbreviations:", e);
                customAbbreviationsArea.value = '{}';
            }
        }

        const customListCheckbox = document.getElementById('style-custom-list-abbr');
        if (customListCheckbox && customListDisabledNoteSpan) {
            if (Object.keys(items.customAbbreviations || {}).length === 0) {
                customListCheckbox.disabled = true;
                customListCheckbox.checked = false;
                customListDisabledNoteSpan.classList.remove('hidden');
            } else {
                customListCheckbox.disabled = false;
                customListDisabledNoteSpan.classList.add('hidden');
            }
        }
    });
}

// --- Save General Configuration Settings ---
function saveConfigSettings() {
    // REMOVED check for citationModeRadios, ADDED check for citationStyleCheckboxes
    if (!apiKeyInput || !useGeminiToggle || !autoCopyToggle || !citationStyleCheckboxes) {
        console.error("Cannot save, one or more config elements missing.");
        showStatus("Error: Config elements missing.", true, 5000);
        return;
    }

    const apiKey = apiKeyInput.value.trim();
    const useGemini = useGeminiToggle.checked;
    const autoCopy = autoCopyToggle.checked;

    const selectedStyles = [];
    citationStyleCheckboxes.forEach(checkbox => {
        if (checkbox.checked && !checkbox.disabled) { // Only add if checked and not disabled
            selectedStyles.push(checkbox.value);
        }
    });
    // Ensure at least one style is selected, or default
    if (selectedStyles.length === 0) {
        selectedStyles.push('standard_abbr'); // Default if nothing is selected
        // Optionally, re-check the default checkbox visually
        const defaultCheckbox = document.getElementById('style-standard-abbr');
        if (defaultCheckbox) defaultCheckbox.checked = true;
    }


    const settingsToSave = {
        geminiApiKey: apiKey,
        useGemini: useGemini,
        autoCopy: autoCopy,
        citationStyles: selectedStyles // CHANGED to save array
    };

    console.log("Attempting to save general settings:", settingsToSave);
    chrome.storage.sync.set(settingsToSave, () => {
        if (chrome.runtime.lastError) {
            console.error("Error saving general settings:", chrome.runtime.lastError);
            showStatus(`Error saving settings: ${chrome.runtime.lastError.message}`, true, 5000);
        } else {
            console.log("General settings saved successfully.");
            showStatus("General Settings Saved!", false);
            // Reflect the "Custom List" checkbox state immediately after save if abbreviations changed
            // This is better handled by loadSettings or a dedicated UI update function after custom abbr save
        }
    });
}

// --- Save Custom Abbreviations ---
function saveCustomAbbreviations() {
    if (!customAbbreviationsArea || !customAbbrStatus || !customListDisabledNoteSpan || !document.getElementById('style-custom-list-abbr')) { // Added check for customListCheckbox implicitly
        console.error("Custom abbreviations save prerequisites not found.");
        showStatus("Error: UI elements missing for custom abbreviations.", true, 5000, customAbbrStatus || statusMessage);
        return;
    }

    const jsonString = customAbbreviationsArea.value.trim();
    let parsedAbbreviationsObject = {}; // Renamed to avoid confusion with outer scope if any

    if (!jsonString) {
        console.log("Custom abbreviations input is empty. Saving empty object.");
        // parsedAbbreviationsObject remains {}
    } else {
        try {
            parsedAbbreviationsObject = JSON.parse(jsonString);
            if (typeof parsedAbbreviationsObject !== 'object' || parsedAbbreviationsObject === null || Array.isArray(parsedAbbreviationsObject)) {
                throw new Error("Input must be a valid JSON object (key-value pairs).");
            }
            console.log("Parsed custom abbreviations:", parsedAbbreviationsObject);
        } catch (e) {
            console.error("Error parsing custom abbreviations JSON:", e);
            showStatus(`Invalid JSON: ${e.message}`, true, 5000, customAbbrStatus);
            return;
        }
    }

    chrome.storage.sync.set({ customAbbreviations: parsedAbbreviationsObject }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error saving custom abbreviations:", chrome.runtime.lastError);
            showStatus(`Error saving: ${chrome.runtime.lastError.message}`, true, 5000, customAbbrStatus);
        } else {
            console.log("Custom abbreviations saved successfully.");
            showStatus("Custom Abbreviations Saved!", false, 3000, customAbbrStatus);
            if (customAbbreviationsArea) customAbbreviationsArea.value = JSON.stringify(parsedAbbreviationsObject, null, 2); // Update textarea

            // Update "Use Custom List" checkbox state using parsedAbbreviationsObject
            const customListCheckbox = document.getElementById('style-custom-list-abbr');
            if (customListCheckbox && customListDisabledNoteSpan) {
                if (Object.keys(parsedAbbreviationsObject).length === 0) {
                    customListCheckbox.disabled = true;
                    customListCheckbox.checked = false;
                    customListDisabledNoteSpan.classList.remove('hidden');
                    // If custom list becomes empty, remove 'custom_list_abbr' from saved citationStyles
                    chrome.storage.sync.get({ citationStyles: ['standard_abbr'] }, (items) => {
                        let currentStyles = items.citationStyles.filter(style => style !== 'custom_list_abbr');
                        if (currentStyles.length === 0 && items.citationStyles.includes('custom_list_abbr')) { // if it was the only one
                            currentStyles.push('standard_abbr'); // Add default back
                            const defaultCheckbox = document.getElementById('style-standard-abbr');
                            if (defaultCheckbox) defaultCheckbox.checked = true; // Visually check default
                        } else if (currentStyles.length === 0) { // If it became empty for other reasons
                            currentStyles.push('standard_abbr');
                            const defaultCheckbox = document.getElementById('style-standard-abbr');
                            if (defaultCheckbox) defaultCheckbox.checked = true;
                        }
                        chrome.storage.sync.set({ citationStyles: currentStyles });
                    });
                } else {
                    customListCheckbox.disabled = false;
                    customListDisabledNoteSpan.classList.add('hidden');
                }
            }
        }
    });
}


// --- Initialize Options Page ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Options page DOM fully loaded.");

    apiKeyInput = document.getElementById('api-key-input');
    useGeminiToggle = document.getElementById('use-gemini-toggle');
    autoCopyToggle = document.getElementById('auto-copy-toggle');
    citationStyleCheckboxes = document.querySelectorAll('input[name="citation_styles_group"]'); // Corrected name
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
    customListDisabledNoteSpan = document.getElementById('custom-list-disabled-note');

    // Robust check for all elements
    const allElementsPresent = apiKeyInput && useGeminiToggle && autoCopyToggle &&
        citationStyleCheckboxes && citationStyleCheckboxes.length > 0 && // Ensure checkboxes are found
        saveConfigButton && statusMessage &&
        tabConfigButton && tabCustomAbbrButton && tabAboutButton &&
        tabConfigContent && tabCustomAbbrContent && tabAboutContent &&
        extensionVersionSpan &&
        customAbbreviationsArea && saveCustomAbbrButton && customAbbrStatus &&
        customListDisabledNoteSpan;

    if (!allElementsPresent) {
        console.error("One or more required elements not found in options.html! Check IDs and selectors.");
        // Log which elements are missing for easier debugging
        if (!apiKeyInput) console.error("Missing: apiKeyInput");
        if (!useGeminiToggle) console.error("Missing: useGeminiToggle");
        if (!autoCopyToggle) console.error("Missing: autoCopyToggle");
        if (!citationStyleCheckboxes || citationStyleCheckboxes.length === 0) console.error("Missing or empty: citationStyleCheckboxes (selector: input[name='citation_styles_group'])");
        if (!saveConfigButton) console.error("Missing: saveConfigButton");
        if (!statusMessage) console.error("Missing: statusMessage");
        // ... add more checks if needed
        if (!customListDisabledNoteSpan) console.error("Missing: customListDisabledNoteSpan");

        if (statusMessage) showStatus("Error: Page elements missing. Cannot initialize options. Check console.", true, 0);
        return;
    }

    loadSettings();

    try {
        const manifest = chrome.runtime.getManifest();
        if (extensionVersionSpan && manifest) extensionVersionSpan.textContent = manifest.version || 'N/A';
    } catch (e) {
        console.error("Could not get manifest version:", e);
        if (extensionVersionSpan) extensionVersionSpan.textContent = 'Error';
    }

    saveConfigButton.addEventListener('click', saveConfigSettings);
    saveCustomAbbrButton.addEventListener('click', saveCustomAbbreviations);
    tabConfigButton.addEventListener('click', () => switchTab('config'));
    tabCustomAbbrButton.addEventListener('click', () => switchTab('custom-abbr'));
    tabAboutButton.addEventListener('click', () => switchTab('about'));

    console.log("Options page initialized.");
});