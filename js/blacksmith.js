import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { generateWeapon, upgradeWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";
import { showQuestList } from "./quest.js";
import { getItem, loadItems, saveItems, showItemList } from "./items.js";

loadProgress();
updateHeaderStats();
loadItems();

document.getElementById("loreText").textContent = "Refining current weapon costs 1 ore, and charges 1000 gold when you decide to go with it.";

const refineButton = document.getElementById("refineButton");
refineButton.textContent = "Refine 1 ore + 1000g";
refineButton.onclick = () => {
  const weapon = player.weapon;
  let refined;

  const ore = getItem("ore-w");
  if (playerStats.gold >= 1000 && ore.count >= 1) {
    // immediately reduces ore on attempt
    ore.count -= 1;
    saveItems();

    if (weapon) {
      refined = upgradeWeapon(weapon, 1);
    } else {
      refined = generateWeapon(2);
    }
    openCompareWeapon(refined, "Equip", () => {
      // then charges gold when equipped
      playerStats.gold -= 1000;
    });
  }  
};

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};