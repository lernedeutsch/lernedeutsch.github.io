/**
 * progress.js - Postępy użytkownika (localStorage)
 */

const PROGRESS_KEY = "lerne-deutsch-progress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : { levels: {}, totalLessonsDone: 0 };
  } catch (e) {
    console.error("Fehler beim Laden des Fortschritts:", e);
    return { levels: {}, totalLessonsDone: 0 };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Fehler beim Speichern des Fortschritts:", e);
  }
}

/**
 * Oznacz lekcję jako ukończoną
 * level: np. "A1"
 * lessonId: np. "A1-1"
 */
function markLessonDone(level, lessonId) {
  const progress = loadProgress();

  if (!progress.levels[level]) {
    progress.levels[level] = { doneLessons: [] };
  }

  if (!progress.levels[level].doneLessons.includes(lessonId)) {
    progress.levels[level].doneLessons.push(lessonId);
    progress.totalLessonsDone += 1;
    saveProgress(progress);
  }
}

/**
 * Sprawdź, czy lekcja jest ukończona
 */
function isLessonDone(level, lessonId) {
  const progress = loadProgress();
  const levelData = progress.levels[level];
  if (!levelData) return false;
  return levelData.doneLessons.includes(lessonId);
}
