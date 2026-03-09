import { player, loadProgress } from "./state.js";

loadProgress();

const playerQuests = `${player.name}_quests`;

export const questData = {
  "blacksmith": {
    flow: [
      {
        npc: "Blacksmith Roran",
        message: "Adventurer! I’ve lost my hammer somewhere near the dungeon entrance. Without it, I can’t forge anything. Could you help me find it?",
        submit: "Accept Quest"
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
  npcButton.textContent = questData[quest.id].flow[quest.stage].submit;

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

export function tryQuestEncounter(id, stage) {
  document.getElementById("ignoreButton").onclick = () => {
    ignoreQuest();
  };

  const quest = getQuest(id);

  // Only trigger if quest not started
  if (quest.stage === stage && Math.random() < (quest.chance/100) &&
quest.stage < quest.maxStage) {
    triggerQuest(quest);
  }
}