/**
 * constants.js - Stałe aplikacji
 */

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const SKILLS = ["Hören", "Lesen", "Schreiben", "Sprechen"];

const APP_NAME = "Lerne Deutsch";

const DEFAULT_LEVEL = "A1";

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LEVELS, SKILLS, APP_NAME, DEFAULT_LEVEL };
}
