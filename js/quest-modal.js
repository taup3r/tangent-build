import { loadQuestState, getQuest, triggerQuest, ignoreQuest } from "./quest.js";

function tryQuestEncounter() {
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