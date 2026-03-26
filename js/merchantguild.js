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

function renderQuests() {
  loadQuestState();
  const repeatableQuests = quests.filter(q => q.type === "repeatable");
  questList.innerHTML = "";

  repeatableQuests.forEach((q, index) => {
    const el = document.createElement("div");
    el.classList.add("quest-item");

    el.innerHTML = `
      <div class="quest-row">
        <span class="quest-name">${questData[q.id].title}</span>
        <button class="accept-btn">ACCEPT</button>
      </div>
    `;

    el.querySelector(".accept-btn").onclick = () => {
      /*
      openCompareWeapon(w,
        `Buy ${price}g`,
        () => {
          // Deduct gold
          if (playerStats.gold < price) return;
          player.weapon = w;
          playerStats.gold -= price;

          // Remove weapon from shop
          const updated = loadShopInventory();
          updated.splice(index, 1);
          saveShopInventory(updated);

          saveProgress();
          renderShop();
        }
      );
      */
    };

    questList.appendChild(el);
  });
}

renderQuests();

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};