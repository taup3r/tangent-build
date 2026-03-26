import { player, playerStats, loadProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { showQuestList } from "./quest.js";
import { showItemList } from "./items.js";
import { weaponShopDiscount, getReputationTier, getReputationColor } from "./reputation.js";

const questButton = document.getElementById("questButton");
const itemButton = document.getElementById("itemButton");
const reputation = document.getElementById("currentReputation");

loadProgress();
updateHeaderStats();
loadReputationUI();

document.getElementById("loreText").textContent = "The Merchant Guild takes regulation on all goods prices and quests undertakings";

function loadReputationUI() {
  const rep = playerStats.reputation || 0;

  // Fill bar
  const fill = document.getElementById("repFill");
  fill.style.width = rep + "%";

  // Label
  const label = document.getElementById("repLabel");
  label.textContent = `${rep} / 100 — ${getReputationTier(rep)}`;

  fill.style.background = getReputationColor(rep);

  reputation.textContent = `You currently have ${weaponShopDiscount() || 0}% discount on shops.`;
}

const questList = document.getElementById("questList");

function getCurrentDayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

function loadQuestList() {
  const currentKey = getCurrentDayKey();
  //const savedKey = localStorage.getItem(playerQuestTimestamp);

  //const isValid = savedKey && savedKey === currentKey;

  //if (isValid) {
    //return savedInventory;
  //}

  const newQuests = [];
  //const quests = pl
  //newQuests.push()

  //while (newQuests.length < 5) {
    //const rankBoost = Math.floor(Math.random() * 10) + 1; // 1–10
    //const weapon = generateWeapon(baseRank + rankBoost);

    // prevent duplicates by name
    //if (!newInventory.some(w => w.name === weapon.name)) {
      //newInventory.push(weapon);
    //}
  //}

  //localStorage.setItem(playerWeaponShopTimestamp, hourKey);
  //saveShopInventory(newInventory);

  //return newQuests;
}

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};