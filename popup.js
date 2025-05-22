// popup.js

// --- Global DOM Element References ---
let loadingIndicatorElement, statusMessageElement, statusContainerElement,
    citationsDisplayAreaElement;

// --- Helper: Copy to Clipboard & Provide Feedback ---
async function copyToClipboard(text, buttonElement) {
    if (!text || !buttonElement) return;
    try {
        await navigator.clipboard.writeText(text);
        console.log('Copied:', text);

        // Reset all other copy buttons' states first
        document.querySelectorAll('.copy-button').forEach(btn => {
            btn.classList.remove('copied');
            const ci = btn.querySelector('.copy-icon-svg');
            const cki = btn.querySelector('.check-icon-svg');
            if (ci) ci.classList.remove('hidden');
            if (cki) cki.classList.add('hidden');
        });

        // Set copied state for the clicked button
        const copyIcon = buttonElement.querySelector('.copy-icon-svg');
        const checkIcon = buttonElement.querySelector('.check-icon-svg');

        if (copyIcon && checkIcon) {
            copyIcon.classList.add('hidden');
            checkIcon.classList.remove('hidden');
            buttonElement.classList.add('copied');

            setTimeout(() => {
                copyIcon.classList.remove('hidden');
                checkIcon.classList.add('hidden');
                buttonElement.classList.remove('copied');
            }, 1500);
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
        if (statusMessageElement && statusContainerElement) {
            statusMessageElement.textContent = 'Copy failed!';
            statusMessageElement.classList.remove('hidden');
            statusContainerElement.className = 'text-xs mb-3 p-2 rounded-md bg-red-100 text-red-700 font-medium';
            if (loadingIndicatorElement) loadingIndicatorElement.classList.add('hidden');
        }
    }
}

// --- Display Management Functions ---
function showLoadingState(message) {
    if (!loadingIndicatorElement || !statusMessageElement || !statusContainerElement || !citationsDisplayAreaElement) {
        console.error("showLoadingState: UI elements missing");
        return;
    }
    loadingIndicatorElement.classList.remove('hidden');
    const loadingMessageSpan = loadingIndicatorElement.querySelector('span');
    if (loadingMessageSpan) loadingMessageSpan.textContent = message || "Fetching citation...";

    statusMessageElement.classList.add('hidden');
    statusContainerElement.className = 'text-xs mb-3 p-2 rounded-md bg-blue-100 text-blue-700';
    citationsDisplayAreaElement.innerHTML = '';
    citationsDisplayAreaElement.classList.add('hidden');
}

function showFinalStatus(message, isError = false) {
    if (!loadingIndicatorElement || !statusMessageElement || !statusContainerElement) return;
    if (loadingIndicatorElement) loadingIndicatorElement.classList.add('hidden');

    statusMessageElement.textContent = message;
    statusMessageElement.classList.remove('hidden');
    if (isError) {
        statusContainerElement.className = 'text-xs mb-3 p-2 rounded-md bg-red-100 text-red-700 font-medium';
    } else if (message && message.includes("Copied")) {
        statusContainerElement.className = 'text-xs mb-3 p-2 rounded-md bg-green-100 text-green-700 font-medium';
    } else {
        statusContainerElement.className = 'text-xs mb-3 p-2 rounded-md bg-blue-100 text-blue-600 font-medium';
    }
}

function getStyleFriendlyName(styleKey) {
    switch (styleKey) {
        case 'no_abbr': return 'No Abbreviation';
        case 'standard_abbr': return 'Standard Abbreviation';
        case 'simplest_abbr': return 'Simplest Abbreviation';
        case 'custom_list_abbr': return 'Custom List';
        default:
            return styleKey.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }
}

function renderCitations(citationsArray, autoCopyEnabled, preferredStyleOrder) {
    if (!citationsDisplayAreaElement) {
        showFinalStatus("Error: Citation display area not found.", true);
        return;
    }
    citationsDisplayAreaElement.innerHTML = ''; // Clear previous content

    if (!citationsArray || citationsArray.length === 0) {
        showFinalStatus("No citation formats generated or selected.", false);
        return;
    }

    let textToAutoCopy = null;
    let autoCopiedStyleName = '';
    const primaryAutoCopyStyleKey = preferredStyleOrder && preferredStyleOrder.length > 0 ? preferredStyleOrder[0] : 'standard_abbr';

    citationsArray.forEach((citationObj, index) => {
        const { styleKey, citationText, suggestionError } = citationObj;

        const wrapper = document.createElement('div');
        wrapper.className = 'bg-white p-3 rounded-md shadow border border-gray-200';

        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-1.5 relative'; // Added 'relative' for copy button positioning
        wrapper.appendChild(header);

        const label = document.createElement('span');
        label.className = 'text-xs font-semibold text-indigo-600';
        label.textContent = getStyleFriendlyName(styleKey);
        header.appendChild(label);

        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'copy-button'; // This class is styled in popup.html <style>
        copyButton.title = `Copy ${getStyleFriendlyName(styleKey)}`;
        copyButton.innerHTML = `
            <svg class="copy-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625-2.25-2.25m0 0L15.75 15m-2.25 2.25V15"></path></svg>
            <svg class="check-icon-svg hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>
        `;
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(citationText.replace(/<[^>]*>?/gm, ''), copyButton);
        });
        header.appendChild(copyButton);

        const textarea = document.createElement('textarea');
        textarea.readOnly = true;
        // Applying consistent styling, similar to .citation-display from your original popup.html
        textarea.className = 'w-full p-2 text-xs font-mono border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none overflow-hidden bg-gray-50 mt-1';
        textarea.value = citationText;
        wrapper.appendChild(textarea);

        textarea.style.boxSizing = 'border-box';
        textarea.style.height = 'auto';
        requestAnimationFrame(() => {
            textarea.style.height = (textarea.scrollHeight + 3) + 'px';
        });

        if (suggestionError && suggestionError.trim()) {
            const errorP = document.createElement('p');
            errorP.className = 'mt-1 text-xs text-orange-600';
            errorP.textContent = suggestionError.trim();
            wrapper.appendChild(errorP);
        }
        citationsDisplayAreaElement.appendChild(wrapper);

        // Determine text for auto-copy
        if (styleKey === primaryAutoCopyStyleKey && textToAutoCopy === null) {
            textToAutoCopy = citationText;
            autoCopiedStyleName = getStyleFriendlyName(styleKey);
        }
        if (index === 0 && textToAutoCopy === null) { // Fallback to the very first if preferred not found
            textToAutoCopy = citationText;
            autoCopiedStyleName = getStyleFriendlyName(styleKey);
        }
    });

    citationsDisplayAreaElement.classList.remove('hidden');

    let finalStatusMsg = "Citation(s) displayed.";
    if (autoCopyEnabled && textToAutoCopy) {
        const plainText = textToAutoCopy.replace(/<[^>]*>?/gm, '');
        navigator.clipboard.writeText(plainText)
            .then(() => {
                console.log('Auto-copied:', plainText);
                showFinalStatus(`Copied ${autoCopiedStyleName}!`);
                // Visual feedback for the auto-copied item's button
                const buttons = citationsDisplayAreaElement.querySelectorAll('.copy-button');
                buttons.forEach(btn => {
                    const labelEl = btn.closest('.bg-white').querySelector('.text-indigo-600');
                    if (labelEl && labelEl.textContent === autoCopiedStyleName) {
                        // Trigger 'copied' state for this button
                        const copyIcon = btn.querySelector('.copy-icon-svg');
                        const checkIcon = btn.querySelector('.check-icon-svg');
                        if (copyIcon && checkIcon) {
                            copyIcon.classList.add('hidden');
                            checkIcon.classList.remove('hidden');
                            btn.classList.add('copied');
                            setTimeout(() => {
                                copyIcon.classList.remove('hidden');
                                checkIcon.classList.add('hidden');
                                btn.classList.remove('copied');
                            }, 1500);
                        }
                    }
                });
            })
            .catch(err => {
                console.error('Auto-copy failed: ', err);
                showFinalStatus('Auto-copy failed.', true);
            });
    } else if (autoCopyEnabled) {
        showFinalStatus('Nothing chosen to auto-copy.');
    } else {
        showFinalStatus(finalStatusMsg);
    }
}


// --- Main Logic ---
document.addEventListener('DOMContentLoaded', async () => {
    loadingIndicatorElement = document.getElementById('loading-indicator');
    statusMessageElement = document.getElementById('status-message');
    statusContainerElement = document.getElementById('status-container');
    citationsDisplayAreaElement = document.getElementById('citations-display-area');

    if (!loadingIndicatorElement || !statusMessageElement || !statusContainerElement || !citationsDisplayAreaElement) {
        console.error("Popup critical UI elements not found! Check IDs in popup.html and popup.js.");
        if (document.body) { // Basic fallback if critical elements are missing
            document.body.innerHTML = '<p style="color: red; padding: 10px;">Error: Popup UI failed to initialize. Check console.</p>';
        }
        return;
    }

    showLoadingState("Fetching citation...");

    try {
        const settings = await chrome.storage.sync.get({
            autoCopy: true,
            citationStyles: ['standard_abbr'] // Default matches options.js
        });
        console.log("Popup settings:", settings);

        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs || tabs.length === 0 || !tabs[0].url) {
            showFinalStatus("Cannot access current tab URL.", true); return;
        }
        const url = tabs[0].url;

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            showFinalStatus("Works on http/https pages only.", false); return;
        }
        const isIeee = url.includes('ieeexplore.ieee.org/document/');
        const isArxiv = url.includes('arxiv.org/abs/') || url.includes('arxiv.org/pdf/');
        const isMdpi = url.includes('mdpi.com/');
        if (!isIeee && !isArxiv && !isMdpi) {
            showFinalStatus("Unsupported site. Use on IEEE, arXiv, or MDPI.", false); return;
        }

        console.log("Sending fetchCitation to background for URL:", url);
        const response = await chrome.runtime.sendMessage({ action: 'fetchCitation', url: url });

        if (chrome.runtime.lastError) {
            throw new Error(`Communication error: ${chrome.runtime.lastError.message || 'Unknown'}`);
        }
        if (!response) {
            throw new Error("No response from background script.");
        }
        console.log("Response from background:", response);

        if (response.success) {
            if (response.citations && response.citations.length > 0) {
                renderCitations(response.citations, settings.autoCopy, settings.citationStyles);
            } else {
                showFinalStatus("No citation data received or no styles selected.", false);
            }
        } else {
            showFinalStatus(response.error || "Unknown error fetching citation.", true);
        }
    } catch (error) {
        console.error('Error in popup execution:', error, error.stack);
        showFinalStatus(`Error: ${error.message}`, true);
    }
});