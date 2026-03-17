import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { generateWeapon, upgradeWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";

loadProgress();

document.getElementById("refineButton").onclick = () => {
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