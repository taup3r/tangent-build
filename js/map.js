// Grid size
const SIZE = 6;

// Player start position
let playerX = 2;
let playerY = 2;

// Map locations
const locations = [
  { x: 1, y: 1, name: "Town Hall", desc: "Train your stats.", link: "stats.html" },
  { x: 4, y: 1, name: "Arena", desc: "Fight a random battle.", link: "combat.html" },
  { x: 1, y: 4, name: "Normal Dungeon", desc: "A modest challenge.", link: "combat.html?dungeon=normal" },
  { x: 3, y: 4, name: "Hard Dungeon", desc: "A dangerous expedition.", link: "combat.html?dungeon=hard" },
  { x: 5, y: 4, name: "Nightmare Dungeon", desc: "Only the brave survive.", link: "combat.html?dungeon=nightmare" }
];

const grid = document.getElementById("mapGrid");

// Render grid
function renderGrid() {
  grid.innerHTML = "";

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const tile = document.createElement("div");
      tile.classList.add("map-tile");

      // Player
      if (x === playerX && y === playerY) {
        tile.classList.add("player");
        tile.textContent = "You";
      }

      // Locations
      const loc = locations.find(l => l.x === x && l.y === y);
      if (loc) {
        tile.classList.add("location");
        tile.textContent = loc.name.split(" ")[0];
      }

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
    if (dir === "down" && playerY < SIZE - 1) playerY++;
    if (dir === "left" && playerX > 0) playerX--;
    if (dir === "right" && playerX < SIZE - 1) playerX++;

    renderGrid();
    checkNearbyLocations();
  });
});

// Check adjacency
function checkNearbyLocations() {
  const panel = document.getElementById("locationPanel");
  const nameEl = document.getElementById("locationName");
  const descEl = document.getElementById("locationDesc");
  const enterBtn = document.getElementById("locationEnterBtn");

  const nearby = locations.find(loc =>
    Math.abs(loc.x - playerX) + Math.abs(loc.y - playerY) === 1
  );

  if (nearby) {
    panel.style.display = "block";
    nameEl.textContent = nearby.name;
    descEl.textContent = nearby.desc;
    enterBtn.onclick = () => {
      window.location.href = nearby.link;
    };
  } else {
    panel.style.display = "none";
  }
}

document.getElementById("locationCloseBtn").onclick = () => {
  document.getElementById("locationPanel").style.display = "none";
};