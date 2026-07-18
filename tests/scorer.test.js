/**
 * scorer.test.js - Test oceny odpowiedzi
 */

console.log("=== scorer.test.js ===");

(() => {
  const ctx = { expectedAnswer: "Ich bin Nele." };

  const fullScore = typeof scoreAnswer === "function"
    ? scoreAnswer("Ich bin Nele.", ctx)
    : 0;

  const lowScore = typeof scoreAnswer === "function"
    ? scoreAnswer("Ich bin Anna.", ctx)
    : 0;

  console.assert(fullScore === 100, "Scorer: poprawna odpowiedź powinna dać 100 punktów");
  console.assert(lowScore < 100, "Scorer: błędna odpowiedź powinna dać mniej niż 100 punktów");

  console.log("scorer.test.js – OK");
})();
