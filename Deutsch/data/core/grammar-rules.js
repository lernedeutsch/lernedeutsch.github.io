/**
 * grammar-rules.js - Podstawowe reguły gramatyczne
 */

const grammarRules = {
  A1: [
    {
      id: "satzstellung-hauptsatz",
      title: "Satzstellung im Hauptsatz",
      description: "Subjekt steht normalerweise am Anfang, Verb an zweiter Stelle.",
      example: "Ich komme aus Deutschland."
    },
    {
      id: "sein",
      title: "Verb: sein",
      description: "Konjugation von 'sein' im Präsens.",
      example: "Ich bin müde. Du bist müde. Er ist müde."
    }
  ]
  // później dopiszesz A2, B1 itd.
};

function getGrammarRules(level) {
  return grammarRules[level] || [];
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { grammarRules, getGrammarRules };
}
