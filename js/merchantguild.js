import { player, playerStats, loadProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { showQuestList, questData, quests, loadQuestState, tryQuestEncounter } from "./quest.js";
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
  const repeatableQuests = quests.filter(q => questData[q.id].type === "repeatable");
  questList.innerHTML = "";

  repeatableQuests.forEach((q, index) => {
    const el = document.createElement("div");
    el.classList.add("quest-item");
    const completed = q.stage === questData[q.id].maxStage;
    const notStarted = q.active === false;
    let status;
    let btnState = "disabled";
    if (notStarted) {
      status = "Start";
      btnState = "";
    } else if (completed) {
      status = "Completed";
    } else {
      status = "In Progress";
    }

    el.innerHTML = `
      <div class="guild-quest-entry">
        <p>${questData[q.id].title}</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${(q.count / questData[q.id].maxCount) * 100}%"></div>
        </div>
        <button class="guild-quest-btn" ${btnState}>${status}</button>
      </div>
    `;

    el.querySelector(".guild-quest-btn").onclick = () => {
        if (q.stage === 0) tryQuestEncounter(q.id, 0, () => location.reload());
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