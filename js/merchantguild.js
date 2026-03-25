import { player, playerStats, loadProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { showQuestList } from "./quest.js";
import { showItemList } from "./items.js";
import { weaponShopDiscount, getReputationTier } from "./reputation.js";

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
}

reputation.textContent = `Your current reputation is ${playerStats.reputation || 0} points\nYou currently have ${weaponShopDiscount()}% discount on shops.`;

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};