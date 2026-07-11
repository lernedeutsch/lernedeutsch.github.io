/**
 * ui.test.js - Test podstawowego interfejsu
 */

console.log("=== ui.test.js ===");

(() => {
  const chatbotButton = document.querySelector(".chatbot-button");
  const mapLinks = document.querySelectorAll(".land");

  console.assert(chatbotButton !== null, "UI: przycisk chatbota powinien istnieć");
  console.assert(mapLinks.length > 0, "UI: linki na mapie powinny istnieć");

  console.log("ui.test.js – OK");
})();
