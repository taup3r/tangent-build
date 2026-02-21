/* ============================================
   ENEMY AI MODULE
   Handles:
   - Enemy AP gain
   - Enemy action selection
   - Enemy attack / defend / skill
   - Turn transitions
============================================ */

import { player, enemy, clampAP } from "./state.js";
import {
  updateUI,
  log,
  floatDamage,
  animateCard,
  animateSkillDouble,
  applyDefendGlow,
  removeDefendGlow
} from "./ui.js";
import { startPlayerTurn, rollHit, computeDamage } from "./combat.js";
import { checkWin } from "./modal.js";

/* -------------------------
   ENEMY DECISION LOGIC
------------------------- */

function decideEnemyAction() {
  const type = enemy.behavior;

  // If enemy has 2 AP → skill or attack/defend depending on type
  if (enemy.ap >= 2) {
    if (type === "aggressive") return Math.random() < 0.6 ? "skill" : "attack";
    if (type === "warlock")    return Math.random() < 0.75 ? "skill" : "attack";
    if (type === "defensive")  return Math.random() < 0.2 ? "skill" : "defend";
  }

  // If enemy has 1 AP → attack or defend
  if (enemy.ap >= 1) {
    if (type === "defensive") return Math.random() < 0.5 ? "defend" : "attack";
    return "attack";
  }

  // No AP → defend or skip
  return Math.random() < 0.5 ? "defend" : "skip";
}

/* -------------------------
   ENEMY TURN
------------------------- */

export function enemyTurn() {
  log(`\n--- Enemy Turn (${enemy.name}) ---`);

  // AP gain
  enemy.ap += 1;
  clampAP();

  // Reset defending state
  enemy.defending = false;
  removeDefendGlow("enemyCard");

  const action = decideEnemyAction();

  /* -------------------------
     ENEMY SKILL
  ------------------------- */
  if (action === "skill") {
    enemy.ap -= 2;

    // Hit check
    if (!rollHit()) {
      log("Enemy missed!");
      floatDamage("MISS", "playerCard");
    }
    else {
      animateSkillDouble("playerCard");

      let base = Math.floor(Math.random() * 6) + 4;
      base = computeDamage(base, enemy.STR);
      let dmg = base * 2;

      if (player.defending) {
        dmg = Math.floor(dmg / 2);
        log("You defended! Damage halved.");
      }

      player.hp -= dmg;
      if (player.hp < 0) player.hp = 0;

      log(`${enemy.name} uses SKILL for ${dmg} damage!`);
      floatDamage(dmg, "playerCard");
    }
  }

  /* -------------------------
     ENEMY ATTACK
  ------------------------- */
  else if (action === "attack") {
    enemy.ap -= 1;

    // Hit check
    if (!rollHit()) {
      log("Enemy missed!");
      floatDamage("MISS", "playerCard");
    }
    else {
      animateCard("playerCard", "attack-anim");

      let base = Math.floor(Math.random() * 6) + 3;
      let dmg = computeDamage(base, enemy.STR);

      if (player.defending) {
        dmg = Math.floor(dmg / 2);
        log("You defended! Damage halved.");
      }

      player.hp -= dmg;
      if (player.hp < 0) player.hp = 0;

      log(`${enemy.name} attacks for ${dmg}!`);
      floatDamage(dmg, "playerCard");
    }
  }

  /* -------------------------
     ENEMY DEFEND
  ------------------------- */
  else if (action === "defend") {
    enemy.defending = true;
    applyDefendGlow("enemyCard");
    log(`${enemy.name} braces for impact.`);
  }

  /* -------------------------
     ENEMY SKIP
  ------------------------- */
  else {
    log(`${enemy.name} has no AP and skips the turn.`);
  }

  updateUI();

  // Check defeat
  if (checkWin()) return;

  // Player's turn
  startPlayerTurn();
}