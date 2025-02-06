<h1 align="center">Welcome to i.J.E.T.T: i18n's JSON/Excel Tool for Translation</h1>
<h2 align="center">Setup guide </h2>

<p align="left">In the following guide, I'm going to guide you step-by-step through the setup and use of this tool.</p>
Things you will need: VSCode and basic knowledge of javascript.
<p align="left">NOTE: This tool was originally thought to work with the JSON files used in the i18n locales typically used in VUE.js projects, especially using Vuetify. Feel free, however, to adjust the code to your needs as it can be pretty flexible, as you are about to see for yourself.</p>

<h3 align="left">STEP 1</h3>
<p align="left">Clone this repository.</p>

<h3 align="left">STEP 2</h3>
<p align="left">You will need a Google Cloud API key for this tool to work Once you have it, create a <code>config.json</code> file inside the cloned folder with the following structure:</p>

config.json:
`
{
"apiKey": "YOUR KEY HERE"
}`

<h3 align="left">STEP 3</h3> 
<p align="left">In the <code>jsonToXlsx.js</code> file, inside the <code>jsonToExcelWithTranslation</code> function, add entries to the <code>category</code> array AFTER the <code>"languages"</code> entry, or according to the structure of your JSON file (e.g., <code>labels</code>, <code>strings</code>, and <code>errors</code> in the case of our <code>example.json</code> file).</p>

<h3 align="left">STEP 4</h3> <p align="left">Ensure that the JSON file you want to import contains a <code>languages</code> object with the correct ISO codes for each language you want to translate. For example:</p>

`
"languages": {
"en": "English",
"el": "Greek",
"it": "Italiano",
"fr": "Français",
"de": "Deutsch",
"es": "Español",
"pt": "Português",
"nl": "Nederlands"
}`

<p align="left"><strong>Note:</strong> The values of the keys do not matter, but make sure that the ISO codes in the keys are written correctly! Here is a guide you can consult: <a href="https://www.lexilab.it/conosci-codici-che-identificano-le-lingue/">ISO Language Codes Guide</a>.</p>

<h3 align="left">STEP 5</h3> <p align="left">Go live with VS Code using the Live Server extension or any other method you prefer.</p>

<h3 align="left">Convert JSON to XLSX</h3> <p align="left">Import your JSON and Excel files and watch the magic happen! 🪄✨</p><p align="left"><strong>Note:</strong> If the JSON file contains many entries, it might take a few minutes. Be patient and check the network tab in your browser's developer tools to ensure that the calls to the Google Translation API are successful.</p>

<h3 align="left">Convert XLSX to JSON</h3> <p align="left">Simply import the previously created file. When it's done, it will make you download a single JSON file for each language sheet you had inside .xlsx file.</p>
