document.getElementById("JSONfileInput").addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const jsonData = JSON.parse(e.target.result);
      await jsonToExcelWithTranslation(jsonData);
    } catch (error) {
      console.error("Errore nella lettura del JSON:", error);
    }
  };
  reader.readAsText(file);
}

let apiKey = ""; // Variable to store the API key

// Load the API key from config.json
async function loadApiKey() {
  try {
    const response = await fetch("config.json");
    if (!response.ok) {
      throw new Error(`Failed to load config.json: ${response.statusText}`);
    }
    const config = await response.json();
    apiKey = config.apiKey;
  } catch (error) {
    console.error("Error loading API key:", error);
  }
}

async function translateText(text, targetLang) {
  if (!apiKey) {
    await loadApiKey(); // Ensure API key is loaded before making a request
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ q: text, target: targetLang, format: "text" }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Errore API: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.translations[0].translatedText;
}

async function jsonToExcelWithTranslation(jsonData) {
  let wb = XLSX.utils.book_new();

  for (let lang of Object.keys(jsonData.languages)) {
    if (lang !== "en") {
      let rows = [];

      //insert new voices after "languages"
      for (let category of ["languages", "labels", "strings", "measures", "errors"]) {
        if (jsonData[category] && Object.keys(jsonData[category]).length > 0) {
          let translations;
          if (category === "languages") {
            translations = Object.keys(jsonData[category]).map((key) => {
              return { Category: category, Key: key, Value: jsonData[category][key] };
            });
          } else {
            translations = await Promise.all(
              Object.keys(jsonData[category]).map(async (key) => {
                const translatedValue = await translateText(jsonData[category][key], lang);
                return { Category: category, Key: key, Value: translatedValue };
              })
            );
          }
          rows.push(...translations);
        } else {
          rows.push({ Category: category, Key: "(empty)", Value: "(empty)" });
        }
      }

      let ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, lang.toUpperCase());
    } else {
      let rows = [];

      for (let category of ["languages", "labels", "strings", "measures", "errors"]) {
        if (jsonData[category] && Object.keys(jsonData[category]).length > 0) {
          let translations = Object.keys(jsonData[category]).map((key) => {
            return { Category: category, Key: key, Value: jsonData[category][key] };
          });
          rows.push(...translations);
        } else {
          rows.push({ Category: category, Key: "(empty)", Value: "(empty)" });
        }
      }

      let ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, lang.toUpperCase());
    }
  }

  XLSX.writeFile(wb, "translations.xlsx");
}
