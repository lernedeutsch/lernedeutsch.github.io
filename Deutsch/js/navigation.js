const menu = {
  lessons: [
    { name: "A1", link: "lessons/A1.html" },
    { name: "A2", link: "lessons/A2.html" },
    { name: "B1", link: "lessons/B1.html" }
  ]
};

function renderMenu(containerId, section) {
  const container = document.getElementById(containerId);

  if (!container) return;

  if (!menu[section]) return;

  menu[section].forEach(item => {
    const a = document.createElement("a");
    a.href = item.link;
    a.textContent = item.name;
    a.className = "land"; // styl z mapy
    container.appendChild(a);
  });
}
