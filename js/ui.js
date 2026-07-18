// ui.js — interfejs użytkownika
function initUI() {
  console.log('UI został inicjalizowany');

  // Przykład: informacje o statusie
  const status = document.querySelector('.status');
  if (status) {
    status.textContent = 'Aplikacja działa poprawnie';
  }
}
