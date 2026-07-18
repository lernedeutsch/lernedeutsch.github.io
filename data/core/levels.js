/**
 * levels.js - Opis poziomów językowych
 */

const levels = {
  A1: {
    name: "A1",
    title: "Deutsch für Anfänger",
    description: "Einfache Sätze, Begrüßung, sich vorstellen, Herkunft und Wohnort."
  },
  A2: {
    name: "A2",
    title: "Grundlegende Kenntnisse",
    description: "Alltagsthemen, einfache Gespräche, kurze Texte."
  }
  // resztę poziomów dopiszesz później
};

function getLevelInfo(level) {
  return levels[level] || null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { levels, getLevelInfo };
}
