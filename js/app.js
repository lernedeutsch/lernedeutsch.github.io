/**
 * app.js - Główny skrypt aplikacji
 * Inicjuje aplikację, łączy moduły i obsługuje zdarzenia
 */

// Inicjalizacja aplikacji
function initApp() {
  console.log('Aplikacja Lerne Deutsch została uruchomiona');

  // Inicjalizacja modułów
  if (typeof initRouter === 'function') {
    initRouter();
  }

  if (typeof initStorage === 'function') {
    initStorage();
  }

  if (typeof initSpeech === 'function') {
    initSpeech();
  }

  if (typeof initAnimation === 'function') {
    initAnimation();
  }

  if (typeof initUI === 'function') {
    initUI();
  }

  if (typeof initNavigation === 'function') {
    initNavigation();
  }

  // Obsługa zdarzeń
  setupEventListeners();
}

// Obsługa zdarzeń
function setupEventListeners() {
  // Przykład: obsługa przycisku chatbota
  const chatbotButton = document.querySelector('.chatbot-button');
  if (chatbotButton) {
    chatbotButton.addEventListener('click', function() {
      console.log('Przycisk chatbota został kliknięty');
      // Tutaj możesz otworzyć chatbota
      if (typeof openChatbot === 'function') {
        openChatbot();
      }
    });
  }

  // Przykład: obsługa mapy
  const mapLinks = document.querySelectorAll('.land');
  mapLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      console.log('Kliknięto na poziom:', e.target.textContent);
    });
  });
}

// Uruchomienie aplikacji po załadowaniu strony
document.addEventListener('DOMContentLoaded', initApp);

// Dodatkowe funkcje globalne (opcjonalnie)
function openChatbot() {
  // Tutaj możesz otworzyć chatbota
  window.location.href = 'chatbot/index.html';
}
