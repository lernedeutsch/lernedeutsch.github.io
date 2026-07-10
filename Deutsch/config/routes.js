/**
 * routes.js - Definicje tras aplikacji (tylko niemiecki)
 */

const routes = {
  home: "/",
  mapa: "/mapa-niemiec",
  lessons: {
    A1: "/lessons/A1",
    A2: "/lessons/A2",
    B1: "/lessons/B1",
    B2: "/lessons/B2",
    C1: "/lessons/C1",
    C2: "/lessons/C2"
  },
  exercises: {
    A1: "/exercises/A1",
    A2: "/exercises/A2",
    B1: "/exercises/B1",
    B2: "/exercises/B2",
    C1: "/exercises/C1",
    C2: "/exercises/C2"
  },
  grammar: "/grammar",
  vocabulary: "/vocabulary",
  chatbot: "/chatbot",
  test: "/test",
  dailyTask: "/daily-task"
};

// Funkcja pomocnicza do ładowania tras
function getRoute(name) {
  return routes[name];
}

// Eksport (jeśli używasz modulów Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = routes;
}
