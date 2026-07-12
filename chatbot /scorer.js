/**
 * scorer.js - Ocena odpowiedzi użytkownika
 */

function scoreAnswer(answer, context = {}) {
  const expected = String(context.expectedAnswer || "").toLowerCase().trim();
  const given = String(answer || "").toLowerCase().trim();

  if (!expected) {
    // Brak oczekiwanej odpowiedzi – nie oceniamy
    return 0;
  }

  if (!given) {
    return 0;
  }

  if (given === expected) {
    return 100;
  }

  // Bardzo prosty scorer: częściowe dopasowanie słów
  const expectedWords = expected.split(/\s+/).filter(Boolean);
  const givenWords = given.split(/\s+/).filter(Boolean);

  const matched = expectedWords.filter(w => givenWords.includes(w)).length;
  const ratio = matched / expectedWords.length;

  return Math.round(ratio * 100);
}
