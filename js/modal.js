/* ============================================
   MODAL MODULE
============================================ */

import { player, enemy } from "./state.js";
import { playerStats, gainExp, loseExp, saveProgress, applyStatsToCombat } from "./state.js";
import { updatePlayerWeaponUI } from "./ui.js";

/* -------------------------
   SHOW RESULT MODAL
------------------------- */

export function showResultModal(victory) {
  const modal = document.getElementById("resultModal");
  const title = document.getElementById("resultTitle");
  const logBox = document.getElementById("resultLog");
  document.getElementById("lootWeaponBtn").onclick = () => {
  openCompareWeaponModal();
  document.getElementById("lootWeaponBtn").style.display = "none";
  };
  document.getElementById("victoryWeaponPreview").innerHTML =
  `<span style="color:${enemy.weapon.color}">🗡️ ${enemy.weapon.name}</span>`;

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

  if (victory) {
    document.getElementById("lootWeaponBtn").style.display = "block";
  }
}

export function openCompareWeaponModal() {
  const modal = document.getElementById("compareWeaponModal");
  modal.style.display = "flex";

  const current = player.weapon;
  const enemyW = enemy.weapon;

  // --- Current weapon ---
  if (current) {
    document.getElementById("compareCurrentName").textContent = current.name;
    document.getElementById("compareCurrentName").style.color = current.color;

    document.getElementById("compareCurrentDamage").textContent =
      `${current.damage.min} – ${current.damage.max}`;

    const mods = Object.entries(current.stats)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => `${k}+${v}`)
      .join(", ");

    document.getElementById("compareCurrentStats").textContent =
      mods || "None";
  } else {
    document.getElementById("compareCurrentName").textContent = "Unarmed";
    document.getElementById("compareCurrentName").style.color = "#ccc";
    document.getElementById("compareCurrentDamage").textContent = "-";
    document.getElementById("compareCurrentStats").textContent = "-";
  }

  // --- Enemy weapon ---
  document.getElementById("compareEnemyName").textContent = enemyW.name;
  document.getElementById("compareEnemyName").style.color = enemyW.color;

  document.getElementById("compareEnemyDamage").textContent =
    `${enemyW.damage.min} – ${enemyW.damage.max}`;

  const enemyMods = Object.entries(enemyW.stats)
    .filter(([_, v]) => v > 0)
    .map(([k, v]) => `${k}+${v}`)
    .join(", ");

  document.getElementById("compareEnemyStats").textContent =
    enemyMods || "None";

  // Equip button
  document.getElementById("compareEquipBtn").onclick = () => {
    player.weapon = enemyW;
    applyConstitution(player); // weapon CON integration
    updatePlayerWeaponUI();
    saveProgress();
    modal.style.display = "none";
  };

  // Cancel button
  document.getElementById("compareCancelBtn").onclick = () => {
    modal.style.display = "none";
  };
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
  applyStatsToCombat(player, playerStats);

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

// Weapon name
const w = enemy.weapon;
document.getElementById("enemyProfileWeapon").textContent = w.name;
document.getElementById("enemyProfileWeapon").style.color = w.color;

// Damage range
document.getElementById("enemyProfileWeaponDamage").textContent =
  `${w.damage.min} – ${w.damage.max}`;

// Stat modifiers (STR +1, DEX +2, etc.)
const statStrings = Object.entries(w.stats)
  .filter(([_, val]) => val > 0)
  .map(([stat, val]) => `${stat} +${val}`);

document.getElementById("enemyProfileWeaponStats").textContent =
  statStrings.length > 0 ? statStrings.join(", ") : "None";
}

export function closeEnemyInfo() {
  document.getElementById("enemyInfoModal").style.display = "none";
}

export function closePlayerInfo() {
  document.getElementById("playerModal").style.display = "none";
}

export function openPlayerInfoModal() {
  const modal = document.getElementById("playerModal");
  modal.style.display = "flex";

  // Portrait
  document.getElementById("playerInfoPortrait").src =
    document.getElementById("playerPortrait").src;

  // Name + Level
  document.getElementById("playerInfoName").textContent = "Player";
  document.getElementById("playerInfoLevel").textContent = playerStats.level;

  // Stats (after weapon bonuses)
  document.getElementById("playerInfoSTR").textContent = player.STR;
  document.getElementById("playerInfoDEX").textContent = player.DEX;
  document.getElementById("playerInfoAGI").textContent = player.AGI;
  document.getElementById("playerInfoCON").textContent = player.CON;

  // Weapon section
  if (player.weapon) {
    const w = player.weapon;

    // Weapon name
    document.getElementById("playerProfileWeapon").textContent = w.name;
    document.getElementById("playerProfileWeapon").style.color = w.color;

    // Damage range
    document.getElementById("playerProfileWeaponDamage").textContent =
      `${w.damage.min} – ${w.damage.max}`;

    // Stat modifiers (STR +1, DEX +2, etc.)
    const statStrings = Object.entries(w.stats)
      .filter(([_, val]) => val > 0)
      .map(([stat, val]) => `${stat} +${val}`);

    document.getElementById("playerProfileWeaponStats").textContent =
      statStrings.length > 0 ? statStrings.join(", ") : "None";

  } else {
    // No weapon equipped
    document.getElementById("playerProfileWeapon").textContent = "Unarmed";
    document.getElementById("playerProfileWeapon").style.color = "#ccc";
    document.getElementById("playerProfileWeaponDamage").textContent = "-";
    document.getElementById("playerProfileWeaponStats").textContent = "-";
  }
}

window.openEnemyInfo = openEnemyInfo;
window.closeEnemyInfo = closeEnemyInfo;
window.closePlayerInfo = closePlayerInfo;
window.openCompareWeaponModal = openCompareWeaponModal;

/* -------------------------
   RESTART
------------------------- */

export function startNewBattle() {
  location.reload();
}

window.startNewBattle = startNewBattle;
