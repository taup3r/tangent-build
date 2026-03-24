import { player, playerStats, loadProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { showQuestList } from "./quest.js";
import { showItemList } from "./items.js";
import { weaponShopDiscount } from "./reputation.js";

const questButton = document.getElementById("questButton");
const itemButton = document.getElementById("itemButton");
const reputation = document.getElementById("currentReputation");

loadProgress();
updateHeaderStats();

document.getElementById("loreText").textContent = "The Merchant Guild takes regulation on all goods prices and quests undertakings";

reputation.textContent = `Your current reputation is ${playerStats.reputation || 0} points\nYou currently have ${weaponShopDiscount()}% discount on shops.`;

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};