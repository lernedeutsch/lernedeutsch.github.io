"use strict";

/*
=========================================================
NELE VOICE
Połączenie strony z backendem Nele:

1. Mikrofon rozpoznaje wypowiedź ucznia.
2. Tekst jest wysyłany do /chat.
3. Odpowiedź Nele jest wysyłana do /tts.
4. Backend tworzy plik WAV.
5. Przeglądarka odtwarza głos Nele.
=========================================================
*/

const NELE_BACKEND_URL = "https://nele-backend.onrender.com";

let neleAudio = null;
let neleAudioUrl = null;
let neleRecognition = null;

let chatAbortController = null;
let ttsAbortController = null;


/*
=========================================================
Pomocnicze zdarzenia strony
=========================================================
*/

function dispatchNeleEvent(eventName, detail = {}) {
    document.dispatchEvent(
        new CustomEvent(eventName, {
            detail
        })
    );
}


/*
=========================================================
Czyszczenie pliku audio
=========================================================
*/

function cleanupNeleAudio() {
    document.body.classList.remove("nele-is-speaking");

    if (neleAudio) {
        neleAudio.onplay = null;
        neleAudio.onended = null;
        neleAudio.onerror = null;

        neleAudio.removeAttribute("src");
        neleAudio.load();

        neleAudio = null;
    }

    if (neleAudioUrl) {
        URL.revokeObjectURL(neleAudioUrl);
        neleAudioUrl = null;
    }
}


/*
=========================================================
Zatrzymanie głosu Nele
=========================================================
*/

function stopNeleVoice() {
    if (ttsAbortController) {
        ttsAbortController.abort();
        ttsAbortController = null;
    }

    if (neleAudio) {
        try {
            neleAudio.pause();
            neleAudio.currentTime = 0;
        } catch (error) {
            console.warn("Nie udało się zatrzymać audio Nele:", error);
        }
    }

    cleanupNeleAudio();

    dispatchNeleEvent("nele:speech-stop");
}


/*
=========================================================
Odczytanie komunikatu błędu zwróconego przez backend
=========================================================
*/

async function readBackendError(response) {
    try {
        const contentType = response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            const errorData = await response.json();

            if (errorData.error) {
                return String(errorData.error);
            }

            if (errorData.message) {
                return String(errorData.message);
            }
        }

        const errorText = await response.text();

        if (errorText.trim()) {
            return errorText.trim();
        }
    } catch (error) {
        console.warn("Nie udało się odczytać błędu backendu:", error);
    }

    return `Serverfehler: ${response.status}`;
}


/*
=========================================================
Głos Nele przez backend /tts
=========================================================
*/

async function speakNele(text) {
    const cleanText = String(text || "").trim();

    if (!cleanText) {
        return;
    }

    stopNeleVoice();

    ttsAbortController = new AbortController();

    dispatchNeleEvent("nele:speech-loading", {
        text: cleanText
    });

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
                }),

                signal: ttsAbortController.signal
            }
        );

        if (!response.ok) {
            const errorMessage = await readBackendError(response);
            throw new Error(errorMessage);
        }

        const audioBlob = await response.blob();

        if (!audioBlob || audioBlob.size === 0) {
            throw new Error(
                "Der Server hat keine Audiodatei zurückgegeben."
            );
        }

        const contentType = audioBlob.type || "";

        if (
            contentType &&
            !contentType.includes("audio") &&
            !contentType.includes("octet-stream")
        ) {
            throw new Error(
                "Der Server hat keine gültige Audiodatei zurückgegeben."
            );
        }

        neleAudioUrl = URL.createObjectURL(audioBlob);
        neleAudio = new Audio(neleAudioUrl);

        neleAudio.preload = "auto";

        neleAudio.onplay = function () {
            document.body.classList.add("nele-is-speaking");

            dispatchNeleEvent("nele:speech-start", {
                text: cleanText
            });
        };

        neleAudio.onended = function () {
            cleanupNeleAudio();

            dispatchNeleEvent("nele:speech-end", {
                text: cleanText
            });
        };

        neleAudio.onerror = function () {
            cleanupNeleAudio();

            dispatchNeleEvent("nele:speech-error", {
                message: "Die Audiodatei konnte nicht abgespielt werden."
            });
        };

        await neleAudio.play();

    } catch (error) {
        if (error.name === "AbortError") {
            console.log("Odtwarzanie głosu Nele zostało przerwane.");
            return;
        }

        cleanupNeleAudio();

        console.error("Błąd głosu Nele:", error);

        dispatchNeleEvent("nele:speech-error", {
            message: error.message
        });

        throw error;

    } finally {
        ttsAbortController = null;
    }
}


/*
=========================================================
Wysłanie wypowiedzi ucznia do /chat
=========================================================
*/

async function askNele(message) {
    const cleanMessage = String(message || "").trim();

    if (!cleanMessage) {
        return;
    }

    if (chatAbortController) {
        chatAbortController.abort();
    }

    chatAbortController = new AbortController();

    dispatchNeleEvent("nele:thinking", {
        message: cleanMessage
    });

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
                }),

                signal: chatAbortController.signal
            }
        );

        if (!response.ok) {
            const errorMessage = await readBackendError(response);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const reply = String(data.reply || "").trim();

        if (!reply) {
            throw new Error(
                "Der Server hat keine Antwort zurückgegeben."
            );
        }

        console.log("Nele:", reply);

        dispatchNeleEvent("nele:reply", {
            userMessage: cleanMessage,
            reply
        });

        await speakNele(reply);

        return reply;

    } catch (error) {
        if (error.name === "AbortError") {
            console.log("Poprzednie zapytanie do Nele zostało przerwane.");
            return;
        }

        console.error("Nie udało się połączyć z Nele:", error);

        const connectionMessage =
            "Entschuldigung. Die Verbindung zum Server funktioniert gerade nicht.";

        dispatchNeleEvent("nele:chat-error", {
            message: error.message,
            reply: connectionMessage
        });

        /*
        Nie uruchamiamy tutaj ponownie speakNele(),
        ponieważ błąd może dotyczyć właśnie połączenia z backendem.
        */

        return connectionMessage;

    } finally {
        chatAbortController = null;
    }
}


/*
=========================================================
Zatrzymanie mikrofonu
=========================================================
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

    dispatchNeleEvent("nele:listening-stop");
}


/*
=========================================================
Uruchomienie mikrofonu
=========================================================
*/

function startNeleListening() {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        const message =
            "Entschuldigung. Die Spracherkennung wird in diesem Browser nicht unterstützt.";

        console.error(message);

        dispatchNeleEvent("nele:recognition-error", {
            error: "not-supported",
            message
        });

        speakNele(message).catch(function (error) {
            console.error(
                "Nie udało się odtworzyć komunikatu Nele:",
                error
            );
        });

        return;
    }

    stopNeleVoice();
    stopNeleListening();

    const recognition = new SpeechRecognition();

    neleRecognition = recognition;

    recognition.lang = "de-DE";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
        console.log("Nele hört zu...");

        document.body.classList.add("nele-is-listening");

        dispatchNeleEvent("nele:listening-start");
    };

    recognition.onresult = async function (event) {
        const result = event.results?.[0]?.[0];
        const recognizedText = String(
            result?.transcript || ""
        ).trim();

        if (!recognizedText) {
            return;
        }

        console.log("Erkannt:", recognizedText);

        dispatchNeleEvent("nele:recognized", {
            text: recognizedText,
            confidence: result.confidence
        });

        await askNele(recognizedText);
    };

    recognition.onerror = function (event) {
        console.error(
            "Fehler bei der Spracherkennung:",
            event.error
        );

        document.body.classList.remove("nele-is-listening");

        let message = "";

        if (event.error === "not-allowed") {
            message =
                "Bitte erlauben Sie den Zugriff auf das Mikrofon.";

        } else if (event.error === "audio-capture") {
            message =
                "Das Mikrofon wurde nicht gefunden.";

        } else if (event.error === "network") {
            message =
                "Die Spracherkennung hat keine Verbindung zum Netzwerk.";

        } else if (event.error !== "no-speech") {
            message =
                "Entschuldigung. Ich konnte Sie nicht verstehen.";
        }

        dispatchNeleEvent("nele:recognition-error", {
            error: event.error,
            message
        });

        if (message) {
            speakNele(message).catch(function (error) {
                console.error(
                    "Nie udało się odtworzyć komunikatu Nele:",
                    error
                );
            });
        }
    };

    recognition.onend = function () {
        document.body.classList.remove("nele-is-listening");

        if (neleRecognition === recognition) {
            neleRecognition = null;
        }

        dispatchNeleEvent("nele:listening-end");
    };

    try {
        recognition.start();

    } catch (error) {
        neleRecognition = null;
        document.body.classList.remove("nele-is-listening");

        console.error(
            "Nie udało się uruchomić mikrofonu:",
            error
        );

        dispatchNeleEvent("nele:recognition-error", {
            error: "start-error",
            message: error.message
        });
    }
}


/*
=========================================================
Zatrzymanie wszystkich procesów Nele
=========================================================
*/

function stopNele() {
    stopNeleListening();
    stopNeleVoice();

    if (chatAbortController) {
        chatAbortController.abort();
        chatAbortController = null;
    }

    dispatchNeleEvent("nele:stop");
}


/*
=========================================================
Udostępnienie funkcji pozostałym plikom strony
=========================================================
*/

window.speakNele = speakNele;
window.askNele = askNele;
window.startNeleListening = startNeleListening;
window.stopNeleListening = stopNeleListening;
window.stopNeleVoice = stopNeleVoice;
window.stopNele = stopNele;
