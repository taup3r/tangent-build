import { player, loadProgress } from "./state.js";

loadProgress();

const playerQuests = `${player.name}_quests`;

export const questData = {
  "blacksmith": {
    title: "The Lost Hammer",
    flow: [
      {
        npc: "Blacksmith Roran",
        message: "Adventurer! I’ve lost my hammer somewhere near the dungeon entrance. Without it, I can’t forge anything. Could you help me find it?",
        submit: "Accept Quest",
        cancel: "Ignore",
        nextChance: 50
      },{
        npc: "",
        message: "You found the Lost Hammer!",
        submit: "Pick it up",
        cancel: "Leave it",
        nextChance: 100
      },{
        npc: "Blacksmith Roran",
        message: "You found it! I can finally get back to work. Let me repay you properly.",
        submit: "Continue",
        nextChance: 100
      },{
        npc: "Blacksmith Roran",
        message: "Congratulations! Your weapon has been refined!",
        submit: "Accept",
        cancel: "Revert",
        nextChance: 10
      }
    ]
  }
};

export const quests = [
  {
    id: "blacksmith",
    chance: 50,
    stage: 0, // 0 = not started
    maxStage: 4, // 0 - disable
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

export function triggerQuest(quest, action = null) {
  const modal = document.getElementById("quest-modal");
  const questTitle = document.getElementById("questTitle");
  const npcName = document.getElementById("npcName");
  const npcText = document.getElementById("npcText");
  const npcButton = document.getElementById("npcButton");
  const ignoreButton = document.getElementById("ignoreButton");

  const currentQuest = questData[quest.id];
  const currentQuestStage = currentQuest.flow[quest.stage];

  questTitle.textContent = currentQuest.title;
  npcName.textContent = currentQuestStage.npc;
  npcText.textContent = currentQuestStage.message;
  npcButton.textContent = currentQuestStage.submit;
  if (currentQuestStage.cancel) {
    ignoreButton.textContent = currentQuestStage.cancel;
    ignoreButton.style.display = "flex";
  } else {
    ignoreButton.style.display = "none";
  }

  npcButton.onclick = () => {
    quest.stage += 1;
    quest.chance = currentQuestStage.nextChance;
    quest.active = true;
    saveQuestState();

    modal.style.display = "none";
    if (action) action();
  };

  modal.style.display = "flex";
}

export function ignoreQuest(action = null) {
  document.getElementById("quest-modal").style.display = "none";
  if (action) action();
}

export function tryQuestEncounter(id, stage, action = null, ignoreAction = null) {
  document.getElementById("ignoreButton").onclick = () => {
    ignoreQuest(ignoreAction);
  };

  const quest = getQuest(id);

  // Only trigger if quest not started
  if (quest.stage === stage && Math.random() < (quest.chance/100) &&
quest.stage < quest.maxStage) {
    triggerQuest(quest, action);
  } else {
    if (action) action();
  }
}