"use strict";

const NELE_BACKEND_URL = "https://nele-backend.onrender.com";

let neleRecognition = null;
let neleAudio = null;
let neleAudioUrl = null;


/*
====================================================
ZATRZYMANIE GŁOSU
====================================================
*/

function stopNeleVoice() {
    if (neleAudio) {
        neleAudio.pause();
        neleAudio.currentTime = 0;
        neleAudio.removeAttribute("src");
        neleAudio.load();
        neleAudio = null;
    }

    if (neleAudioUrl) {
        URL.revokeObjectURL(neleAudioUrl);
        neleAudioUrl = null;
    }

    document.body.classList.remove("nele-is-speaking");
}


/*
====================================================
GŁOS NELE — ENDPOINT /tts
====================================================
*/

async function speakNele(text) {
    const cleanText = String(text || "").trim();

    if (!cleanText) {
        return;
    }

    stopNeleVoice();

    console.log("TTS wysyła tekst:", cleanText);

    try {
        const response = await fetch(
            `${NELE_BACKEND_URL}/tts`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: cleanText
                })
            }
        );

        console.log("Odpowiedź /tts:", response.status);

        if (!response.ok) {
            let message = `TTS error: ${response.status}`;

            try {
                const errorData = await response.json();

                if (errorData.error) {
                    message = errorData.error;
                }
            } catch (error) {
                console.warn("Nie udało się odczytać błędu TTS.");
            }

            throw new Error(message);
        }

        const audioBlob = await response.blob();

        if (!audioBlob.size) {
            throw new Error("Serwer nie zwrócił pliku audio.");
        }

        neleAudioUrl = URL.createObjectURL(audioBlob);
        neleAudio = new Audio(neleAudioUrl);

        neleAudio.onplay = function () {
            document.body.classList.add("nele-is-speaking");
        };

        neleAudio.onended = function () {
            stopNeleVoice();
        };

        neleAudio.onerror = function () {
            console.error("Nie udało się odtworzyć pliku audio.");
            stopNeleVoice();
        };

        await neleAudio.play();

    } catch (error) {
        console.error("Błąd speakNele:", error);
        stopNeleVoice();
    }
}


/*
====================================================
WYSŁANIE WIADOMOŚCI DO /chat
====================================================
*/

async function askNele(message) {
    const cleanMessage = String(message || "").trim();

    if (!cleanMessage) {
        return;
    }

    console.log("Wysyłam do Nele:", cleanMessage);

    try {
        const response = await fetch(
            `${NELE_BACKEND_URL}/chat`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: cleanMessage
                })
            }
        );

        console.log("Odpowiedź /chat:", response.status);

        if (!response.ok) {
            throw new Error(
                `Błąd serwera /chat: ${response.status}`
            );
        }

        const data = await response.json();
        const reply = String(data.reply || "").trim();

        console.log("Nele odpowiedziała:", reply);

        if (!reply) {
            throw new Error("Backend nie zwrócił odpowiedzi.");
        }

        await speakNele(reply);

        return reply;

    } catch (error) {
        console.error("Błąd askNele:", error);
    }
}


/*
====================================================
ZATRZYMANIE MIKROFONU
====================================================
*/

function stopNeleListening() {
    if (!neleRecognition) {
        return;
    }

    try {
        neleRecognition.abort();
    } catch (error) {
        console.warn("Nie udało się zatrzymać mikrofonu:", error);
    }

    neleRecognition = null;
    document.body.classList.remove("nele-is-listening");
}


/*
====================================================
URUCHOMIENIE MIKROFONU
====================================================
*/

function startNeleListening() {
    console.log("Kliknięto przycisk rozmowy z Nele.");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.error(
            "Ta przeglądarka nie obsługuje rozpoznawania mowy."
        );

        return;
    }

    stopNeleVoice();
    stopNeleListening();

    neleRecognition = new SpeechRecognition();

    neleRecognition.lang = "de-DE";
    neleRecognition.continuous = false;
    neleRecognition.interimResults = false;
    neleRecognition.maxAlternatives = 1;

    neleRecognition.onstart = function () {
        console.log("Nele hört zu...");
        document.body.classList.add("nele-is-listening");
    };

    neleRecognition.onresult = function (event) {
        const recognizedText =
            event.results[0][0].transcript.trim();

        console.log("Erkannt:", recognizedText);

        askNele(recognizedText);
    };

    neleRecognition.onerror = function (event) {
        console.error(
            "Fehler bei der Spracherkennung:",
            event.error
        );

        document.body.classList.remove("nele-is-listening");
    };

    neleRecognition.onend = function () {
        console.log("Rozpoznawanie mowy zakończone.");

        document.body.classList.remove("nele-is-listening");
        neleRecognition = null;
    };

    try {
        neleRecognition.start();
    } catch (error) {
        console.error(
            "Nie udało się uruchomić mikrofonu:",
            error
        );
    }
}


/*
====================================================
UDOSTĘPNIENIE FUNKCJI DLA HTML
====================================================
*/

window.speakNele = speakNele;
window.askNele = askNele;
window.startNeleListening = startNeleListening;
window.stopNeleListening = stopNeleListening;
window.stopNeleVoice = stopNeleVoice;
