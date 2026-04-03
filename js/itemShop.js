import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { generateWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";
import { showQuestList, loadQuestState, tryQuestEncounter, getQuest, questData } from "./quest.js";
import { showItemList } from "./items.js";
import { weaponShopDiscount } from "./reputation.js";

loadProgress();
loadQuestState();
updateHeaderStats();

const playerItemShopTimestamp = `${player.name}_itemShopTimestamp`;
const playerItemShopInventory = `${player.name}_itemShopInventory`;

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};

const shopList = document.getElementById("shopList");

function getCurrentHourKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
}

function loadShopInventory() {
  const hourKey = getCurrentHourKey();
  const savedKey = localStorage.getItem(playerItemShopTimestamp);
  const savedInventory = JSON.parse(localStorage.getItem(playerItemShopInventory));

  const isValid = savedKey &&
    savedKey === hourKey &&
    Array.isArray(savedInventory);

  if (isValid) {
    return savedInventory;
  }

  const newInventory = [];

  while (newInventory.length < 5) {
    const item = {
      id: "Tar",
      count: 10
    }

    // prevent duplicates by name
    if (!newInventory.some(i => i.id === item.id)) {
      newInventory.push(item);
    }
  }

  localStorage.setItem(playerItemShopTimestamp, hourKey);
  saveShopInventory(newInventory);

  return newInventory;
}

function saveShopInventory(inv) {
  localStorage.setItem(playerItemShopInventory, JSON.stringify(inv));
}

function renderShop() {
  const inventory = loadShopInventory();
  shopList.innerHTML = "";

  let discountPercent = 0;
  const merchantGuild = getQuest("merchantGuild");
  if (merchantGuild) {
    if (merchantGuild.stage >= questData["merchantGuild"].maxStage) {
      discountPercent = 0;
      document.getElementById("discountDisplay").textContent = `You enjoy a ${discountPercent}% discount from the Merchant Guild.`;
    }
  }

  inventory.forEach((i, index) => {
    let price = 10;
    price = Math.floor(price * (100-discountPercent)/100);

    const el = document.createElement("div");
    el.classList.add("shop-item");

    el.innerHTML = `
      <div class="shop-row">
        <span class="item-name">${i.id}</span>
        <button class="buy-btn">${price}g</button>
      </div>
    `;

    el.querySelector(".buy-btn").onclick = () => {
      // Deduct gold
      if (playerStats.gold < price) return;
      player.items.push(i);
      playerStats.gold -= price;

      // Remove weapon from shop
      const updated = loadShopInventory();
      updated.splice(index, 1);
      saveShopInventory(updated);

      saveProgress();
      renderShop();
    };

    shopList.appendChild(el);
  });
}

function questEncounters() {
  loadProgress();
  loadQuestState();
  tryQuestEncounter("merchantGuild", 0);
  tryQuestEncounter("merchantGuild", 3);
  tryQuestEncounter("merchantGuild", 7, () => {
    playerStats.gold += 500;
    playerStats.reputation += 3;
    saveProgress();
    tryQuestEncounter("merchantGuild", 8);
  });
}

renderShop();
//questEncounters();