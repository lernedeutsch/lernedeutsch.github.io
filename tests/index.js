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

const rootNele = read("nele.html");
const duplicateNele = read("deutschsprechen/nele.html");
const testNele = read("deutschsprechen/nele-test-20260919.html");
const map = read("mapa-niemiec.html");
const config = read("config/app-config.js");

const canonical =
  "https://lernedeutsch.github.io/deutschsprechen/nele.html";

for (const [name, content] of [
  ["root Nele", rootNele],
  ["old deutschsprechen copy", duplicateNele],
  ["temporary Nele test page", testNele],
]) {
  check(
    content.includes(canonical),
    name + " points to canonical Nele"
  );

  check(
    !content.includes("localStorage.") &&
    !content.includes("nele_session_id") &&
    !content.includes("nele_student_id") &&
    !content.includes("nele3_student_id"),
    name + " cannot change learner identity"
  );

  check(
    !content.includes("nele-backend-3.onrender.com"),
    name + " cannot connect to backend-3"
  );
}

check(
  map.includes(canonical),
  "portal Nele button opens canonical Deutschsprechen Nele"
);

check(
  config.includes("https://nele-backend.onrender.com") &&
  !config.includes("nele-backend-3.onrender.com"),
  "portal config names only the production backend"
);

console.log("\nAll portal Nele isolation tests passed.");
