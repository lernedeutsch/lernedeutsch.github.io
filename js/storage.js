// storage.js — zapis i odczyt danych
function initStorage() {
  console.log('Storage został inicjalizowany');
}

function saveProgress(level, data) {
  localStorage.setItem(`progress-${level}`, JSON.stringify(data));
}

function getProgress(level) {
  const data = localStorage.getItem(`progress-${level}`);
  return data ? JSON.parse(data) : null;
}
