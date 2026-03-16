import { player, playerStats, loadProgress, saveProgress } from "./state.js";
//import { generateWeapon } from "./weapon.js";
//import { openCompareWeapon } from "./modal.js";

loadProgress();

document.getElementById("refineButton").onclick = () => {
  alert("refine here");
};

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};