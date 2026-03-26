import { player, playerStats, loadProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { showQuestList, questData, quests, loadQuestState } from "./quest.js";
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
  loadQuestState();
  const currentKey = getCurrentDayKey();
  //const savedKey = localStorage.getItem(playerQuestTimestamp);

  //const isValid = savedKey && savedKey === currentKey;

  //if (isValid) {
    //return savedInventory;
  //}

  const repeatableQuests = quests.filter(q => q.type === "repeatable");

  for (let i = repeatableQuests.length - 1; i > 0; i--) {
    
  }

  //localStorage.setItem(playerWeaponShopTimestamp, hourKey);
  //saveShopInventory(newInventory);

  //return newQuests;
}

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};