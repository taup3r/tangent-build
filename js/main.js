import { initializePortraits } from "./state.js";
import { updateUI } from "./ui.js";
import { playerAttack, playerDefend, playerSkill, startPlayerTurn } from "./combat.js";
import { handleHitPress } from "./skillTiming.js";
import { openEnemyInfo } from "./modal.js";

window.addEventListener("DOMContentLoaded", () => {

  initializePortraits();
  updateUI();

  document.getElementById("attackBtn").addEventListener("click", playerAttack);
  document.getElementById("defendBtn").addEventListener("click", playerDefend);
  document.getElementById("skillBtn").addEventListener("click", playerSkill);

  document.getElementById("hitBtn").addEventListener("click", handleHitPress);

  document.getElementById("enemyInfoBtn").addEventListener("click", openEnemyInfo);

  startPlayerTurn();
});