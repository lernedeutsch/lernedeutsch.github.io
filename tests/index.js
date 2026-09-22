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
const canonical = "https://lernedeutsch.github.io/deutschsprechen/nele.html";
const backend3 = "https://nele-backend-3.onrender.com";

check(
  rootNele.includes(canonical),
  "root Nele redirects to canonical Nele"
);

check(
  rootNele.includes(backend3),
  "root Nele declares backend 3.0"
);

check(
  rootNele.includes("NELE_SINGLE_USER"),
  "root Nele is marked as single-user"
);

check(
  map.includes(portalNele),
  "portal Nele button opens the root Nele entry point"
);

check(
  config.includes(backend3),
  "portal config uses backend 3.0"
);

check(
  config.includes("singleUser: true"),
  "portal config is single-user"
);

check(
  !config.includes("https://nele-backend.onrender.com"),
  "portal config does not use the old backend"
);

console.log("\nAll portal Nele 3.0 tests passed.");
