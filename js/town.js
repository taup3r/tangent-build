import { player } from "./state.js";

// Phase 1: Simple navigation + dungeon start

export function setDungeonMode(enable) {
  if (enable) {
    localStorage.setItem("dungeonMode", "true");
  }
  else {
    localStorage.removeItem("dungeonMode");
    localStorage.removeItem("dungeonEnemiesLeft");
  }
}

export function setEnemiesLeft(count) {
  localStorage.setItem("dungeonEnemiesLeft", count);
}

document.getElementById("battleBtn").onclick = () => {
  // Normal single battle
  window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
};

document.getElementById("exploreBtn").onclick = () => {
  // Start dungeon mode with 8 enemies
  setDungeonMode(true);
  setEnemiesLeft(8);

  window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
};

export let dungeonMode = localStorage.getItem("dungeonMode") === "true";

export let dungeonEnemiesLeft = Number(localStorage.getItem("dungeonEnemiesLeft") || 0);