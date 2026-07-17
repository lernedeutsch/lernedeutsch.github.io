/**
 * engine.js - Główny silnik chatbota
 * Łączy parser, scorer, tutora i pamięć
 */

function processUserMessage(message, context = {}) {
  const parsed = typeof parseMessage === "function"
    ? parseMessage(message)
    : { text: String(message || "").trim() };

  const score = typeof scoreAnswer === "function"
    ? scoreAnswer(message, context)
    : 0;

  const reply = typeof buildTutorReply === "function"
    ? buildTutorReply(parsed, score, context)
    : "Ich verstehe. Bitte versuche es noch einmal.";

  if (typeof saveMemory === "function") {
    saveMemory({
      message,
      reply,
      score,
      level: context.level || null,
      lessonId: context.lessonId || null,
      time: Date.now()
    });
  }

  return reply;
}
