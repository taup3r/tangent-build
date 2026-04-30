import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { showQuestList, questData, getQuest } from "./quest.js";
import { itemData, getItem, getNameByRarity, getColorByRarity, loadItems, saveItems, showItemList, oreData } from "./items.js";

loadProgress();
updateHeaderStats();

document.getElementById("loreText").textContent = `Upgrading current weapon costs 1 ${name}, and charges ${price} gold when you decide to go with it.`;

const refineButton = document.getElementById("ore-list");
refineButton.onclick = () => {
  let refined;
  if (playerStats.gold >= price && weaponOre.count >= 1) {
    // immediately reduces ore on attempt
    weaponOre.count -= 1;
    saveItems();

    if (weapon) {
      refined = upgradeWeapon(weapon, 1);
    } else {
      refined = generateWeapon(2);
    }
    openCompareWeapon(refined, "Equip", () => {
      // then charges gold when equipped
      playerStats.gold -= price;
      player.weapon = refined;
      saveProgress();
      location.reload();
    });
  }  
};

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};