import { player, playerStats, loadProgress } from "./state.js";
import { generateWeapon } from "./weapon.js";

const playerWeaponShopTimestamp = `${player.name}_weaponShopTimestamp`;
const playerWeaponShopInventory = `${player.name}_weaponShopInventory`;

loadProgress();

const shopList = document.getElementById("shopList");

document.getElementById("backButton").onclick = () => {
  window.location.href=`town.html?player=${encodeURIComponent(player.name)}`;
}

function getCurrentHourKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
}

function loadShopInventory() {
  const hourKey = getCurrentHourKey();
  const savedKey = localStorage.getItem(playerWeaponShopTimestamp);

  // If same hour → load saved inventory
  if (savedKey === hourKey) {
    const saved = JSON.parse(localStorage.getItem(playerWeaponShopInventory));
    return saved;
  }

  // Otherwise → generate new inventory
  const baseRank = player.weapon?.rank || 0;

  const newInventory = [];

  for (let i = 0; i < 5; i++) {
    const rankBoost = Math.floor(Math.random() * 11); // 0–10
    const weapon = generateWeapon(baseRank + rankBoost);
    newInventory.push(weapon);
  }

  // Save
  localStorage.setItem(playerWeaponShopTimestamp, hourKey);
  localStorage.setItem(playerWeaponShopInventory, JSON.stringify(newInventory));

  return newInventory;
}

function renderShop() {
  const inventory = loadShopInventory();

  shopList.innerHTML = "";

  inventory.forEach(w => {
    const el = document.createElement("div");
    el.classList.add("shop-item");

    el.innerHTML = `
      <div class="shop-weapon-name">${w.name}</div>
      <div class="shop-weapon-stats">${w.minDamage}–${w.maxDamage} dmg</div>
      <button class="buy-btn">Buy</button>
    `;

    // Hook up buy logic later
    shopList.appendChild(el);
  });
}

renderShop();