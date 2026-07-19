"use strict";

/*
========================================================
NELE VOICE

Działanie:
1. Uczeń klika przycisk rozmowy.
2. Mikrofon rozpoznaje niemiecką wypowiedź.
3. Tekst trafia do endpointu /chat.
4. Nele otrzymuje odpowiedź.
5. Strona próbuje pobrać naturalny głos z /tts.
6. Jeżeli Piper na serwerze nie działa, Nele automatycznie
   używa niemieckiego głosu przeglądarki.

Dzięki temu rozmowa działa już teraz, a Piper pozostaje
przygotowany na przyszłość.
========================================================
*/

const NELE_BACKEND_URL = "https://nele-backend.onrender.com";

let neleRecognition = null;
let neleAudio = null;
let neleAudioUrl = null;


/*
========================================================
AKTUALIZOWANIE KOMUNIKATU NELE
========================================================
*/

function setNeleStatus(message) {
    const selectors = [
        "#neleStatus",
        ".nele-status",
        ".nele-message",
        ".nele-text",
        "[data-nele-status]"
    ];

    let statusElement = null;

    for (const selector of selectors) {
        statusElement = document.querySelector(selector);

        if (statusElement) {
            break;
        }
    }

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
            console.warn(
                "Nie udało się zatrzymać audio Nele:",
                error
            );
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

function getGermanVoice() {
    if (!("speechSynthesis" in window)) {
        return null;
    }

    const voices = window.speechSynthesis.getVoices();

    const preferredVoiceNames = [
        "Katja",
        "Hedda",
        "Anna",
        "Amala",
        "Vicki",
        "Petra",
        "Marlene",
        "Google Deutsch",
        "Microsoft Katja",
        "Microsoft Hedda"
    ];

    for (const preferredName of preferredVoiceNames) {
        const voice = voices.find((availableVoice) => {
            const voiceLanguage =
                String(availableVoice.lang || "").toLowerCase();

            const voiceName =
                String(availableVoice.name || "").toLowerCase();

            return (
                voiceLanguage.startsWith("de") &&
                voiceName.includes(
                    preferredName.toLowerCase()
                )
            );
        });

        if (voice) {
            return voice;
        }
    }

    return (
        voices.find((voice) => {
            return String(voice.lang || "")
                .toLowerCase()
                .startsWith("de");
        }) || null
    );
}


/*
========================================================
GŁOS AWARYJNY PRZEGLĄDARKI
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

        const speech =
            new SpeechSynthesisUtterance(cleanText);

        speech.lang = "de-DE";
        speech.rate = 0.95;
        speech.pitch = 1.0;
        speech.volume = 1.0;

        const germanVoice = getGermanVoice();

        if (germanVoice) {
            speech.voice = germanVoice;

            console.log(
                "Wybrany głos przeglądarki:",
                germanVoice.name
            );
        }

        speech.onstart = function () {
            console.log("Nele spricht...");

            document.body.classList.add(
                "nele-is-speaking"
            );

            setNeleStatus("Nele spricht …");
        };

        speech.onend = function () {
            console.log("Nele hat aufgehört zu sprechen.");

            document.body.classList.remove(
                "nele-is-speaking"
            );

            setNeleStatus("Nele ist bereit.");

            resolve();
        };

        speech.onerror = function (event) {
            document.body.classList.remove(
                "nele-is-speaking"
            );

            setNeleStatus("Nele ist bereit.");

            reject(
                new Error(
                    event.error ||
                    "Fehler bei der Sprachausgabe."
                )
            );
        };

        window.speechSynthesis.speak(speech);
    });
}


/*
========================================================
NATURALNY GŁOS PIPER Z ENDPOINTU /tts
========================================================
*/

async function speakWithServerVoice(text) {
    const cleanText = String(text || "").trim();

    console.log("TTS wysyła tekst:", cleanText);

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
        let errorMessage =
            `TTS jest niedostępny: ${response.status}`;

        try {
            const errorData = await response.json();

            if (errorData.error) {
                errorMessage = String(errorData.error);
            }
        } catch (error) {
            console.warn(
                "Backend TTS nie zwrócił komunikatu JSON."
            );
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
        console.log("Nele odtwarza głos Piper.");

        document.body.classList.add(
            "nele-is-speaking"
        );

        setNeleStatus("Nele spricht …");
    };

    neleAudio.onended = function () {
        document.body.classList.remove(
            "nele-is-speaking"
        );

        if (neleAudioUrl) {
            URL.revokeObjectURL(neleAudioUrl);
        }

        neleAudio = null;
        neleAudioUrl = null;

        setNeleStatus("Nele ist bereit.");
    };

    neleAudio.onerror = function () {
        document.body.classList.remove(
            "nele-is-speaking"
        );

        if (neleAudioUrl) {
            URL.revokeObjectURL(neleAudioUrl);
        }

        neleAudio = null;
        neleAudioUrl = null;

        console.error(
            "Nie udało się odtworzyć pliku audio Piper."
        );
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

    setNeleStatus(
        "Nele bereitet die Antwort vor …"
    );

    try {
        /*
        Najpierw próbujemy docelowego głosu Piper.
        */

        await speakWithServerVoice(cleanText);

    } catch (serverVoiceError) {
        /*
        Render zwraca obecnie 503, ponieważ nie ma jeszcze
        programu Piper lub modelu głosu.

        Dlatego automatycznie uruchamiamy działający głos
        przeglądarki.
        */

        console.warn(
            "Piper jest niedostępny. " +
            "Uruchamiam niemiecki głos przeglądarki:",
            serverVoiceError
        );

        try {
            await speakWithBrowserVoice(cleanText);

        } catch (browserVoiceError) {
            console.error(
                "Nie udało się odtworzyć odpowiedzi Nele:",
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
WYSŁANIE WYPOWIEDZI UCZNIA DO /chat
========================================================
*/

async function askNele(message) {
    const cleanMessage = String(message || "").trim();

    if (!cleanMessage) {
        return;
    }

    console.log("Wysyłam do Nele:", cleanMessage);

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

        console.log(
            "Odpowiedź /chat:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `Błąd serwera /chat: ${response.status}`
            );
        }

        const data = await response.json();

        const reply = String(
            data.reply || ""
        ).trim();

        console.log(
            "Nele odpowiedziała:",
            reply
        );

        if (!reply) {
            throw new Error(
                "Backend nie zwrócił odpowiedzi Nele."
            );
        }

        await speakNele(reply);

        return reply;

    } catch (error) {
        console.error(
            "Nie udało się połączyć z Nele:",
            error
        );

        const connectionMessage =
            "Entschuldigung. Die Verbindung zum Server funktioniert gerade nicht.";

        setNeleStatus(
            "Die Verbindung funktioniert gerade nicht."
        );

        /*
        W przypadku błędu /chat nie korzystamy z backendu TTS.
        Komunikat zostanie odczytany bezpośrednio przez
        przeglądarkę.
        */

        try {
            await speakWithBrowserVoice(
                connectionMessage
            );

        } catch (voiceError) {
            console.error(
                "Nie udało się odtworzyć komunikatu błędu:",
                voiceError
            );
        }

        return null;
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

    document.body.classList.remove(
        "nele-is-listening"
    );
}


/*
========================================================
URUCHOMIENIE MIKROFONU
========================================================
*/

function startNeleListening() {
    console.log(
        "Kliknięto przycisk rozmowy z Nele."
    );

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        const message =
            "Entschuldigung. Die Spracherkennung wird in diesem Browser nicht unterstützt.";

        console.error(message);

        setNeleStatus(message);

        speakWithBrowserVoice(message).catch(
            function (error) {
                console.error(
                    "Nie udało się odtworzyć komunikatu:",
                    error
                );
            }
        );

        return;
    }

    stopNeleVoice();
    stopNeleListening();

    const recognition =
        new SpeechRecognition();

    neleRecognition = recognition;

    recognition.lang = "de-DE";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
        console.log("Nele hört zu...");

        document.body.classList.add(
            "nele-is-listening"
        );

        setNeleStatus("Nele hört zu …");
    };

    recognition.onresult = function (event) {
        const result =
            event.results[0][0];

        const recognizedText = String(
            result.transcript || ""
        ).trim();

        console.log(
            "Erkannt:",
            recognizedText
        );

        if (!recognizedText) {
            setNeleStatus(
                "Ich habe nichts gehört."
            );

            return;
        }

        setNeleStatus(
            `Sie haben gesagt: ${recognizedText}`
        );

        askNele(recognizedText);
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
            const message =
                "Bitte erlauben Sie den Zugriff auf das Mikrofon.";

            setNeleStatus(message);

            speakWithBrowserVoice(message).catch(
                function (error) {
                    console.error(error);
                }
            );

        } else if (event.error === "audio-capture") {
            const message =
                "Das Mikrofon wurde nicht gefunden.";

            setNeleStatus(message);

            speakWithBrowserVoice(message).catch(
                function (error) {
                    console.error(error);
                }
            );

        } else if (event.error === "no-speech") {
            setNeleStatus(
                "Ich habe nichts gehört. Bitte versuchen Sie es noch einmal."
            );

        } else {
            const message =
                "Entschuldigung. Ich konnte Sie nicht verstehen.";

            setNeleStatus(message);

            speakWithBrowserVoice(message).catch(
                function (error) {
                    console.error(error);
                }
            );
        }
    };

    recognition.onend = function () {
        console.log(
            "Rozpoznawanie mowy zakończone."
        );

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

        document.body.classList.remove(
            "nele-is-listening"
        );

        setNeleStatus(
            "Das Mikrofon konnte nicht gestartet werden."
        );
    }
}


/*
========================================================
ZATRZYMANIE WSZYSTKICH FUNKCJI NELE
========================================================
*/

function stopNele() {
    stopNeleListening();
    stopNeleVoice();

    setNeleStatus("Nele ist bereit.");
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
window.stopNele = stopNele;


/*
========================================================
WCZYTYWANIE GŁOSÓW PRZEGLĄDARKI
========================================================
*/

if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();

    window.speechSynthesis.onvoiceschanged =
        function () {
            window.speechSynthesis.getVoices();
        };
}
