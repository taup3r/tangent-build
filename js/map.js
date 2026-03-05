import { player, playerStats, loadProgress } from "./state.js";

loadProgress();

const SIZE_X = 12;
const SIZE_Y = 15;

let playerX = 0;
let playerY = 14;

// HTML-rendered icons
const locations = [
  { x: 2, y: 12, name: "Town Hall", desc: "Train your stats.", icon: "🏛️", link: "stats.html" },
  { x: 0, y: 4, name: "Arena", desc: "Fight a random battle.", icon: "⚔️", link: "combat.html" },
  { x: 6, y: 6, name: "Normal Dungeon", desc: "A modest challenge.", icon: "🕳️", link: "combat.html?dungeon=normal" },
  { x: 11, y: 13, name: "Hard Dungeon", desc: "A dangerous expedition.", icon: "🔥", link: "combat.html?dungeon=hard" },
  { x: 9, y: 1, name: "Nightmare Dungeon", desc: "Only the brave survive.", icon: "💀", link: "combat.html?dungeon=nightmare" }
];

const grid = document.getElementById("mapGrid");

function renderPlayerInfo() {
  document.getElementById("playerName").textContent = player.name || "";
  document.getElementById("playerLevel").textContent = `Lv ${playerStats.level}`;
  document.getElementById("playerExp").textContent = `${playerStats.exp}/${playerStats.expToNext}`;
  document.getElementById("playerWeapon").textContent = player.weapon?.name || "";
}

renderPlayerInfo();

function renderGrid() {
  grid.innerHTML = "";

  for (let y = 0; y < SIZE_Y; y++) {
    for (let x = 0; x < SIZE_X; x++) {
      const tile = document.createElement("div");
      tile.classList.add("map-tile");

      if (x === playerX && y === playerY) {
        tile.classList.add("player");
        tile.textContent = "🧍";
      }

      const loc = locations.find(l => l.x === x && l.y === y);
      if (loc) tile.textContent = loc.icon;

      grid.appendChild(tile);
    }
  }
}

renderGrid();

// Movement
document.querySelectorAll(".move-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;

    if (dir === "up" && playerY > 0) playerY--;
    if (dir === "down" && playerY < SIZE_Y - 1) playerY++;
    if (dir === "left" && playerX > 0) playerX--;
    if (dir === "right" && playerX < SIZE_X - 1) playerX++;

    renderGrid();
    checkLocationStep();
  });
});

// Step-on activation
function checkLocationStep() {
  const loc = locations.find(l => l.x === playerX && l.y === playerY);
  if (!loc) return;

  openLocationModal(loc);
}

// Modal logic
function openLocationModal(loc) {
  document.getElementById("locationName").textContent = loc.name;
  document.getElementById("locationDesc").textContent = loc.desc;
  document.getElementById("locationIcon").textContent = loc.icon;

  document.getElementById("enterLocationBtn").onclick = () => {
    window.location.href = loc.link;
  };

  document.getElementById("locationModal").style.display = "flex";
}

document.getElementById("cancelLocationBtn").onclick = () => {
  document.getElementById("locationModal").style.display = "none";
};