import { player, setDungeonMode, setEnemiesLeft, loadProgress } from "./state.js";

// Phase 1: Simple navigation + dungeon start

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