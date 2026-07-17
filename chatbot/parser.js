/**
 * parser.js - Prosty parser wiadomości użytkownika
 */

function parseMessage(message) {
  const text = String(message || "").trim();
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);

  return {
    text,
    lower,
    words,
    length: words.length
  };
}
