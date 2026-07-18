// animation.js — animacje
function initAnimation() {
  console.log('Animation został inicjalizowany');

  // Przykład: animacja elementu
  const elements = document.querySelectorAll('.animate');
  elements.forEach(el => {
    el.style.transition = 'transform 0.3s ease';
    el.addEventListener('mouseenter', function() {
      el.style.transform = 'scale(1.05)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = 'scale(1)';
    });
  });
}
