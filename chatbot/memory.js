/**
 * memory.js - Pamięć chatbota w localStorage
 */

const CHATBOT_MEMORY_KEY = "chatbot-memory";

function loadMemory() {
  try {
    const raw = localStorage.getItem(CHATBOT_MEMORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Fehler beim Laden der Chatbot-Persistenz:", e);
    return [];
  }
}

function saveMemory(entry) {
  try {
    const history = loadMemory();
    history.push(entry);
    localStorage.setItem(CHATBOT_MEMORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Fehler beim Speichern der Chatbot-Persistenz:", e);
  }
}

function clearMemory() {
  localStorage.removeItem(CHATBOT_MEMORY_KEY);
}
