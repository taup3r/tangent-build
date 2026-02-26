/* ============================================
   MODAL MODULE
============================================ */

import { player, enemy } from "./state.js";
import { playerStats, gainExp, loseExp, saveProgress, applyStatsToCombat } from "./state.js";
import { updatePlayerWeaponUI } from "./ui.js";

/* ============================================
   HELPERS: THEMES, EXP ANIMATION, DANGER RATING
============================================ */

// Color-coded modal themes based on enemy tier
function applyModalTheme(modal, tier) {
  const box = modal.querySelector(".modal-content");
  if (!box) return;

  if (tier === "elite") {
    box.style.border = "3px solid #ffcc00";
    box.style.boxShadow = "0 0 15px #ffcc00aa";
  } else if (tier === "boss") {
    box.style.border = "3px solid #ff4444";
    box.style.boxShadow = "0 0 15px #ff4444aa";
  } else {
    box.style.border = "3px solid #4aa3ff";
    box.style.boxShadow = "0 0 15px #4aa3ffaa";
  }
}

// Animated EXP gain
function animateExpGain(element, start, end, duration = 600) {
  const diff = end - start;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + diff * progress);
    element.innerHTML = `<b>Gained ${value} EXP</b>`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function animateExpLoss(element, start, end, duration = 600) {
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + end * progress);
    element.innerHTML = `<b style="color:#ff4444;">Lost ${value} EXP</b>`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Danger rating (skulls)
function getDangerRating(playerLevel, enemyLevel) {
  const diff = enemyLevel - playerLevel;

  if (diff <= 0) return "★";
  if (diff === 1) return "★★";
  if (diff === 2) return "★★★";
  return "★★★★"; // Boss-level threat
}

/* -------------------------
   SHOW RESULT MODAL
------------------------- */

export function showResultModal(victory) {
  const modal = document.getElementById("resultModal");
  const title = document.getElementById("resultTitle");
  const logBox = document.getElementById("resultLog");

  // Clear EXP display area
  const expDisplay = document.getElementById("expGainDisplay");
  expDisplay.innerHTML = "";

  // Restore loot button click
  document.getElementById("lootWeaponBtn").onclick = () => {
    openCompareWeaponModal();
  };

  // Determine enemy name color based on tier
  let enemyNameColor = "";
  if (enemy.type === "elite") enemyNameColor = "#ffcc00";
  else if (enemy.type === "boss") enemyNameColor = "#ff4444";
  // Normal enemies → no color

  const enemyNameStyled = enemyNameColor
    ? `<span style="color:${enemyNameColor}; font-weight:bold;">${enemy.name}</span>`
    : `<span style="font-weight:bold;">${enemy.name}</span>`;

  // Loot preview (updated)
  const lootBox = document.getElementById("victoryWeaponPreview");

  if (victory) {
    lootBox.innerHTML = `
      <div style="margin-bottom:4px; opacity:0.9;">
        ${enemyNameStyled} dropped:
      </div>
      <div style="color:${enemy.weapon.color}; font-weight:bold;">
        🗡️ ${enemy.weapon.name}
      </div>
    `;
  } else {
    lootBox.innerHTML = `
      <div style="margin-bottom:4px; opacity:0.9;">
        ${enemyNameStyled} held on to:
      </div>
      <div style="color:${enemy.weapon.color}; font-weight:bold;">
        🗡️ ${enemy.weapon.name}
      </div>
    `;
  }

  // Battle log
  const rawLog = document.getElementById("log").textContent;
  logBox.innerHTML = rawLog.replace(/\n/g, "<br>");

  // Danger rating
  const danger = getDangerRating(playerStats.level, enemy.level);
  logBox.innerHTML += `<br><span style="color:#ff6666">Danger Rating: ${danger}</span>`;

  // Victory / Defeat EXP logic
  if (victory) {
    title.textContent = "Victory!";
    const expGain = (enemy.level + 1) * 5;

    // Animate EXP above loot preview
    animateExpGain(expDisplay, 0, expGain);

    gainExp(expGain);

  } else {
    title.textContent = "Defeat";
    const expLoss = Math.floor((enemy.level + 1) * 5 * 0.2);

    // Animate LOST EXP (correct wording)
    animateExpLoss(expDisplay, 0, expLoss);

    loseExp(expLoss);
  }

  modal.style.display = "flex";

  // Apply color-coded theme
  applyModalTheme(modal, enemy.type);

  // Show stat button if points available
  if (playerStats.statPoints > 0) {
    document.getElementById("statButton").style.display = "block";
  }

  // Show loot button only on victory
  if (victory) {
    document.getElementById("lootWeaponBtn").style.display = "block";
  } else {
    document.getElementById("lootWeaponBtn").style.display = "none";
  }
}

/* -------------------------
   WEAPON COMPARISON MODAL
------------------------- */

export function openCompareWeaponModal() {
  const modal = document.getElementById("compareWeaponModal");
  modal.style.display = "flex";

  const current = player.weapon;
  const enemyW = enemy.weapon;

  // Current weapon
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

  // Enemy weapon
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
    updatePlayerWeaponUI();
    saveProgress();
    modal.style.display = "none";
    document.getElementById("lootWeaponBtn").style.display = "none";
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

  // Name header with tier color
  const nameEl = document.getElementById("enemyInfoName");
  nameEl.textContent = enemy.name;

  if (enemy.type === "elite") nameEl.style.color = "#ffcc00";
  else if (enemy.type === "boss") nameEl.style.color = "#ff4444";
  else nameEl.style.color = ""; // normal

  // Tier + Level
  document.getElementById("enemyInfoLevel").textContent = enemy.level;
  document.getElementById("enemyInfoType").textContent = enemy.type;

  // Hint
  document.getElementById("enemyInfoHint").textContent = enemy.hint;

  // Stats
  document.getElementById("enemyInfoSTR").textContent = enemy.stats.STR;
  document.getElementById("enemyInfoDEX").textContent = enemy.stats.DEX;
  document.getElementById("enemyInfoAGI").textContent = enemy.stats.AGI;
  document.getElementById("enemyInfoCON").textContent = enemy.stats.CON;

  // Danger rating
  document.getElementById("enemyInfoDanger").textContent =
    getDangerRating(playerStats.level, enemy.level);

  // Weapon
  const w = enemy.weapon;

  // Weapon name (H3)
  const weaponNameEl =   document.getElementById("enemyProfileWeapon");
  weaponNameEl.textContent = w.name;
  weaponNameEl.style.color = w.color;

  // Damage
  document.getElementById("enemyProfileWeaponDamage").textContent =
    `Damage: ${w.damage.min} – ${w.damage.max}`;

  // Stat modifiers (no label)
  const statStrings = Object.entries(w.stats)
    .filter(([_, val]) => val > 0)
    .map(([stat, val]) => `${stat} +${val}`);

  document.getElementById("enemyProfileWeaponStats").textContent =
    statStrings.length > 0 ? statStrings.join(", ") : "";

  // Lore
  if (w.lore && w.lore.trim() !== "") {
    document.getElementById("enemyProfileWeaponLore").textContent = `"${w.lore}"`;
  } else {
    document.getElementById("enemyProfileWeaponLore").textContent = "";
  }
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

  document.getElementById("playerInfoPortrait").src =
    document.getElementById("playerPortrait").src;

  document.getElementById("playerInfoName").textContent = player.name;
  document.getElementById("playerInfoLevel").textContent = playerStats.level;

  document.getElementById("playerInfoSTR").textContent = player.STR;
  document.getElementById("playerInfoDEX").textContent = player.DEX;
  document.getElementById("playerInfoAGI").textContent = player.AGI;
  document.getElementById("playerInfoCON").textContent = player.CON;

  if (player.weapon) {
    const w = player.weapon;

    document.getElementById("playerProfileWeapon").textContent = w.name;
    document.getElementById("playerProfileWeapon").style.color = w.color;

    document.getElementById("playerProfileWeaponDamage").textContent =
      `${w.damage.min} – ${w.damage.max}`;

    const statStrings = Object.entries(w.stats)
      .filter(([_, val]) => val > 0)
      .map(([stat, val]) => `${stat} +${val}`);

    document.getElementById("playerProfileWeaponStats").textContent =
      statStrings.length > 0 ? statStrings.join(", ") : "None";

  } else {
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