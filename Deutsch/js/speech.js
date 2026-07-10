// speech.js — wymowa i audio
function initSpeech() {
  console.log('Speech został inicjalizowany');
}

function speak(text, lang = 'de-DE') {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  }
}
