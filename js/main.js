import { initializePortraits, player, playerStats, enemy, applyStatsToCombat, applyConstitution, dungeonMode, dungeonEnemiesLeft, dungeonType, dungeonQueue, dungeonIndex } from "./state.js";
import { updateUI, updatePlayerWeaponUI } from "./ui.js";
import { playerAttack, playerDefend, playerSkill, startPlayerTurn } from "./combat.js";
import { handleHitPress } from "./skillTiming.js";
import { openEnemyInfo, openPlayerInfoModal, showDungeonIntro } from "./modal.js";
import { dungeonTypes } from "./dungeon.js";

function updateBattleHeader() {
  const header = document.getElementById("battleHeader");

  if (!dungeonMode) {
    header.textContent = "Random Encounter";
  } else {
    const type = dungeonTypes[dungeonType].name;
    const left = dungeonQueue.length - dungeonIndex;
    header.textContent = `${type} – ${left} Enemies Left`;
  }
}

window.addEventListener("DOMContentLoaded", () => {

  initializePortraits();
  applyStatsToCombat(player, playerStats);
  applyConstitution(player);
  applyConstitution(enemy);
  updateUI();
  updatePlayerWeaponUI();
 document.getElementById("attackBtn").addEventListener("click", playerAttack);
  document.getElementById("defendBtn").addEventListener("click", playerDefend);
  document.getElementById("skillBtn").addEventListener("click", playerSkill);

  document.getElementById("hitBtn").addEventListener("click", handleHitPress);
  document.getElementById("enemyInfoBtn").addEventListener("click", openEnemyInfo);


document.getElementById("openPlayerModal").addEventListener("click", openPlayerInfoModal);

  updateBattleHeader();
  if (dungeonMode) {
    if (dungeonIndex === 0) {
      showDungeonIntro();
    }
  }
  startPlayerTurn();
});