/**
 * memory.test.js - Test pamięci chatbota
 */

console.log("=== memory.test.js ===");

(() => {
  // Wyczyść pamięć
  if (typeof clearMemory === "function") {
    clearMemory();
  }

  // Zapisz wpis
  const entry = {
    message: "Hallo",
    reply: "Hallo! Wie geht es dir?",
    score: 100,
    time: Date.now()
  };

  if (typeof saveMemory === "function") {
    saveMemory(entry);
  }

  // Wczytaj pamięć
  const history = typeof loadMemory === "function" ? loadMemory() : [];

  console.assert(Array.isArray(history), "Memory: history powinno być tablicą");
  console.assert(history.length > 0, "Memory: powinien być co najmniej jeden wpis");
  console.assert(history[0].message === "Hallo", "Memory: pierwszy wpis ma message 'Hallo'");

  console.log("memory.test.js – OK");
})();
