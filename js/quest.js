import { player, loadProgress } from "./state.js";

loadProgress();

const playerQuests = `${player.name}_quests`;

export const questData = {
  "blacksmith": {
    flow: [
      {
        npc: "Blacksmith Roran",
        message: "Adventurer! I’ve lost my hammer somewhere near the dungeon entrance. Without it, I can’t forge anything. Could you help me find it?"
      }
    ]
  }
};

export const quests = [
  {
    id: "blacksmith",
    chance: 50,
    stage: 0, // 0 = not started
    maxStage: 1, // 0 - disable
    active: false,
    data: {} // for storing hammerFound, etc.
  }
];

loadQuestState();

export function loadQuestState() {
  const saved = JSON.parse(localStorage.getItem(playerQuests) || "[]");
  if (saved.length > 0) {
    quests.forEach((q, i) => {
      quests[i] = { ...q, ...saved[i] };
    });
  }
}

export function saveQuestState() {
  localStorage.setItem(playerQuests, JSON.stringify(quests));
}

export function getQuest(id) {
  return quests.find(q => q.id === id);
}

export function triggerQuest(quest) {
  const modal = document.getElementById("quest-modal");
  const npcName = document.getElementById("npcName");
  const npcText = document.getElementById("npcText");
  const npcButton = document.getElementById("npcButton");

  npcName.textContent = questData[quest.id].flow[quest.stage].npc;
  npcText.textContent = questData[quest.id].flow[quest.stage].message;

  npcButton.textContent = "Accept Quest";

  npcButton.onclick = () => {
    quest.stage += 1;
    quest.active = true;
    saveQuestState();

    modal.style.display = "none";
  };

  modal.style.display = "flex";
}

export function ignoreQuest() {
  document.getElementById("quest-modal").style.display = "none";
}

export function tryQuestEncounter() {
  document.getElementById("ignoreButton").onclick = () => {
    ignoreQuest();
  };

  const blacksmith = getQuest("blacksmith");

  // Only trigger if quest not started
  if (blacksmith.stage === 0 && Math.random() < (blacksmith.chance/100) &&
blacksmith.stage < blacksmith.maxStage) {
    triggerQuest(blacksmith);
  }
}

fetch("quest-modal.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("quest-modal-container").innerHTML = html;

    const modal = document.getElementById("quest-modal");
    const closeBtn = modal.querySelector(".close");

    closeBtn.onclick = () => modal.style.display = "none";
});