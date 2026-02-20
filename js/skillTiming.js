/* ============================================
   SKILL TIMING MODULE
   Handles:
   - HIT button timing
   - Skill damage resolution
============================================ */

import { player, enemy } from "./state.js";
import { updateUI, log, floatDamage } from "./ui.js";
import { endPlayerTurn } from "./combat.js";

export function handleHitPress() {
  const btn = document.getElementById("hitBtn");
  btn.style.display = "none";

  const isSkill = window.skillAttackPending === true;
  window.skillAttackPending = false;

  let dmg = player.damage;

  if (isSkill) {
    dmg = Math.floor(dmg * 1.5); // Skill multiplier
  }

  enemy.hp = Math.max(0, enemy.hp - dmg);

  floatDamage(dmg, "enemyCard");
  log(isSkill ? `Skill hit for ${dmg}!` : `You hit for ${dmg}!`);

  updateUI();
  endPlayerTurn();
}