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
async function askNele(message) {
    if (!message || !message.trim()) {
        return;
    }

    try {
        const response = await fetch(
            "https://nele-backend.onrender.com/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message.trim()
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Błąd serwera: ${response.status}`);
        }

        const data = await response.json();

        if (data.reply) {
            speakNele(data.reply);
        }
    } catch (error) {
        console.error("Nie udało się połączyć z Nele:", error);

        speakNele(
            "Entschuldigung. Die Verbindung zum Server funktioniert gerade nicht."
        );
    }
}
