/**
 * wordlists.js - Słownictwo ogólne do poziomów
 */

const wordlists = {
  A1: [
    { de: "Hallo", type: "phrase", topic: "greeting" },
    { de: "Guten Tag", type: "phrase", topic: "greeting" },
    { de: "Ich heiße ...", type: "phrase", topic: "introduction" },
    { de: "Ich komme aus ...", type: "phrase", topic: "origin" },
    { de: "Ich wohne in ...", type: "phrase", topic: "residence" }
    // dopiszesz kolejne słowa zgodnie z listą A1
  ]
};

function getWordlist(level) {
  return wordlists[level] || [];
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { wordlists, getWordlist };
}
