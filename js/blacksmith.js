import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { generateWeapon, upgradeWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";
import { showQuestList } from "./quest.js";
import { itemData, getItem, getNameByRarity, getColorByRarity, loadItems, saveItems, showItemList, oreData } from "./items.js";

loadProgress();
updateHeaderStats();
loadItems();

const weapon = player.weapon;
const id = getNameByRarity(weapon?.rarity || "Common");

const weaponOre = getItem(id);
const price = itemData[id].use;
const name = itemData[id].name;
const color = getColorByRarity(weapon?.rarity || "Common");

document.getElementById("loreText").textContent = `Upgrading current weapon costs 1 ${name}, and charges ${price} gold when you decide to go with it.`;

const refineOre = document.getElementById("refine-ore");
refineOre.innerHTML = `<p>To upgrade your weapon you need:</p><h3 style="color:${color}; font-weight:bold;">${name}</h3>`;
  
const refineButton = document.getElementById("refineButton");
refineButton.textContent = `Upgrade weapon for ${price}g`;

refineButton.onclick = () => {
  let refined;
  if (playerStats.gold >= price && ore.count >= 1) {
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
    });
  }  
};

const oreList = document.getElementById("ore-list");
oreList.innerHTML = "";

Object.keys(oreData).forEach(key => {
  const ore = getItem(key);
  const qty = ore.count;
  const oreName = itemData[key].name;
  const grp = oreData[key].group;
  const tier = oreData[key].tier;
  const nextKey = oreData[key].next;
  const nextOreName = itemData[nextKey].name;

  if (qty >= grp) {
    const entry = document.createElement("div");
    entry.classList.add("ore-entry");

    entry.innerHTML = `
      <span class="ore-name">${oreName} (${qty})</span>
      <button class="refine-btn" id="refine_${tier}">
        Refine to ${nextOreName} for ${tier*tier*500}g
      </button>
    `;

    oreList.appendChild(entry);
    document.getElementById(`refine_${tier}`).onclick = () => {
      //todo
    };
  }
});

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};