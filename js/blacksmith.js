import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { generateWeapon, upgradeWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";
import { showQuestList } from "./quest.js";
import { itemData, getItem, loadItems, saveItems, showItemList } from "./items.js";

loadProgress();
updateHeaderStats();
loadItems();

document.getElementById("loreText").textContent = "Refining current weapon costs 1 ore, and charges 1000 gold when you decide to go with it.";

const ore = getItem("ore-w");
const price = 0;//itemData[ore.id].use;

const refineButton = document.getElementById("refineButton");
refineButton.textContent = `Refine 1 ore + ${price}g`;

refineButton.onclick = () => {
  const weapon = player.weapon;
  let refined;
  if (playerStats.gold >= price && ore.count >= 1) {
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