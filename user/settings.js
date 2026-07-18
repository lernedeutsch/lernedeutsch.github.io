/**
 * settings.js - Ustawienia użytkownika (localStorage)
 */

const SETTINGS_KEY = "lerne-deutsch-settings";

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          theme: "light",        // "light" | "dark"
          fontSize: "medium",    // "small" | "medium" | "large"
          sound: true,           // czy dźwięk (audio / speech) jest włączony
          level: "A1"            // domyślny poziom startowy
        };
  } catch (e) {
    console.error("Fehler beim Laden der Einstellungen:", e);
    return {
      theme: "light",
      fontSize: "medium",
      sound: true,
      level: "A1"
    };
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Fehler beim Speichern der Einstellungen:", e);
  }
}

function updateSetting(key, value) {
  const settings = loadSettings();
  settings[key] = value;
  saveSettings(settings);
}

/**
 * Zastosuj ustawienia do UI (np. motyw, wielkość fontu)
 */
function applySettingsToUI() {
  const settings = loadSettings();

  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.dataset.fontSize = settings.fontSize;

  // przykład: wyłączenie dźwięku
  if (!settings.sound && typeof speechSynthesis !== "undefined") {
    speechSynthesis.cancel();
  }
}
