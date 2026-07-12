/**
 * engine.test.js - Test silnika chatbota
 */

console.log("=== engine.test.js ===");

(() => {
  const ctx = {
    level: "A1",
    lessonId: "1",
    expectedAnswer: "Ich bin Nele."
  };

  const reply = typeof processUserMessage === "function"
    ? processUserMessage("Ich bin Nele.", ctx)
    : "";

  console.assert(typeof reply === "string", "Engine: odpowiedź powinna być tekstem");
  console.assert(reply.length > 0, "Engine: odpowiedź nie powinna być pusta");

  console.log("engine.test.js – OK");
})();
