import { initializePortraits, player, playerStats, enemy, applyStatsToCombat, applyConstitution, dungeonMode, dungeonEnemiesLeft, dungeonType, dungeonQueue, dungeonIndex, setEnemyName } from "./state.js";
import { updateUI, updatePlayerWeaponUI } from "./ui.js";
import { playerAttack, playerDefend, playerSkill, startPlayerTurn } from "./combat.js";
import { handleHitPress } from "./skillTiming.js";
import { openEnemyInfo, showDungeonIntro } from "./modal.js";
import { dungeonTypes } from "./dungeon.js";
import { tryQuestEncounter } from "./quest.js";
import { openPlayerInfoModal } from "./playerInfo.js";

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

  if (dungeonMode) tryQuestEncounter("merchantGuild", 5, () => {
    setEnemyName("Guild Smuggler");
    return location.reload();
  });

  initializePortraits();
  applyStatsToCombat(player, playerStats);
  applyConstitution(player);
  applyConstitution(enemy);
  updateUI();
  updatePlayerWeaponUI();

  if (playerStats.combatEncounter === true) {
    document.getElementById("continueBtn").style.display = "none";
  }
 document.getElementById("attackBtn").addEventListener("click", playerAttack);
  document.getElementById("defendBtn").addEventListener("click", playerDefend);

  const skillBtn = document.getElementById("skillBtn");
  const skillMenu = document.getElementById("skillMenu");

  skillBtn.onclick = () => {
  skillMenu.style.display = skillMenu.style.display === "flex" ? "none" : "flex";
};
  document.addEventListener("click", (e) => {
  if (!skillBtn.contains(e.target) && !skillMenu.contains(e.target)) {
    skillMenu.style.display = "none";
  }
});

  //document.getElementById("skillBtn").addEventListener("click", playerSkill);

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