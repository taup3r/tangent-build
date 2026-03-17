import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { generateWeapon, upgradeWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";

loadProgress();

document.getElementById("refineButton").onclick = () => {
  const weapon = player.weapon;
  let newWeapon;

  if (weapon) {
    newWeapon = upgradeWeapon(weapon, 1);
  } else {
    newWeapon = generateWeapon(1);
  }
};

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};