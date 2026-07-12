/**
 * achievements.js - Osiągnięcia użytkownika
 */

const achievements = [
  {
    id: "a1-first-lesson",
    level: "A1",
    title: "Erste Lektion abgeschlossen",
    description: "Du hast deine erste A1-Lektion beendet."
  },
  {
    id: "a1-ten-correct",
    level: "A1",
    title: "Zehn richtige Antworten",
    description: "Du hast zehn richtige Antworten gegeben."
  }
];

function getAchievementsForLevel(level) {
  return achievements.filter(a => a.level === level);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { achievements, getAchievementsForLevel };
}
