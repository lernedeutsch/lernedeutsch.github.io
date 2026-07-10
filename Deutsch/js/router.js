// router.js — router stron
function initRouter() {
  console.log('Router został inicjalizowany');

  // Przykład: obsługa zmiany stron
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    console.log('Zmieniono hash:', hash);
    // Tutaj możesz obsłużyć zmianę strony
  });
}
