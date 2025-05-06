// --- Global DOM Element References ---
let loadingIndicator, statusMessage, statusContainer,
    citationOutput, fullCitationArea, copyFullButton,
    pptOutput, pptCitationArea, copyPptButton;

// --- Helper: Copy to Clipboard & Provide Feedback ---
async function copyToClipboard(text, buttonElement) {
    if (!text || !buttonElement) return;

    try {
        await navigator.clipboard.writeText(text);
        console.log('Copied:', text);

        // Visual feedback on the button
        const copyIcon = buttonElement.querySelector('svg:not(.hidden)'); // Get the visible icon
        const checkIcon = buttonElement.querySelector('svg.hidden');    // Get the hidden check icon

        if (copyIcon && checkIcon) {
            copyIcon.classList.add('hidden');
            checkIcon.classList.remove('hidden');
            buttonElement.classList.add('copied'); // Add green style

            // Revert after a short delay
            setTimeout(() => {
                copyIcon.classList.remove('hidden');
                checkIcon.classList.add('hidden');
                buttonElement.classList.remove('copied'); // Remove green style
            }, 1500); // Revert after 1.5 seconds
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
        // Optional: Show error state on button or status message
        statusMessage.textContent = 'Copy failed!';
        statusMessage.classList.remove('hidden');
        statusContainer.classList.add('text-red-600');
        statusContainer.classList.remove('text-green-600', 'text-blue-600', 'text-gray-700');
    }
}


// --- Helper: Update Status and Display Citations ---
function updateDisplay(message, isLoading = false, isError = false, citationData = null, citationMode = 'full') {
    // Ensure all elements are available
    if (!loadingIndicator || !statusMessage || !statusContainer || !citationOutput || !fullCitationArea || !copyFullButton || !pptOutput || !pptCitationArea || !copyPptButton) {
        console.error("One or more UI elements not ready or not found!");
        if (statusMessage && statusContainer) {
             statusMessage.textContent = "Error: Popup UI elements missing.";
             statusMessage.classList.remove('hidden');
             statusContainer.classList.remove('text-indigo-600', 'text-green-600', 'text-red-600', 'text-blue-600', 'text-gray-700');
             statusContainer.classList.add('text-red-600');
             if(loadingIndicator) loadingIndicator.classList.add('hidden');
        }
        return;
    }

    // Toggle loading indicator
    loadingIndicator.classList.toggle('hidden', !isLoading);
    statusMessage.classList.toggle('hidden', isLoading);

    // Hide citation areas initially
    fullCitationArea.classList.add('hidden');
    pptCitationArea.classList.add('hidden');
    citationOutput.value = '';
    pptOutput.textContent = '';

    if (!isLoading) {
        // Update status message text and color (excluding copy success/fail, handled by copy function)
        statusMessage.textContent = message;
        statusContainer.classList.remove('text-indigo-600', 'text-green-600', 'text-red-600', 'text-blue-600', 'text-gray-700');
        if (isError) statusContainer.classList.add('text-red-600');
        else if (message.includes('Fetched') || message.includes('Shown')) statusContainer.classList.add('text-blue-600');
        else statusContainer.classList.add('text-gray-700');

        // Display citations based on mode and data availability
        if (citationData) {
            if (citationMode === 'full' && citationData.full) {
                citationOutput.value = citationData.full;
                fullCitationArea.classList.remove('hidden');
                // Adjust textarea height dynamically (simple approach)
                citationOutput.style.height = 'auto'; // Reset height
                citationOutput.style.height = (citationOutput.scrollHeight + 2) + 'px'; // Set to scroll height + border
            } else if (citationMode === 'ppt' && citationData.ppt) {
                // Display PPT format in the main textarea if it's the *only* mode
                citationOutput.value = citationData.ppt;
                fullCitationArea.classList.remove('hidden');
                fullCitationArea.querySelector('label').textContent = "PowerPoint Citation:"; // Change label
                // Adjust textarea height
                citationOutput.style.height = 'auto';
                citationOutput.style.height = (citationOutput.scrollHeight + 2) + 'px';
            } else if (citationMode === 'both') {
                if (citationData.full) {
                    citationOutput.value = citationData.full;
                    fullCitationArea.classList.remove('hidden');
                    fullCitationArea.querySelector('label').textContent = "Full Citation:"; // Ensure correct label
                    // Adjust textarea height
                    citationOutput.style.height = 'auto';
                    citationOutput.style.height = (citationOutput.scrollHeight + 2) + 'px';
                }
                if (citationData.ppt) {
                    pptOutput.textContent = citationData.ppt;
                    pptCitationArea.classList.remove('hidden');
                }
            }
        }
    }
}

// --- Main Logic ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Popup DOM fully loaded.");

    // Assign elements
    loadingIndicator = document.getElementById('loading-indicator');
    statusMessage = document.getElementById('status-message');
    statusContainer = document.getElementById('status-container');
    citationOutput = document.getElementById('citation-output');
    fullCitationArea = document.getElementById('full-citation-area');
    copyFullButton = document.getElementById('copy-full-button');
    pptOutput = document.getElementById('ppt-output');
    pptCitationArea = document.getElementById('ppt-citation-area');
    copyPptButton = document.getElementById('copy-ppt-button');

    // Initial state: Loading
    updateDisplay("Fetching citation...", true);

    try {
        // 1. Get settings
        const settings = await chrome.storage.sync.get({ autoCopy: true, citationMode: 'full' });
        const autoCopyEnabled = settings.autoCopy;
        const citationMode = settings.citationMode;
        console.log("Settings - Auto-copy:", autoCopyEnabled, "Mode:", citationMode);

        // 2. Get the current active tab URL
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs || tabs.length === 0 || !tabs[0].url) throw new Error("Cannot access current tab URL.");
        const url = tabs[0].url;
        console.log("Current URL:", url);

        // 3. Check URL support
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            updateDisplay("Please open an IEEE Xplore or arXiv article.", false, false, null, citationMode); return;
        }
        const isIeee = url.includes('ieeexplore.ieee.org/document/');
        const isArxiv = url.includes('arxiv.org/abs/') || url.includes('arxiv.org/pdf/');
        if (!isIeee && !isArxiv) {
            updateDisplay("Website not supported. Open IEEE Xplore or arXiv.", false, false, null, citationMode); return;
        }

        // 4. Send message to background
        console.log("Sending fetchCitation message to background...");
        const response = await chrome.runtime.sendMessage({ action: 'fetchCitation', url: url });

        // Handle communication errors
        if (chrome.runtime.lastError) throw new Error(`Communication error: ${chrome.runtime.lastError.message || 'Unknown'}`);
        if (!response) throw new Error("No response from background script.");
        console.log("Received response from background:", response);

        // 5. Handle the response
        if (response.success && response.citation) {
            const citationData = response.citation;
            let baseStatusMessage = "Citation Fetched."; // Default status

            // Determine text for auto-copy
            let textToAutoCopy = null;
            if (autoCopyEnabled && citationData.full) textToAutoCopy = citationData.full;
            else if (autoCopyEnabled && citationMode === 'ppt' && citationData.ppt) textToAutoCopy = citationData.ppt;

            // Perform auto-copy if applicable
            if (textToAutoCopy) {
                try {
                    await navigator.clipboard.writeText(textToAutoCopy);
                    console.log("Auto-copied:", textToAutoCopy);
                    baseStatusMessage = "Citation Copied!"; // Update status only if auto-copy succeeds
                } catch (copyError) {
                    console.error('Auto-copy failed: ', copyError);
                    baseStatusMessage = "Auto-copy failed."; // Indicate failure
                    // Don't mark as error, just inform
                }
            } else if (autoCopyEnabled) {
                 baseStatusMessage = "Nothing to auto-copy.";
            } else {
                 baseStatusMessage = "Citation Shown.";
            }

            // Display citations and final status
            updateDisplay(baseStatusMessage, false, false, citationData, citationMode);

            // Add suggestion error to status if present
            if(citationData.suggestionError && !statusMessage.textContent.includes('Suggestion Error')) {
                 statusMessage.textContent += citationData.suggestionError;
            }

            // Add event listeners for manual copy buttons *after* content is populated
            if (copyFullButton && citationData.full) {
                 copyFullButton.addEventListener('click', () => copyToClipboard(citationData.full, copyFullButton));
            }
            if (copyPptButton && citationData.ppt) {
                 copyPptButton.addEventListener('click', () => copyToClipboard(citationData.ppt, copyPptButton));
            }

        } else {
            // Handle errors reported by the background script
            throw new Error(response.error || "Unknown error fetching citation.");
        }
    } catch (error) {
        console.error('Error in popup execution:', error);
        updateDisplay(`Error: ${error.message}`, false, true, null, 'full'); // Show error state
    }
});
