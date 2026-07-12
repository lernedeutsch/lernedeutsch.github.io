/**
 * A1.js - Gramatyka dla poziomu A1
 */

const grammarA1 = [
  {
    id: "a1-satzstellung",
    title: "Satzstellung",
    rule: "Subjekt – Verb – Rest.",
    examples: [
      "Ich bin Nele.",
      "Ich komme aus Polen.",
      "Ich wohne in Frankfurt."
    ]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = grammarA1;
}
