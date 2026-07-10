/**
 * languages.js - Obsługa języków (tylko niemiecki)
 */

const languages = {
  domyślny: "de",  // ← Zmieniono na "de"
  wspierane: ["de"],  // ← Tylko niemiecki

  // Tłumaczenia (tylko niemiecki)
  tłumaczenia: {
    de: {
      nazwa: "Lerne Deutsch",
      opis: "Deutsch lernen",
      lekcje: "Lektionen",
      ćwiczenia: "Übungen",  // ← Zmieniono na "Übungen"
      chatbot: "Chatbot",
      gramatyka: "Grammatik",
      słownictwo: "Wortschatz",  // ← Zmieniono na "Wortschatz"
      start: "Starten",
      mapa: "Karte",
     タワー: "Turm"  // ← Usunąć, jeśli niepotrzebne
    }
  }
};

// Funkcja pomocnicza do pobierania tłumaczenia
function getTranslation(klucz) {
  return languages.tłumaczenia[languages.domyślny][klucz] || "";
}

// Eksport
if (typeof module !== 'undefined' && module.exports) {
  module.exports = languages;
}
