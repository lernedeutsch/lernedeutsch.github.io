/**
 * parser.test.js - Test parsera wiadomości
 */

console.log("=== parser.test.js ===");

(() => {
  const parsed = typeof parseMessage === "function"
    ? parseMessage("Hallo, ich bin Nele")
    : null;

  console.assert(parsed !== null, "Parser: wynik nie powinien być null");
  console.assert(parsed.text === "Hallo, ich bin Nele", "Parser: text powinien być oryginalny");
  console.assert(parsed.words.includes("hallo,"), "Parser: powinien zawierać słowo 'hallo,'");
  console.assert(parsed.length === parsed.words.length, "Parser: length odpowiada liczbie słów");

  console.log("parser.test.js – OK");
})();
