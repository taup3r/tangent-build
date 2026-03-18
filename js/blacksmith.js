import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { generateWeapon, upgradeWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";

loadProgress();

const refineButton = document.getElementById("refineButton");
refineButton.textContent = "Refine 1 ore + 3000g";
refineButton.onclick = () => {
  const weapon = player.weapon;
  let refined;

  if (weapon) {
    refined = upgradeWeapon(weapon, 1);
  } else {
    refined = generateWeapon(2);
  }
  openCompareWeapon(refined, "Equip");
};

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};