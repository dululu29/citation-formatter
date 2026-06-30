# Citation Formatter Chrome Extension

## Description

Effortlessly format citations from IEEE Xplore, arXiv, and MDPI. This tool extracts metadata and generates citations using the currently selected citation styles, including standard abbreviations, simplest abbreviations, custom abbreviations, or no abbreviation. Optionally leverages Gemini AI for unknown abbreviations and auto-copies results.

## Features

* **Fetches Citations:** Automatically extracts metadata from active IEEE Xplore, arXiv, and MDPI tabs.
* **Multiple Citation Styles:** Display one or more selected citation styles in the popup.
* **Configurable Abbreviations:**
    * **No Abbreviation**
    * **Standard Abbreviation**
    * **Simplest Abbreviation**
    * **Custom Abbreviation List**
* **Custom Abbreviations:** Manage your own list of publication abbreviations via JSON in the options page.
* **Optional Gemini Suggestions:** If enabled and an API key is provided, uses Google Gemini to suggest abbreviations for unknown publications. Falls back to built-in logic if disabled or unavailable.
* **Auto-Copy:** Optionally copies the first selected citation style to the clipboard automatically.
* **Manual Copy:** Provides copy buttons within the popup for each displayed citation.
* **User-Friendly Popup:** Displays status, formatted citations, and copy buttons.
* **Configurable Options Page:** Allows customization of API keys, abbreviation styles, auto-copy behavior, and custom abbreviations.

## Supported Websites

* IEEE Xplore (`ieeexplore.ieee.org/document/...`)
* arXiv (`arxiv.org/abs/...`, `arxiv.org/pdf/...`)
* MDPI (`*.mdpi.com/...`)

## Installation (from Chrome Web Store)

*(This section applies after the extension is published)*

1.  Go to the [Citation Formatter Extension Page](<YOUR_CHROME_STORE_LINK_HERE>) on the Chrome Web Store.
    * *(Note: Replace `<YOUR_CHROME_STORE_LINK_HERE>` with the actual link once published)*
2.  Click the "Add to Chrome" button.
3.  Review the permissions and click "Add extension" in the confirmation dialog.
4.  The extension icon will appear in your Chrome toolbar (you might need to click the puzzle piece icon to pin it).

## Installation (from source for development)

1.  **Clone or Download:** Get the extension files from the repository.
2.  **Build CSS:** If you've made changes to Tailwind classes or configuration, you need to build the CSS:
    ```bash
    # Install dependencies (if you haven't already)
    npm install
    # Run the build command defined in package.json
    npm run build
    ```
    This will generate the `dist/output.css` file.
3.  **Load Extension in Chrome:**
    * Open Chrome and navigate to `chrome://extensions/`.
    * Enable "Developer mode" (usually a toggle in the top right).
    * Click "Load unpacked".
    * Select the directory containing the extension files (including the `manifest.json`).

## Configuration

Access the extension's settings by:

1.  Navigating to `chrome://extensions/` in your Chrome browser.
2.  Finding the "Citation Formatter" extension card.
3.  Clicking the "Details" button.
4.  Scrolling down and clicking "Extension options".

**Available Options:**

* **Configuration Tab:**
    * **Gemini API Key:** (Optional) Enter your Google AI Studio API key if you want to use Gemini for abbreviation suggestions.
    * **Use Gemini:** Enable/disable the Gemini suggestion feature.
    * **Automatically Copy Citation:** Enable/disable automatic copying to the clipboard.
    * **Citation Styles:** Select one or more styles to display in the popup (No Abbreviation, Standard Abbreviation, Simplest Abbreviation, Custom List).
* **Custom Abbreviations Tab:**
    * Manage your custom list of abbreviations in JSON format (e.g., `{"Full Journal Name": "My Abbr"}`).
    * Save your custom list. This list is used when "Custom List" is selected in the configuration tab.
* **About Tab:** Shows the extension version and copyright information.

## Usage

1.  Navigate to a supported IEEE Xplore, arXiv, or MDPI article page.
2.  Click the "Citation Formatter" icon in your Chrome toolbar (you may need to pin it first using the puzzle icon).
3.  The popup will appear, showing the status ("Fetching citation...").
4.  Once fetched, the citation(s) will be displayed according to your selected citation style settings.
5.  If "Auto-Copy" is enabled, the first selected citation style will be copied to your clipboard automatically.
6.  You can manually copy any displayed citation using the copy buttons next to each citation area.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues. (Add more specific contribution guidelines if desired).


