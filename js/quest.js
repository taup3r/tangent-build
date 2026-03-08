loadProgress();

const playerQuests = `${player.name}_quests`;

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