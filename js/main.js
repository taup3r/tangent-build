import { initializePortraits, player, playerStats, enemy, enemyStats, applyStatsToCombat, applyConstitution } from "./state.js";
import { updateUI } from "./ui.js";
import { playerAttack, playerDefend, playerSkill, startPlayerTurn } from "./combat.js";
import { handleHitPress } from "./skillTiming.js";
import { openEnemyInfo } from "./modal.js";

window.addEventListener("DOMContentLoaded", () => {

  initializePortraits();
  applyStatsToCombat(player, playerStats);
  applyStatsToCombat(enemy, enemyStats);
  applyConstitution(player);
  
  // Apply weapon CON bonus
  const weaponCON = Number(enemy.weapon.stats.CON) || 0;
  enemy.CON += weaponCON;

  // Now apply constitution normally
  applyConstitution(enemy);
  updateUI();

  document.getElementById("attackBtn").addEventListener("click", playerAttack);
  document.getElementById("defendBtn").addEventListener("click", playerDefend);
  document.getElementById("skillBtn").addEventListener("click", playerSkill);

  document.getElementById("hitBtn").addEventListener("click", handleHitPress);

  document.getElementById("enemyInfoBtn").addEventListener("click", openEnemyInfo);

  startPlayerTurn();
});