function speakNele(text) {
    if (!text) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "de-DE";
    speech.rate = 0.95;
    speech.pitch = 1.0;
    speech.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();

    const germanVoice = voices.find(v =>
        v.lang.startsWith("de")
    );

    if (germanVoice) {
        speech.voice = germanVoice;
    }

    window.speechSynthesis.speak(speech);
}
