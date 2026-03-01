import { player, playerStats, setDungeonMode, setEnemiesLeft, loadProgress } from "./state.js";

// Phase 1: Simple navigation + dungeon start

loadProgress();

if (playerStats.statPoints > 0) {
  document.getElementById("statButton").style.display = "flex";
}

document.getElementById("statButton").onclick = () => {
  localStorage.setItem("statsReturnTo", `town.html?player=${encodeURIComponent(player.name)}`;
};);
  window.location.href = `train.html?player=${encodeURIComponent(player.name)}`;
};;
};

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