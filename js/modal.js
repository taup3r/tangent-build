/* ============================================
   MODAL MODULE
============================================ */

import { player, enemy } from "./state.js";
import { playerStats, gainExp, loseExp, saveProgress } from "./state.js";

/* -------------------------
   SHOW RESULT MODAL
------------------------- */

export function showResultModal(victory) {
  const modal = document.getElementById("resultModal");
  const title = document.getElementById("resultTitle");
  const logBox = document.getElementById("resultLog");

  const rawLog = document.getElementById("log").textContent;
  logBox.innerHTML = rawLog.replace(/\n/g, "<br>");

  if (victory) {
    title.textContent = "Victory!";
    const expGain = enemy.level * 10;
    gainExp(expGain);
    logBox.innerHTML += `<br><b>Gained ${expGain} EXP</b>`;
  } else {
    title.textContent = "Defeat";
    const expLoss = Math.floor(enemy.level * 10 * 0.1);
    loseExp(expLoss);
    logBox.innerHTML += `<br><b>Lost ${expLoss} EXP</b>`;
  }

  modal.style.display = "flex";

  if (playerStats.statPoints > 0) {
    document.getElementById("statButton").style.display = "block";
  }
}

/* -------------------------
   CHECK WIN / LOSE
------------------------- */

export function checkWin() {
  if (enemy.hp <= 0) {
    document.getElementById("log").textContent += `You defeated ${enemy.name}!\n`;
    showResultModal(true);
    return true;
  }

  if (player.hp <= 0) {
    document.getElementById("log").textContent += "You were defeated!\n";
    showResultModal(false);
    return true;
  }

  return false;
}

/* -------------------------
   STAT MENU
------------------------- */

export function openStatMenu() {
  document.getElementById("statModal").style.display = "flex";
  updateStatMenu();
}

export function closeStatMenu() {
  document.getElementById("statModal").style.display = "none";
}

export function addStat(stat) {
  if (playerStats.statPoints <= 0) return;

  playerStats[stat]++;
  playerStats.statPoints--;

  saveProgress();
  updateStatMenu();
}

function updateStatMenu() {
  document.getElementById("statPointsLeft").textContent =
    `Points left: ${playerStats.statPoints}`;

  document.getElementById("strVal").textContent = playerStats.STR;
  document.getElementById("dexVal").textContent = playerStats.DEX;
  document.getElementById("agiVal").textContent = playerStats.AGI;
  document.getElementById("conVal").textContent = playerStats.CON;
}

/* Expose to window */
window.openStatMenu = openStatMenu;
window.closeStatMenu = closeStatMenu;
window.addStat = addStat;

/* -------------------------
   ENEMY PROFILE MODAL
------------------------- */

export function openEnemyInfo() {
  document.getElementById("enemyInfoModal").style.display = "flex";

  document.getElementById("enemyInfoPortrait").src =
    document.getElementById("enemyPortrait").src;

  document.getElementById("enemyInfoName").textContent = enemy.name;
  document.getElementById("enemyInfoLevel").textContent = enemy.level;
  document.getElementById("enemyInfoType").textContent = enemy.type;
  document.getElementById("enemyInfoHint").textContent = enemy.hint;

  document.getElementById("enemyInfoSTR").textContent = enemy.stats.STR;
  document.getElementById("enemyInfoDEX").textContent = enemy.stats.DEX;
  document.getElementById("enemyInfoAGI").textContent = enemy.stats.AGI;
  document.getElementById("enemyInfoCON").textContent = enemy.stats.CON;
}

export function closeEnemyInfo() {
  document.getElementById("enemyInfoModal").style.display = "none";
}

window.openEnemyInfo = openEnemyInfo;
window.closeEnemyInfo = closeEnemyInfo;

/* -------------------------
   RESTART
------------------------- */

export function startNewBattle() {
  location.reload();
}

window.startNewBattle = startNewBattle;
