// Phase 1: Simple navigation + dungeon start

document.getElementById("battleBtn").onclick = () => {
  // Normal single battle
  window.location.href = "combat.html";
};

document.getElementById("exploreBtn").onclick = () => {
  // Start dungeon mode with 8 enemies
  localStorage.setItem("dungeonMode", "true");
  localStorage.setItem("dungeonEnemiesLeft", "8");

  window.location.href = "combat.html";
};