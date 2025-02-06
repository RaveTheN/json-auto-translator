document.getElementById("EXCELfileInput").addEventListener("change", handleExcelUpload);

function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Process each sheet and create a JSON file
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Convert the sheet data into structured JSON format
      const structuredData = processSheetData(jsonData);

      // Download the generated JSON file
      saveJsonToFile(structuredData, `${sheetName.toLowerCase()}.json`);
    });
  };
  reader.readAsArrayBuffer(file);
}

function processSheetData(sheetData) {
  let jsonOutput = { labels: {}, strings: {}, errors: {} };

  sheetData.forEach((row) => {
    const category = row["Category"] || "labels"; // Default to "labels"
    const key = row["Key"];
    const value = row["Value"];

    if (key && key !== "(empty)") {
      jsonOutput[category][key] = value;
    }
  });

  return jsonOutput;
}

// Function to trigger JSON file download
function saveJsonToFile(jsonData, filename) {
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
