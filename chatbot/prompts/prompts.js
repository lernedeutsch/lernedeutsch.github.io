/**
 * prompts/prompts.js - Gotowe prompty dla różnych sytuacji
 */

const prompts = {
  greeting: "Hallo! Ich bin dein Deutsch-Tutor. Wie kann ich dir heute helfen?",
  correct: "Sehr gut! Das ist richtig.",
  wrong: "Das ist leider falsch. Versuche es noch einmal.",
  lessonStart: "Wir beginnen mit der Lektion. Lies bitte den Beispielsatz.",
  practice: "Jetzt üben wir. Schreibe einen eigenen Satz.",
  goodbye: "Gut gemacht für heute! Bis zum nächsten Mal."
};

function getPrompt(name) {
  return prompts[name] || "";
}
