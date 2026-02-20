/* ============================================
   UI MODULE
   Handles:
   - AP icons
   - HP bars + text
   - Floating damage numbers
   - Button enabling/disabling
   - Logging (hidden, used for modal)
============================================ */

import { player, enemy, clampAP } from "./state.js";

/* -------------------------
   AP ICON RENDERING
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
   HP BAR + TEXT
------------------------- */

export function updateHPText() {
  document.getElementById("playerHPText").textContent = `${player.hp}/${player.max}`;
  document.getElementById("enemyHPText").textContent = `${enemy.hp}/${enemy.max}`;
}

export function updateHPBars() {
  document.getElementById("playerHPBar").style.width =
    (player.hp / player.max * 100) + "%";

  document.getElementById("enemyHPBar").style.width =
    (enemy.hp / enemy.max * 100) + "%";
}

/* -------------------------
   MAIN UI UPDATE
------------------------- */

export function updateUI() {
  clampAP();
  renderAPIcons();
  updateHPText();
  updateHPBars();
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
   HIT BUTTON RESET
------------------------- */

export function resetHitButton() {
  const hit = document.getElementById("hitBtn");
  hit.style.display = "none";
  hit.disabled = true;
}

/* -------------------------
   FLOATING DAMAGE NUMBERS
------------------------- */

export function floatDamage(amount, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 4;

  const el = document.createElement("div");
  el.className = "floating-dmg";
  el.textContent = amount;
  el.style.left = x + "px";
  el.style.top = y + "px";

  document.getElementById("floatingContainer").appendChild(el);

  setTimeout(() => el.remove(), 1000);
}

/* -------------------------
   LOGGING (hidden)
------------------------- */

export function log(msg) {
  const logBox = document.getElementById("log");
  logBox.textContent += msg + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

/* ============================================
   AP TOOLTIP HANDLING (dynamic AP + positioning)
============================================ */

const tooltip = document.getElementById("apTooltip");

function getTooltipText(ap) {
  return `
    <b>Action Points: ${ap}</b><br>
    Attack: normal base attack, 1 action point<br>
    Defend: halves incoming damage, 0 action point<br>
    Skill: activate skill, 2 action points
  `;
}

export function attachAPTooltips() {
  const apIcons = document.querySelectorAll(".ap-icon");

  apIcons.forEach(icon => {
    icon.addEventListener("mouseenter", e => {
      const isPlayer = e.target.closest("#playerAPIcons") !== null;
      const isEnemy = e.target.closest("#enemyAPIcons") !== null;

      // Determine AP value based on row
      const apValue = isPlayer ? player.ap : enemy.ap;

      tooltip.innerHTML = getTooltipText(apValue);
      tooltip.style.display = "block";

      const rect = e.target.getBoundingClientRect();

      if (isPlayer) {
        // Position tooltip at the RIGHT‑MOST TOP of the hovered icon
        tooltip.style.left = rect.right + 6 + "px";
        tooltip.style.top = rect.top - 4 + "px";
      } else {
        // Enemy tooltip stays BELOW the icon
        tooltip.style.left = rect.left + "px";
        tooltip.style.top = rect.bottom + 6 + "px";
      }
    });

    icon.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  });
}