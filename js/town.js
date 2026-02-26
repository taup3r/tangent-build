// Phase 1: Simple navigation + dungeon start

export setDungeonMode(enable) {
  if (enable) {
    localStorage.setItem("dungeonMode", "true");
  }
  else {
    localStorage.removeItem("dungeonMode");
    localStorage.removeItem("dungeonEnemiesLeft");
  }
}

export setEnemiesLeft(count) {
  localStorage.setItem("dungeonEnemiesLeft", count);
}

document.getElementById("battleBtn").onclick = () => {
  // Normal single battle
  window.location.href = "combat.html";
};

document.getElementById("exploreBtn").onclick = () => {
  // Start dungeon mode with 8 enemies
  setDungeonMode(true);
  setEnemiesLeft(8);

  window.location.href = "combat.html";
};

export let dungeonMode = localStorage.getItem("dungeonMode") === "true";

export let dungeonEnemiesLeft = Number(localStorage.getItem("dungeonEnemiesLeft") || 0);