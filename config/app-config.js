/**
 * app-config.js
 * Główna konfiguracja aplikacji Nele
 */

const appConfig = {
  nazwa: "Lerne Deutsch",
  wersja: "3.0.0",
  domyślnyJęzyk: "de",
  debug: true,

  // Ustawienia aplikacji
  ustawienia: {
    animacje: true,
    wymowa: true,
    zapis: true,
    chatbot: true
  },

  // Backend Nele 1 + funkcje Nele 3.0 na Render
  api: {
    baseUrl: "https://nele-backend.onrender.com",
    timeout: 70000
  }
};

// Udostępnienie konfiguracji innym plikom JavaScript
if (typeof window !== "undefined") {
  window.appConfig = appConfig;
  window.NELE_API_BASE = appConfig.api.baseUrl;
}

// Eksport dla Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = appConfig;
}
