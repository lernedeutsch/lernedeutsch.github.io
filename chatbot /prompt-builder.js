/**
 * prompt-builder.js - Budowanie promptu dla tutora
 */

function buildPrompt(context = {}) {
  const lines = [
    "Du bist ein freundlicher Deutsch-Tutor.",
    "Sprich nur auf Deutsch.",
    "Hilf beim Lernen auf Niveau A1 bis C2.",
    "Korrigiere freundlich und gib kurze Erklärungen.",
  ];

  if (context.level) {
    lines.push(`Niveau: ${context.level}`);
  }

  if (context.lesson) {
    lines.push(`Thema der Lektion: ${context.lesson}`);
  }

  if (context.goal) {
    lines.push(`Lernziel: ${context.goal}`);
  }

  return lines.join("\n");
}
