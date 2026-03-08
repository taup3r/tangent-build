import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { generateWeapon } from "./weapon.js";
import { openCompareWeapon } from "./modal.js";

loadProgress();

const playerWeaponShopTimestamp = `${player.name}_weaponShopTimestamp`;
const playerWeaponShopInventory = `${player.name}_weaponShopInventory`;

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
  const savedKey = localStorage.getItem(playerWeaponShopTimestamp);

  if (savedKey === hourKey) {
    return JSON.parse(localStorage.getItem(playerWeaponShopInventory));
  }

  const baseRank = player.weapon?.baseRank + player.weapon?.remainingRank;
  const newInventory = [];

  for (let i = 0; i < 5; i++) {
    const rankBoost = Math.floor(Math.random() * 11); // 0–10
    const weapon = generateWeapon(baseRank + rankBoost);
    newInventory.push(weapon);
  }

  localStorage.setItem(playerWeaponShopTimestamp, hourKey);
  localStorage.setItem(playerWeaponShopInventory, JSON.stringify(newInventory));

  return newInventory;
}

function saveShopInventory(inv) {
  localStorage.setItem(playerWeaponShopInventory, JSON.stringify(inv));
}

function renderShop() {
  const inventory = loadShopInventory();
  shopList.innerHTML = "";

  inventory.forEach((w, index) => {
    const price = w.rank * 5;

    const el = document.createElement("div");
    el.classList.add("shop-item");

    el.innerHTML = `
      <div class="shop-row">
        <span class="weapon-name" style="color:${w.color}">${w.name}</span>
        <button class="buy-btn">${price}g</button>
      </div>
    `;

    el.querySelector(".buy-btn").onclick = () => {
      openCompareWeapon(w,
        `Buy ${price}g`,
        () => {
          // Deduct gold
          playerStats.gold -= price;

          // Remove weapon from shop
          const updated = loadShopInventory();
          updated.splice(index, 1);
          saveShopInventory(updated);

          saveProgress();
          renderShop();
        }
      );
    };

    shopList.appendChild(el);
  });
}

renderShop();