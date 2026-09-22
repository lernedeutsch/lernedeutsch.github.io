/**
 * app-config.js
 * Główna konfiguracja aplikacji Nele
 */

const appConfig = {
  nazwa: "Lerne Deutsch",
  wersja: "3.0.0",
  domyślnyJęzyk: "de",
  debug: true,

  // Ta instalacja portalu jest przeznaczona dla jednego użytkownika.
  singleUser: true,

  ustawienia: {
    animacje: true,
    wymowa: true,
    zapis: true,
    chatbot: true
  },

  // Backend dla tej strony jest celowo odłączony.
  api: {
    baseUrl: "",
    timeout: 70000
  }
};

if (typeof window !== "undefined") {
  window.appConfig = appConfig;
  window.NELE_API_BASE = appConfig.api.baseUrl;
  window.NELE_BACKEND_URL = appConfig.api.baseUrl;
  window.NELE_SINGLE_USER = appConfig.singleUser;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = appConfig;
}
