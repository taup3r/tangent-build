/* ============================================
   UI MODULE
   Handles:
   - HP bars
   - AP icons
   - Floating damage
   - Log
   - Buttons enable/disable
   - Header stats (Level + EXP)
   - AP tooltips
   - Animation helpers (moved from combat + enemyAI)
============================================ */

import { player, enemy } from "./state.js";
import { playerStats } from "./state.js";
import { openPlayerInfoModal } from "./playerInfo.js";

/* -------------------------
   UPDATE HEADER (LEVEL + EXP)
------------------------- */

export function updateHeaderStats() {
  document.getElementById("playerLevelDisplay").textContent = playerStats.level;
  document.getElementById("playerExpDisplay").textContent =
    `${playerStats.exp} / ${playerStats.expToNext}`;
    document.getElementById("playerGoldDisplay").textContent = playerStats.gold;
document.getElementById("profileButton").onclick = () => openPlayerInfoModal();
}

/* -------------------------
   UPDATE HP BARS
------------------------- */

function updateHP() {
  const pFill = document.getElementById("playerHPBar");
  const eFill = document.getElementById("enemyHPBar");

  const pText = document.getElementById("playerHPText");
  const eText = document.getElementById("enemyHPText");

  pFill.style.width = (player.hp / player.max) * 100 + "%";
  eFill.style.width = (enemy.hp / enemy.max) * 100 + "%";

  pText.textContent = `${player.hp} / ${player.max}`;
  eText.textContent = `${enemy.hp} / ${enemy.max}`;
}

/* -------------------------
   AP ICONS
------------------------- */

export function renderAPIcons() {
  const playerRow = document.getElementById("playerAPIcons");
  const enemyRow = document.getElementById("enemyAPIcons");

  playerRow.innerHTML = "";
  enemyRow.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const p = document.createElement("div");
    p.className = "ap-icon" + (i < player.ap ? " active" : "");
    playerRow.appendChild(p);

    const e = document.createElement("div");
    e.className = "ap-icon" + (i < enemy.ap ? " active" : "");
    enemyRow.appendChild(e);
  }

  attachAPTooltips();
}

/* -------------------------
   LOGGING
------------------------- */

export function log(text) {
  const logBox = document.getElementById("log");
  logBox.textContent += text + "\n";
}

/* -------------------------
   BUTTON CONTROL
------------------------- */

export function disableButtons() {
  document.getElementById("attackBtn").disabled = true;
  document.getElementById("defendBtn").disabled = true;
  document.getElementById("skillBtn").disabled = true;
}

export function enableButtons() {
  document.getElementById("attackBtn").disabled = false;
  document.getElementById("defendBtn").disabled = false;
  document.getElementById("skillBtn").disabled = false;
}

/* -------------------------
   FLOATING DAMAGE / MISS
------------------------- */

export function floatDamage(amount, cardId) {
  const container = document.getElementById("floatingContainer");
  const rect = document.getElementById(cardId).getBoundingClientRect();

  const dmg = document.createElement("div");
  dmg.className = "floating-dmg";
  dmg.textContent = amount;

  dmg.style.left = rect.left + rect.width / 2 + "px";
  dmg.style.top = rect.top + "px";

  container.appendChild(dmg);

  setTimeout(() => dmg.remove(), 1000);
}

/* -------------------------
   AP TOOLTIP
------------------------- */

function getTooltipText(ap) {
  return `
    <b>Action Points: ${ap}</b><br>
    Attack: normal base attack, 1 action point<br>
    Defend: halves incoming damage, 0 action point<br>
    Skill: activate skill, 2 action points
  `;
}

export function attachAPTooltips() {
  const tooltip = document.getElementById("apTooltip");
  if (!tooltip) return;

  const apIcons = document.querySelectorAll(".ap-icon");

  apIcons.forEach(icon => {
    icon.addEventListener("mouseenter", e => {
      const isPlayer = e.target.closest("#playerAPIcons") !== null;
      const apValue = isPlayer ? player.ap : enemy.ap;

      tooltip.innerHTML = getTooltipText(apValue);
      tooltip.style.display = "block";

      const rect = e.target.getBoundingClientRect();

      if (isPlayer) {
        tooltip.style.left = (rect.right - tooltip.offsetWidth) + "px";
        tooltip.style.top = (rect.top - 4) + "px";
      } else {
        tooltip.style.left = rect.left + "px";
        tooltip.style.top = rect.bottom + 6 + "px";
      }
    });

    icon.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  });
}

/* -------------------------
   MAIN UI UPDATE
------------------------- */

export function updateUI() {
  document.getElementById("playerName").textContent = player.name;
  updateHP();
  renderAPIcons();
  updateHeaderStats();
}

export function updatePlayerWeaponUI() {
  const el = document.getElementById("playerWeapon");
  if (!player.weapon) {
    el.textContent = "Unarmed";
    el.style.color = "#ccc";
    return;
  }
  el.textContent = player.weapon.name;
  el.style.color = player.weapon.color;
}

/* -------------------------
   ANIMATION HELPERS (MOVED HERE)
------------------------- */

export function animateCard(cardId, animClass, duration = 300) {
  const card = document.getElementById(cardId);
  card.classList.add(animClass);
  setTimeout(() => card.classList.remove(animClass), duration);
}

export function animateSkillDouble(cardId) {
  animateCard(cardId, "skill-anim", 300);
  setTimeout(() => animateCard(cardId, "skill-anim", 300), 1000);
}

export function applyDefendGlow(cardId) {
  document.getElementById(cardId).classList.add("defend-glow");
}

export function removeDefendGlow(cardId) {
  document.getElementById(cardId).classList.remove("defend-glow");
}