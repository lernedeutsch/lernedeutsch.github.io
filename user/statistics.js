/**
 * statistics.js - Statystyki nauki użytkownika
 */

const STATS_KEY = "lerne-deutsch-stats";

function loadStatistics() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          totalMessages: 0,
          totalCorrect: 0,
          totalWrong: 0,
          totalTimeMinutes: 0
        };
  } catch (e) {
    console.error("Fehler beim Laden der Statistiken:", e);
    return {
      totalMessages: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalTimeMinutes: 0
    };
  }
}

function saveStatistics(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Fehler beim Speichern der Statistiken:", e);
  }
}

/**
 * Zaktualizuj statystyki po jednej odpowiedzi
 * score: wynik z scorer.js (0–100)
 * minutes: czas nauki (opcjonalnie)
 */
function updateStatistics(score, minutes = 0) {
  const stats = loadStatistics();

  stats.totalMessages += 1;
  if (score >= 60) {
    stats.totalCorrect += 1;
  } else {
    stats.totalWrong += 1;
  }

  stats.totalTimeMinutes += minutes;
  saveStatistics(stats);
}

/**
 * Pobierz procent poprawnych odpowiedzi
 */
function getAccuracy() {
  const stats = loadStatistics();
  if (stats.totalMessages === 0) return 0;
  return Math.round((stats.totalCorrect / stats.totalMessages) * 100);
}
