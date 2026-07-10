/**
 * app-config.js - Konfiguracja główna aplikacji (tylko niemiecki)
 */

const appConfig = {
  nazwa: "Lerne Deutsch",
  wersja: "0.1.0",
  domyślnyJęzyk: "de",  // ← Tylko niemiecki
  debug: true,

  // Ustawienia ogólnie
  ustawienia: {
    animacje: true,
    wymowa: true,
    zapis: true,
    chatbot: true
  },

  // API (jeśli używasz)
  api: {
    baseUrl: "",
    timeout: 5000
  }
};

// Eksport (jeśli używasz modulów Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = appConfig;
}
