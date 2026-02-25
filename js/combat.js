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

export function rollHit(attacker, defender) {
  // Base hit chance
  let hitChance = 80;

  // --- Attacker DEX bonus (accuracy) ---
  let attackerDEX = attacker.DEX;
  if (attacker.weapon) {
    attackerDEX += Number(attacker.weapon.stats.DEX) || 0;
  }
  hitChance += attackerDEX * 2;

  // --- Defender AGI bonus (evasion) ---
  let defenderAGI = defender.AGI;
  if (defender.weapon) {
    defenderAGI += Number(defender.weapon.stats.AGI) || 0;
  }
  hitChance -= defenderAGI * 2;

  // Clamp
  if (hitChance < 2) hitChance = 2;
  if (hitChance > 98) hitChance = 98;

  return Math.random() * 100 < hitChance;
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
  if (!rollHit(player, enemy)) {
    log("You missed!");
    floatDamage("MISS", "enemyCard");
    updateUI();
    return enemyTurn();
  }

  animateCard("enemyCard", "attack-anim");

  let base;

  // --- Weapon damage roll if player has a weapon ---
  if (player.weapon) {
    const w = player.weapon;
    base = Math.floor(Math.random() * (w.damage.max - w.damage.min + 1)) + w.damage.min;

    // Add weapon STR to player STR
    const weaponSTR = Number(w.stats.STR) || 0;
    const totalSTR = player.STR + weaponSTR;

    // Compute final damage
    var dmg = computeDamage(base, totalSTR);

  } else {
    // --- Original unarmed damage ---
    base = Math.floor(Math.random() * 6) + 4;
    var dmg = computeDamage(base, player.STR);
  }

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
  if (!rollHit(player, enemy)) {
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

  let base;

  if (player.weapon) {
    const w = player.weapon;
    base = Math.floor(Math.random() * (w.damage.max - w.damage.min + 1)) + w.damage.min;

    const weaponSTR = Number(w.stats.STR) || 0;
    const totalSTR = player.STR + weaponSTR;

    base = computeDamage(base, totalSTR);

  } else {
    // Original unarmed damage
    base = Math.floor(Math.random() * 6) + 4;
    base = computeDamage(base, player.STR);
  }

  let dmg;
  if (perfect === true) {
    dmg = base * 2.5;      // Perfect timing
  } else if (perfect === false) {
    dmg = base * 2;        // Normal timing
  } else {
    dmg = base * 1;        // No click → 100%
  }

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

  if (!rollHit(enemy, player)) {
    log("Enemy missed!");
    floatDamage("MISS", "playerCard");
    return;
  }

  animateCard("playerCard", "attack-anim");

  const w = enemy.weapon;

  // --- Weapon base damage roll ---
  const base = Math.floor(Math.random() * (w.damage.max - w.damage.min + 1)) + w.damage.min;

  // --- Weapon STR modifier ---
  const weaponSTR = Number(w.stats.STR) || 0;

  // --- Total STR used in computeDamage ---
  const totalSTR = enemy.STR + weaponSTR;

  // --- Final damage using your existing formula ---
  let dmg = computeDamage(base, totalSTR);

  if (player.defending) {
    dmg = Math.floor(dmg / 2);
    log("You defended! Damage halved.");
  }

  player.hp -= dmg;
  if (player.hp < 0) player.hp = 0;

  log(`${enemy.name} attacks with ${w.name} for ${dmg}!`);
  floatDamage(dmg, "playerCard");
}

export function enemySkillAction() {
  enemy.ap -= 2;

  if (!rollHit(enemy, player)) {
    log("Enemy missed!");
    floatDamage("MISS", "playerCard");
    return;
  }

  animateSkillDouble("playerCard");

  const w = enemy.weapon;

  // --- Weapon base damage roll ---
  const base = Math.floor(Math.random() * (w.damage.max - w.damage.min + 1)) + w.damage.min;

  // --- Weapon STR modifier ---
  const weaponSTR = Number(w.stats.STR) || 0;

  // --- Total STR used in computeDamage ---
  const totalSTR = enemy.STR + weaponSTR;

  // --- Final damage using your existing formula ---
  let dmg = computeDamage(base, totalSTR);

  // --- Skill multiplier (unchanged) ---
  dmg *= 2;

  if (player.defending) {
    dmg = Math.floor(dmg / 2);
    log("You defended! Damage halved.");
  }

  player.hp -= dmg;
  if (player.hp < 0) player.hp = 0;

  log(`${enemy.name} unleashes ${w.name} for ${dmg} damage!`);
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