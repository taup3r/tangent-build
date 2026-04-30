import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { showQuestList, questData, getQuest } from "./quest.js";
import { itemData, getItem, getNameByRarity, getColorByRarity, loadItems, saveItems, showItemList, oreData } from "./items.js";

loadProgress();
updateHeaderStats();

document.getElementById("loreText").textContent = `Select a recipe and craft and item here.`;

const craftButton = document.getElementById("craftButton");
craftButton.onclick = () => {
  //todo
};

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};