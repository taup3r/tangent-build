import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { generateWeapon, upgradeWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";
import { showQuestList } from "./quest.js";
import { itemData, getItem, getNameByRarity, getColorByRarity, loadItems, saveItems, showItemList } from "./items.js";

loadProgress();
updateHeaderStats();
loadItems();

const weapon = player.weapon;
const id = getNameByRarity(weapon?.rarity || "ore-w");

const ore = getItem(id);
const price = itemData[id].use;
const name = itemData[id].name;
const color = getColorByRarity(weapon?.rarity || "ore-w");

document.getElementById("loreText").textContent = `Refining current weapon costs 1 ${name}, and charges ${price} gold when you decide to go with it.`;

//const refineOre = document.getElementById("refine-ore");
//refineOre.innerHTML = `<div style="color:${color}; font-weight:bold;">${name}</div>`;

const refineButton = document.getElementById("refineButton");
refineButton.textContent = `Refine for ${price}g`;

refineButton.onclick = () => {
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
      playerStats.gold -= price;
    });
  }  
};

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};