const fs = require("fs");
const path = require("path");
const assert = require("assert");

function read(relativePath) {
  return fs.readFileSync(
    path.join(__dirname, "..", relativePath),
    "utf8"
  );
}

function check(condition, message) {
  assert.ok(condition, message);
  console.log("✓ " + message);
}

const nele = read("deutschsprechen/nele.html");
const config = read("config/app-config.js");

check(
  nele.includes('<html lang="de">'),
  "deutschsprechen/nele.html is the German Nele page"
);

check(
  nele.includes('const CHAT_URL =') &&
  nele.includes('API_BASE + "/chat"'),
  "Nele sends chat messages to /chat"
);

check(
  nele.includes('const START_SESSION_URL =') &&
  nele.includes('API_BASE + "/api/session/start"'),
  "Nele starts sessions through /api/session/start"
);

check(
  nele.includes('"nele_student_id"') &&
  nele.includes("localStorage.getItem") &&
  nele.includes("localStorage.setItem"),
  "student_id is persisted in localStorage"
);

check(
  nele.includes('inputMode = "keyboard"') &&
  nele.includes("input_mode:inputMode"),
  "chat payload carries the input mode"
);

check(
  /askNele\(\s*text,\s*"keyboard"\s*\)/m.test(nele),
  "typed answers are marked as keyboard input"
);

check(
  /askNele\(\s*finalText,\s*"voice"\s*\)/m.test(nele),
  "microphone answers are marked as voice input"
);

check(
  nele.includes("window.SpeechRecognition") ||
  nele.includes("window.webkitSpeechRecognition"),
  "speech recognition support is wired into the Nele page"
);

check(
  nele.includes("data.meta?.activity === \"listening\"") &&
  nele.includes("speechText"),
  "listening exercises keep separate spoken content"
);

check(
  /"https:\/\/nele-backend\.onrender\.com"/.test(nele) ||
  /nele-backend\.onrender\.com/.test(config),
  "frontend has the Nele backend as its fallback/configured API"
);

console.log("\nAll frontend smoke tests passed.");
