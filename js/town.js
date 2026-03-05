import { player, setDungeonMode, startDungeon, loadProgress } from "./state.js";

// Phase 1: Simple navigation + dungeon start

loadProgress();

document.getElementById("battleBtn").onclick = () => {
  // Normal single battle
  window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
};

document.getElementById("exploreBtn").onclick = () => {
  // Start dungeon mode with 8 enemies
  setDungeonMode(true);
  startDungeon(getDifficulty());

  window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
};

document.getElementById("statButton").onclick = () => {
  openStatModal();
};

function getDifficulty() {
  const roll = Math.random();
  if (roll < 0.50) return "normal";
  if (roll < 0.80) return "hard";
  return "nightmare";
}

/* -------------------------
   STAT MENU
------------------------- */

function openStatModal() {
  const modal = document.getElementById("statModal");
  const frame = document.getElementById("statsFrame");

  frame.src = `stats.html?player=${encodeURIComponent(player.name)}`;
  modal.style.display = "flex";
}

function closeStatModal() {
  document.getElementById("statModal").style.display = "none";
}

window.addEventListener("message", (event) => {
  if (event.data === "close-stats") {
    closeStatModal();
  }
});