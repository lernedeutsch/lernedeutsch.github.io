// navigation.js — obsługa nawigacji
function initNavigation() {
  console.log('Nawigacja została inicjalizowana');

  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      console.log('Kliknięto link nawigacji:', e.target.href);
    });
  });
}
