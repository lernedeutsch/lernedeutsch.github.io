# deutsch.github.io
# Lerne Deutsch

Interaktywna strona do nauki języka niemieckiego z lekcjami, ćwiczeniami, mapą Niemiec, chatbotem oraz zapisem postępów użytkownika.

## Opis projektu

Projekt został przygotowany jako rozwijająca się platforma edukacyjna dla osób uczących się niemieckiego. Strona ma być przejrzysta, interaktywna i łatwa do rozbudowy o kolejne poziomy językowe, materiały multimedialne oraz inteligentnego chatbota wspierającego naukę.

## Funkcje

- Lekcje języka niemieckiego od poziomu A1 do C2.
- Ćwiczenia i zadania utrwalające materiał.
- Mapa Niemiec jako interaktywna nawigacja po treściach.
- Chatbot wspierający naukę i powtarzanie materiału.
- Zapis postępów użytkownika.
- Obsługa multimediów: obrazów, audio, animacji i wideo.
- Struktura przygotowana pod dalszy rozwój na GitHub Pages.

## Struktura projektu

```text
niemiecki/
├── index.html
├── mapa-niemiec.html
├── README.md
├── .gitignore
├── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── assets/
│   ├── images/
│   ├── audio/
│   ├── animations/
│   └── videos/
├── css/
├── js/
├── config/
├── chatbot/
├── lessons/
├── exercises/
├── data/
├── tests/
└── user/
```

## Najważniejsze katalogi

- `index.html` – strona główna projektu.
- `mapa-niemiec.html` – strona z mapą i nawigacją po poziomach.
- `assets/` – wszystkie zasoby multimedialne.
- `css/` – pliki stylów.
- `js/` – główna logika strony.
- `config/` – konfiguracja aplikacji, tras i języków.
- `chatbot/` – logika chatbota, parser, scoring i pamięć.
- `lessons/` – gotowe strony lekcji według poziomów.
- `exercises/` – ćwiczenia i zadania.
- `data/` – dane do lekcji, słownictwa, gramatyki i metadanych.
- `tests/` – testy jednostkowe i integracyjne.
- `user/` – progres, ustawienia i statystyki użytkownika.

## Uruchomienie projektu

### Lokalnie
1. Pobierz lub sklonuj repozytorium.
2. Otwórz `index.html` w przeglądarce.

### GitHub Pages
1. Umieść projekt w repozytorium GitHub.
2. Włącz GitHub Pages w ustawieniach repozytorium.
3. Jako źródło wybierz gałąź główną i katalog główny projektu.
4. Strona będzie dostępna po opublikowaniu.

## Dodawanie nowych lekcji

Nowe materiały dodawaj do odpowiednich folderów poziomów, np.:

- `lessons/A1/`
- `lessons/A2/`
- `lessons/B1/`

Dane lekcji możesz zapisywać także w folderze `data/`, aby oddzielić treść od wyglądu strony.

## Chatbot

Chatbot jest osobnym modułem, aby łatwiej go rozwijać i testować. Zawiera między innymi:
- silnik rozmowy,
- budowanie promptów,
- parser odpowiedzi,
- ocenianie odpowiedzi,
- pamięć konwersacji.

## Testy

Folder `tests/` służy do testowania najważniejszych elementów projektu, takich jak:
- pamięć chatbota,
- parser,
- scorer,
- logika aplikacji,
- elementy UI.

## Zasady organizacji kodu

- Używaj małych liter w nazwach plików i folderów.
- Trzymaj multimedia w `assets/`.
- Oddzielaj dane od logiki i widoku.
- Każdy poziom językowy powinien mieć podobną strukturę.
- Wszystkie linki w HTML powinny prowadzić do poprawnych ścieżek względnych.

## Autor

Projekt tworzony jako platforma do nauki języka niemieckiego.

## Licencja

Do uzupełnienia według twoich potrzeb.
