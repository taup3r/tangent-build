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

function getDifficulty() {
  const roll = Math.random();
  if (roll < 0.30) return "normal";
  if (roll < 0.60) return "hard";
  return "nightmare";
}