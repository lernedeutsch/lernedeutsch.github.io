/**
 * A1-2.js - Dane lekcji A1-2 (Sich vorstellen)
 */

const lessonA12 = {
  id: "A1-2",
  title: "Sich vorstellen",
  description: "Du lernst, dich auf Deutsch vorzustellen.",
  examples: [
    "Ich heiße Nele.",
    "Ich bin Lehrerin.",
    "Ich komme aus Polen."
  ],
  task: "Schreibe drei Sätze über dich.",
  expectedAnswer: "Ich heiße Nele."
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = lessonA12;
}
