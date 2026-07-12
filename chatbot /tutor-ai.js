/**
 * tutor-ai.js - Logika odpowiedzi tutora
 * Tworzy prostą odpowiedź po niemiecku na bazie wyniku
 */

function buildTutorReply(parsed, score, context = {}) {
  const userText = parsed.text || "";

  if (!userText) {
    return "Schreibe bitte einen Satz auf Deutsch.";
  }

  if (score >= 90) {
    return "Sehr gut! Das ist richtig.";
  }

  if (score >= 60) {
    return "Ganz gut, aber du kannst es noch besser formulieren.";
  }

  if (score > 0) {
    return "Du bist nah dran. Lies die Lösung noch einmal und versuche es erneut.";
  }

  // Brak punktów – odpowiedź błędna
  return "Das ist leider falsch. Versuche es noch einmal mit einem einfachen deutschen Satz.";
}
