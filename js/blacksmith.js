import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { generateWeapon, upgradeWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";

loadProgress();
updateHeaderStats();

const refineButton = document.getElementById("refineButton");
refineButton.textContent = "Refine 1 ore + 1000g";
refineButton.onclick = () => {
  const weapon = player.weapon;
  let refined;

  if (playerStats.gold >= 1000 && playerStats.items["ore"] && playerStats.items["ore"].count || 0 > 0) {
    if (weapon) {
      refined = upgradeWeapon(weapon, 1);
    } else {
      refined = generateWeapon(2);
    }
    openCompareWeapon(refined, "Equip");
  }  
};

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};