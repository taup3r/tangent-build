loadProgress();

const playerQuests = `${player.name}_quests`;

export const questData = [
  {
    id: "blacksmith",
    flow: [
      {
        npc: "Blacksmith Roran",
        message: "Adventurer! I’ve lost my hammer somewhere near the dungeon entrance. Without it, I can’t forge anything. Could you help me find it?"
      }
    ]
  }
];

export const quests = [
  {
    id: "blacksmith",
    stage: 0, // 0 = not started
    maxStage: 4,
    active: false,
    data: {} // for storing hammerFound, etc.
  }
];

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

export function triggerQuestIntro(quest) {
  const modal = document.getElementById("npcModal");
  const npcName = document.getElementById("npcName");
  const npcText = document.getElementById("npcText");
  const npcButton = document.getElementById("npcButton");

  npcName.textContent = quest.npcIntro;
  npcText.textContent =
    ;

  npcButton.textContent = "Accept Quest";

  npcButton.onclick = () => {
    const blacksmith = getQuest("blacksmith");
    blacksmith.stage = 1;
    blacksmith.active = true;
    saveQuestState();

    modal.style.display = "none";
  };

  modal.style.display = "flex";
}