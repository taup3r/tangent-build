/* ============================================
   ENEMY AI MODULE
   Handles:
   - Enemy AP gain
   - Enemy action selection
   - Turn transitions
============================================ */

import { player, enemy, clampAP } from "./state.js";
import { log, updateUI } from "./ui.js";
import { startPlayerTurn } from "./combat.js";
import { checkWin } from "./modal.js";
import {
  enemyAttackAction,
  enemySkillAction,
  enemyDefendAction,
  enemySkipAction
} from "./combat.js";

/* -------------------------
   ENEMY DECISION LOGIC
------------------------- */

function decideEnemyAction() {
  const type = enemy.behavior;

  // ============================
  // NEW BEHAVIORS
  // ============================

  // ASSASSIN — avoids attacking into defense, prefers skill
  if (type === "assassin") {
    if (enemy.ap >= 2) return Math.random() < 0.7 ? "skill" : "attack";
    if (enemy.ap >= 1) {
      // If player is defending, avoid attacking
      if (player.defending) return "defend";
      return "attack";
    }
    return "defend";
  }

  // BERSERKER — reckless, always attacks, stronger when low HP
  if (type === "berserker") {
    const hpPercent = enemy.hp / enemy.max;

    if (enemy.ap >= 2) {
      // Rage mode below 50% HP → skill attack
      if (hpPercent < 0.5) return "skill";
      return "attack";
    }

    if (enemy.ap >= 1) return "attack";

    return "skip";
  }

  // SENTINEL — defensive, punishes attacks, uses shield bash
  if (type === "sentinel") {
    if (enemy.ap >= 2) return "skill"; // Shield Bash
    if (enemy.ap >= 1) {
      // If player attacked last turn → counterattack
      if (!player.defending) return "attack";
      return "defend";
    }
    return "defend";
  }

  // ============================
  // EXISTING BEHAVIORS
  // ============================

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

  // Decide action
  const action = decideEnemyAction();

  if (action === "skill") {
    enemySkillAction();
  }
  else if (action === "attack") {
    enemyAttackAction();
  }
  else if (action === "defend") {
    enemyDefendAction();
  }
  else {
    enemySkipAction();
  }

  updateUI();

  // Check defeat
  if (checkWin()) return;

  // Player's turn
  startPlayerTurn();
}