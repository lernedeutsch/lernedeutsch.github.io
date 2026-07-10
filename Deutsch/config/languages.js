/**
 * languages.js - Obsługa języków (tylko niemiecki)
 */

const languages = {
  domyślny: "de",           // ← Tylko niemiecki
  wspierane: ["de"],        // ← Tylko niemiecki

  // Tłumaczenia (tylko niemiecki)
  tłumaczenia: {
    de: {
      nazwa: "Lerne Deutsch",
      opis: "Deutsch lernen",
      lekcje: "Lektionen",
      ćwiczenia: "Übungen",
      chatbot: "Chatbot",
      gramatyka: "Grammatik",
      słownictwo: "Wortschatz",
      start: "Starten",
      mapa: "Karte",
      powrót: "Zurück",
      dalszy: "Weiter",
      zakończ: "Beenden",
      sukces: "Erfolg",
      błąd: "Fehler",
      postęp: "Fortschritt"
    }
  }
};

// Funkcja pomocnicza do pobierania tłumaczenia (tylko niemiecki)
function getTranslation(klucz) {
  return languages.tłumaczenia[languages.domyślny][klucz] || "";
}

// Eksport (jeśli używasz modulów Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { languages, getTranslation };
}
