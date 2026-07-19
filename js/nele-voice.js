"use strict";

/*
========================================================
NELE VOICE
Mikrofon → /chat → /tts

Jeżeli serwer /tts nie może utworzyć pliku WAV,
Nele automatycznie użyje niemieckiego głosu przeglądarki.
========================================================
*/

const NELE_BACKEND_URL = "https://nele-backend.onrender.com";

let neleRecognition = null;
let neleAudio = null;
let neleAudioUrl = null;


/*
========================================================
STATUS NELE NA STRONIE
========================================================
*/

function setNeleStatus(message) {
    const possibleElements = [
        document.getElementById("neleStatus"),
        document.querySelector(".nele-status"),
        document.querySelector(".nele-message"),
        document.querySelector(".nele-avatar-box p")
    ];

    const statusElement = possibleElements.find(Boolean);

    if (statusElement) {
        statusElement.textContent = message;
    }

    console.log("Status Nele:", message);
}


/*
========================================================
ZATRZYMANIE AKTUALNEGO GŁOSU
========================================================
*/

function stopNeleVoice() {
    if (neleAudio) {
        try {
            neleAudio.pause();
            neleAudio.currentTime = 0;
            neleAudio.removeAttribute("src");
            neleAudio.load();
        } catch (error) {
            console.warn("Nie udało się zatrzymać audio:", error);
        }

        neleAudio = null;
    }

    if (neleAudioUrl) {
        URL.revokeObjectURL(neleAudioUrl);
        neleAudioUrl = null;
    }

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    document.body.classList.remove("nele-is-speaking");
}


/*
========================================================
WYBÓR NIEMIECKIEGO GŁOSU PRZEGLĄDARKI
========================================================
*/

function findGermanVoice() {
    if (!("speechSynthesis" in window)) {
        return null;
    }

    const voices = window.speechSynthesis.getVoices();

    const preferredNames = [
        "Katja",
        "Anna",
        "Amala",
        "Vicki",
        "Petra",
        "Marlene",
        "Hedda",
        "Google Deutsch",
        "Microsoft Katja",
        "Microsoft Hedda"
    ];

    for (const preferredName of preferredNames) {
        const preferredVoice = voices.find((voice) => {
            return (
                voice.lang &&
                voice.lang.toLowerCase().startsWith("de") &&
                voice.name.toLowerCase().includes(
                    preferredName.toLowerCase()
                )
            );
        });

        if (preferredVoice) {
            return preferredVoice;
        }
    }

    return voices.find((voice) => {
        return (
            voice.lang &&
            voice.lang.toLowerCase().startsWith("de")
        );
    }) || null;
}


/*
========================================================
AWARYJNY GŁOS PRZEGLĄDARKI
========================================================
*/

function speakWithBrowserVoice(text) {
    return new Promise((resolve, reject) => {
        const cleanText = String(text || "").trim();

        if (!cleanText) {
            resolve();
            return;
        }

        if (
            !("speechSynthesis" in window) ||
            !("SpeechSynthesisUtterance" in window)
        ) {
            reject(
                new Error(
                    "Przeglądarka nie obsługuje syntezy mowy."
                )
            );
            return;
        }

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(cleanText);

        speech.lang = "de-DE";
        speech.rate = 0.92;
        speech.pitch = 1.0;
        speech.volume = 1.0;

        const germanVoice = findGermanVoice();

        if (germanVoice) {
            speech.voice = germanVoice;
        }

        speech.onstart = function () {
            document.body.classList.add("nele-is-speaking");
            setNeleStatus("Nele spricht …");
        };

        speech.onend = function () {
            document.body.classList.remove("nele-is-speaking");
            setNeleStatus("Nele ist bereit.");
            resolve();
        };

        speech.onerror = function (event) {
            document.body.classList.remove("nele-is-speaking");
            setNeleStatus("Nele ist bereit.");

            reject(
                new Error(
                    event.error || "Fehler bei der Sprachausgabe."
                )
            );
        };

        window.speechSynthesis.speak(speech);
    });
}


/*
========================================================
PRÓBA GŁOSU PIPER PRZEZ /tts
========================================================
*/

async function speakWithServerVoice(text) {
    const response = await fetch(
        `${NELE_BACKEND_URL}/tts`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text
            })
        }
    );

    if (!response.ok) {
        let errorMessage = `TTS error: ${response.status}`;

        try {
            const errorData = await response.json();

            if (errorData.error) {
                errorMessage = errorData.error;
            }
        } catch (error) {
            // Serwer nie zwrócił JSON.
        }

        throw new Error(errorMessage);
    }

    const audioBlob = await response.blob();

    if (!audioBlob || audioBlob.size === 0) {
        throw new Error(
            "Serwer nie zwrócił pliku audio."
        );
    }

    neleAudioUrl = URL.createObjectURL(audioBlob);
    neleAudio = new Audio(neleAudioUrl);

    neleAudio.preload = "auto";

    neleAudio.onplay = function () {
        document.body.classList.add("nele-is-speaking");
        setNeleStatus("Nele spricht …");
    };

    neleAudio.onended = function () {
        stopNeleVoice();
        setNeleStatus("Nele ist bereit.");
    };

    neleAudio.onerror = function () {
        stopNeleVoice();
        setNeleStatus("Nele ist bereit.");
    };

    await neleAudio.play();
}


/*
========================================================
GŁÓWNA FUNKCJA GŁOSU NELE
========================================================
*/

async function speakNele(text) {
    const cleanText = String(text || "").trim();

    if (!cleanText) {
        return;
    }

    stopNeleVoice();
    setNeleStatus("Nele bereitet die Antwort vor …");

    try {
        /*
        Najpierw próbujemy użyć docelowego głosu Piper.
        */

        await speakWithServerVoice(cleanText);

    } catch (serverVoiceError) {
        console.warn(
            "Głos Piper jest niedostępny. " +
            "Uruchamiam głos przeglądarki:",
            serverVoiceError
        );

        /*
        Jeżeli Piper na Renderze nie działa,
        Nele natychmiast używa głosu przeglądarki.
        */

        try {
            await speakWithBrowserVoice(cleanText);

        } catch (browserVoiceError) {
            console.error(
                "Nie udało się odtworzyć głosu Nele:",
                browserVoiceError
            );

            setNeleStatus(
                "Die Antwort konnte nicht vorgelesen werden."
            );
        }
    }
}


/*
========================================================
WYSŁANIE WYPOWIEDZI DO /chat
========================================================
*/

async function askNele(message) {
    const cleanMessage = String(message || "").trim();

    if (!cleanMessage) {
        return;
    }

    console.log("Uczeń:", cleanMessage);
    setNeleStatus("Nele denkt nach …");

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

        console.log("Status /chat:", response.status);

        if (!response.ok) {
            throw new Error(
                `Błąd serwera /chat: ${response.status}`
            );
        }

        const data = await response.json();
        const reply = String(data.reply || "").trim();

        if (!reply) {
            throw new Error(
                "Serwer nie zwrócił odpowiedzi Nele."
            );
        }

        console.log("Nele:", reply);

        await speakNele(reply);

        return reply;

    } catch (error) {
        console.error(
            "Nie udało się połączyć z Nele:",
            error
        );

        const errorMessage =
            "Entschuldigung. Die Verbindung zum Server funktioniert gerade nicht.";

        setNeleStatus(
            "Die Verbindung funktioniert gerade nicht."
        );

        /*
        Komunikat awaryjny używa głosu przeglądarki,
        ponieważ backend może być niedostępny.
        */

        try {
            await speakWithBrowserVoice(errorMessage);
        } catch (voiceError) {
            console.error(
                "Nie udało się odtworzyć komunikatu:",
                voiceError
            );
        }
    }
}


/*
========================================================
ZATRZYMANIE MIKROFONU
========================================================
*/

function stopNeleListening() {
    if (!neleRecognition) {
        return;
    }

    try {
        neleRecognition.abort();
    } catch (error) {
        console.warn(
            "Nie udało się zatrzymać mikrofonu:",
            error
        );
    }

    neleRecognition = null;
    document.body.classList.remove("nele-is-listening");
}


/*
========================================================
URUCHOMIENIE MIKROFONU
========================================================
*/

function startNeleListening() {
    console.log("Kliknięto przycisk rozmowy z Nele.");

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        const message =
            "Entschuldigung. Die Spracherkennung wird in diesem Browser nicht unterstützt.";

        console.error(message);
        setNeleStatus(message);

        speakWithBrowserVoice(message).catch((error) => {
            console.error(error);
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
        console.log("Nele hört zu …");

        document.body.classList.add("nele-is-listening");
        setNeleStatus("Nele hört zu …");
    };

    recognition.onresult = function (event) {
        const result = event.results[0][0];

        const recognizedText = String(
            result.transcript || ""
        ).trim();

        console.log("Erkannt:", recognizedText);

        if (recognizedText) {
            setNeleStatus(
                `Sie haben gesagt: ${recognizedText}`
            );

            askNele(recognizedText);
        }
    };

    recognition.onerror = function (event) {
        console.error(
            "Fehler bei der Spracherkennung:",
            event.error
        );

        document.body.classList.remove(
            "nele-is-listening"
        );

        if (event.error === "not-allowed") {
            setNeleStatus(
                "Bitte erlauben Sie den Zugriff auf das Mikrofon."
            );

        } else if (event.error === "no-speech") {
            setNeleStatus(
                "Ich habe nichts gehört. Bitte versuchen Sie es noch einmal."
            );

        } else {
            setNeleStatus(
                "Entschuldigung. Ich konnte Sie nicht verstehen."
            );
        }
    };

    recognition.onend = function () {
        console.log("Mikrofon wurde beendet.");

        document.body.classList.remove(
            "nele-is-listening"
        );

        if (neleRecognition === recognition) {
            neleRecognition = null;
        }
    };

    try {
        recognition.start();

    } catch (error) {
        console.error(
            "Nie udało się uruchomić mikrofonu:",
            error
        );

        neleRecognition = null;

        setNeleStatus(
            "Das Mikrofon konnte nicht gestartet werden."
        );
    }
}


/*
========================================================
UDOSTĘPNIENIE FUNKCJI DLA HTML
========================================================
*/

window.speakNele = speakNele;
window.askNele = askNele;
window.startNeleListening = startNeleListening;
window.stopNeleListening = stopNeleListening;
window.stopNeleVoice = stopNeleVoice;


/*
Głosy przeglądarki czasem ładują się chwilę po stronie.
*/

if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();

    window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.getVoices();
    };
}
