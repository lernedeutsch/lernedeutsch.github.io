/**
 * A1-1.js - Dane lekcji A1-1 (Begrüßung)
 */

const lessonA11 = {
  id: "A1-1",
  title: "Begrüßung",
  description: "Einfache Begrüßungen auf Deutsch.",
  examples: [
    "Hallo!",
    "Guten Tag!",
    "Guten Morgen!",
    "Guten Abend!"
  ],
  task: "Schreibe einen Begrüßungssatz, z.B.: „Hallo, ich bin Nele.“",
  expectedAnswer: "Ich bin Nele."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = lessonA11;
}
