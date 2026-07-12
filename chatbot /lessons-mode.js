/**
 * lessons-mod.js - Kontekst lekcji dla chatbota
 * Łączy poziom i ID lekcji z oczekiwaną odpowiedzią
 */

const lessonContexts = {
  "A1-1": {
    level: "A1",
    lessonId: "1",
    goal: "Einfache Sätze bilden",
    expectedAnswer: "Ich bin Nele."
  },
  "A1-2": {
    level: "A1",
    lessonId: "2",
    goal: "Vorstellen auf Deutsch",
    expectedAnswer: "Ich komme aus Deutschland."
  }
  // tutaj możesz dopisywać kolejne lekcje
};

function getLessonContext(key) {
  return lessonContexts[key] || {
    level: null,
    lessonId: null,
    goal: "Deutsch lernen",
    expectedAnswer: ""
  };
}
