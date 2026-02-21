/* ============================================
   COMBAT MODULE
   Handles:
   - Player attack / defend / skill
   - Damage application
   - Turn transitions
============================================ */

import { player, enemy, clampAP } from "./state.js";
import {
  updateUI,
  log,
  disableButtons,
  enableButtons,
  floatDamage,
  animateCard,
  animateSkillDouble,
  applyDefendGlow,
  removeDefendGlow
} from "./ui.js";
import { startSkillTiming, resetSkillTiming } from "./skillTiming.js";
import { enemyTurn } from "./enemyAI.js";
import { checkWin } from "./modal.js";

/* -------------------------
   HIT / MISS CHECK
------------------------- */

export function rollHit() {
  const hitChance = 80;   // base hit %
  const evadeChance = 0;  // base evade %

  const finalChance = hitChance - evadeChance;
  return Math.random() * 100 < finalChance;
}

/* -------------------------
   DAMAGE WITH STR MODIFIER
------------------------- */

export function computeDamage(baseRoll, STR) {
  return baseRoll + ((STR || 0) * 2);
}

/* -------------------------
   PLAYER ATTACK
------------------------- */

export function playerAttack() {
  resetSkillTiming();

  if (player.ap < 1) return log("Not enough AP!");

  player.ap -= 1;
  clampAP();

  disableButtons();

  // Hit check
  if (!rollHit()) {
    log("You missed!");
    floatDamage("MISS", "enemyCard");
    updateUI();
    return enemyTurn();
  }

  animateCard("enemyCard", "attack-anim");

  let base = Math.floor(Math.random() * 6) + 4;
  let dmg = computeDamage(base, player.STR);

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  enemy.hp -= dmg;
  if (enemy.hp < 0) enemy.hp = 0;

  log(`You attack for ${dmg}!`);
  floatDamage(dmg, "enemyCard");

  updateUI();

  if (!checkWin()) enemyTurn();
}

/* -------------------------
   PLAYER DEFEND
------------------------- */

export function playerDefend() {
  resetSkillTiming();

  player.defending = true;
  applyDefendGlow("playerCard");

  log("You brace for impact...");

  disableButtons();
  enemyTurn();
}

/* -------------------------
   PLAYER SKILL
------------------------- */

export function playerSkill() {
  resetSkillTiming();

  if (player.ap < 2) return log("Not enough AP!");

  player.ap -= 2;
  clampAP();

  // Hit check BEFORE timing mini-game
  if (!rollHit()) {
    log("Your skill missed!");
    floatDamage("MISS", "enemyCard");
    updateUI();
    return enemyTurn();
  }

  log("Skill activated! Prepare to strike...");

  disableButtons();

  const hitBtn = document.getElementById("hitBtn");
  hitBtn.style.display = "block";
  hitBtn.disabled = true;

  animateCard("enemyCard", "skill-anim", 300);

  // Second animation before timing window opens
  setTimeout(() => {
    animateCard("enemyCard", "skill-anim", 300);
    startSkillTiming();
  }, 1000);
}

/* -------------------------
   APPLY SKILL DAMAGE
   Called by skillTiming.js
------------------------- */

export function applySkillDamage(perfect) {
  resetSkillTiming();

  let base = Math.floor(Math.random() * 6) + 4;
  base = computeDamage(base, player.STR);

  let dmg = perfect ? base * 2.5 : base * 2;

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  dmg = Math.floor(dmg);
  enemy.hp -= dmg;
  if (enemy.hp < 0) enemy.hp = 0;

  floatDamage(dmg, "enemyCard");
  updateUI();

  if (!checkWin()) {
    enemyTurn();
  }
}

/* -------------------------
   ENEMY ACTIONS (MOVED FROM enemyAI.js)
------------------------- */

export function enemyAttackAction() {
  enemy.ap -= 1;

  if (!rollHit()) {
    log("Enemy missed!");
    floatDamage("MISS", "playerCard");
    return;
  }

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

export function enemySkillAction() {
  enemy.ap -= 2;

  if (!rollHit()) {
    log("Enemy missed!");
    floatDamage("MISS", "playerCard");
    return;
  }

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

export function enemyDefendAction() {
  enemy.defending = true;
  applyDefendGlow("enemyCard");
  log(`${enemy.name} braces for impact.`);
}

export function enemySkipAction() {
  log(`${enemy.name} has no AP and skips the turn.`);
}

/* -------------------------
   TURN START
------------------------- */

export function startPlayerTurn() {
  player.ap += 1;
  clampAP();

  player.defending = false;
  removeDefendGlow("playerCard");

  log("\n--- Player Turn ---");

  updateUI();
  enableButtons();
}