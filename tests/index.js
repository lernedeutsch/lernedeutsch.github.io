const fs = require("fs");
const path = require("path");
const assert = require("assert");

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8");
}

function check(condition, message) {
  assert.ok(condition, message);
  console.log("✓ " + message);
}

const rootNele = read("nele.html");
const map = read("mapa-niemiec.html");
const config = read("config/app-config.js");

const portalNele = "https://lernedeutsch.github.io/nele.html";
const nele2 = "https://nele2-backend.onrender.com";
const backend3 = "https://nele-backend-3.onrender.com";

check(
  map.includes(portalNele),
  "portal Nele button opens the separate root Nele page"
);

check(
  rootNele.includes(nele2),
  "root Nele uses the Nele2 backend"
);

check(
  config.includes(nele2),
  "portal config uses the Nele2 backend"
);

check(
  !rootNele.includes(backend3),
  "root Nele does not use backend 3.0"
);

check(
  !config.includes(backend3),
  "portal config does not use backend 3.0"
);

check(
  rootNele.includes("nele2_student_id"),
  "root Nele uses the Nele2 local-storage key"
);

console.log("\nAll portal Nele2 wiring tests passed.");
