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
import { getBaseDamage } from "./weapon.js";

/* -------------------------
   HIT / MISS CHECK
------------------------- */

export function rollHit(attacker, defender) {
  // If defender defending, sure hit
  if (defender.defending) return true;

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
  if (hitChance < 1) hitChance = 1;
  if (hitChance > 99) hitChance = 99;

  return Math.random() * 100 < hitChance;
}

/* -------------------------
   DAMAGE WITH MODIFIER
------------------------- */

function computeDamage(baseDamage, attacker, defender) {
  let attackerSTR = attacker.STR;
  if (attacker.weapon) {
    attackerSTR += Number(attacker.weapon.stats.STR) || 0;
  }
  let dmgReduction = defender.tenacity;
  
  if (dmgReduction > (baseDamage + attackerSTR)) return 1; 
  return baseDamage + attackerSTR - dmgReduction;
}

function criticalDamage(baseDamage, attacker) {
  let critChance = 5 + attacker.precision;
  if ((Math.random() * 100) < critChance) {
    return Math.floor(baseDamage * 0.5);
  }
  return 0;
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

  let base = getBaseDamage(player);
  let dmg = computeDamage(base, player, enemy);
  const critDamage = criticalDamage(dmg, player);
  dmg += critDamage;

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  if (dmg < 1) dmg = 1;
  enemy.hp -= dmg;
  if (enemy.hp < 0) enemy.hp = 0;

  if (critDamage > 0) log(`Critical attack for ${dmg}!`);
  else log(`You attack for ${dmg}!`);
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

export function useSkill(type) {
  document.getElementById("skillMenu").style.display = "none"; // close menu

  if (type === "tackle") return playerSkill();        // your existing skill
  if (type === "blunt") return playerBluntStrike();   // new stun skill
  if (type === "bthrust") return skillBalancedThrust(player, enemy);
}

window.useSkill = useSkill;

function playerSkill() {
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

function playerBluntStrike() {
  resetSkillTiming();

  if (player.ap < 2) {
    log("Not enough AP!");
    return;
  }

  player.ap -= 2;
  clampAP();
  disableButtons();

  // 10% stun chance
  if (Math.random() < 0.20) {
    enemy.stunned.active = true;
    enemy.stunned.duration = 2;

    log("Blunt Strike stuns the enemy!");
    floatDamage("STUN", "enemyCard");
    animateCard("enemyCard", "skill-anim");

    updateUI();
    return enemyTurn();
  }

  // Hit check
  if (!rollHit(player, enemy)) {
    log("Your Blunt Strike missed!");
    floatDamage("MISS", "enemyCard");
    updateUI();
    return enemyTurn();
  }

  // Otherwise deal 30% damage
  let base = getBaseDamage(player);
  let dmg = computeDamage(base, player, enemy);
  const critDamage = criticalDamage(dmg, player);
  dmg += critDamage;

  //reduced skill damage
  dmg = Math.floor(dmg * 0.3);

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  if (dmg < 1) dmg = 1;
  enemy.hp -= dmg;
  if (enemy.hp < 0) enemy.hp = 0;

  if (critDamage > 0) log(`Blunt Strike fails, deals ${dmg} critical damage!`);
  else log(`Blunt Strike fails, deals ${dmg} damage!`);
  floatDamage(dmg, "enemyCard");
  animateCard("enemyCard", "skill-anim");

  updateUI();
  if (!checkWin()) enemyTurn();
}

function skillBalancedThrust(attacker, defender) {
  const isPlayer = (attacker.name === player.name);
  let attackerCard = "playerCard";
  let defenderCard = "enemyCard";
  if (!isPlayer) {
    attackerCard = "enemyCard";
    defenderCard = "playerCard";
  }

  if (isPlayer) resetSkillTiming();

  if (attacker.ap < 2) {
    log("Not enough AP!");
    return;
  }

  attacker.ap -= 2;
  clampAP();
  if (isPlayer) disableButtons();

  // Hit check
  if (!rollHit(attacker, defender)) {
    log("Balanced Thrust missed!");
    floatDamage("MISS", defenderCard);
    updateUI();
    if (isPlayer) return enemyTurn();
  }

  let base = getBaseDamage(attacker);
  let dmg = computeDamage(base, attacker, defender);
  const critDamage = criticalDamage(dmg, attacker);
  dmg += critDamage;

  //Deal 150% skill damage
  dmg = Math.floor(dmg * 1.5);

  if (defender.defending) {
    dmg = Math.floor(dmg / 2);
    if (isPlayer) log(defender.name + " defended! Damage halved.");
    else log("You defended! Damage halved.");
  }

  if (dmg < 1) dmg = 1;
  defender.hp -= dmg;
  if (defender.hp < 0) defender.hp = 0;

  if (critDamage > 0) log(`Balanced Thrust deals ${dmg} critical damage!`);
  else log(`Balanced Thrust deals ${dmg} damage!`);

  floatDamage(dmg, defenderCard);
  animateCard(defenderCard, "skill-anim");

  //20% chance ap refund
  if (Math.random() < 0.2) {
    attacker.ap += 1;
    log("Success, refunding 1 ap!");
  }

  updateUI();
  if (isPlayer) {
    if (!checkWin()) enemyTurn();
  }
}

/* -------------------------
   APPLY SKILL DAMAGE
   Called by skillTiming.js
------------------------- */

export function applySkillDamage(perfect) {
  resetSkillTiming();

  let base = getBaseDamage(player);
  let dmg = computeDamage(base, player, enemy);
  const critDamage = criticalDamage(dmg, player);
  dmg += critDamage;

  if (perfect === true) {
    dmg = dmg * 2; // Perfect timing
  } else if (perfect === false) {
    dmg = Math.floor(dmg * 1.5); // Normal timing
  }

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  if (dmg < 1) dmg = 1;
  enemy.hp -= dmg;
  if (enemy.hp < 0) enemy.hp = 0;

  if (critDamage > 0) log(`You used skilled critical attack for ${dmg}!`);
  else log(`You used skilled attack for ${dmg}!`);
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

  const base = getBaseDamage(enemy);

  // --- Final damage using your existing formula ---
  let dmg = computeDamage(base, enemy, player);
  const critDamage = criticalDamage(dmg, enemy);
  dmg += critDamage;

  if (player.defending) {
    dmg = Math.floor(dmg / 2);
    log("You defended! Damage halved.");
  }

  if (dmg < 1) dmg = 1;
  player.hp -= dmg;
  if (player.hp < 0) player.hp = 0;

  if (critDamage > 0) log(`${enemy.name} critically attacks with ${enemy.weapon.name} for ${dmg}!`);
  else log(`${enemy.name} attacks with ${enemy.weapon.name} for ${dmg}!`);
  floatDamage(dmg, "playerCard");
}

export function enemySkillAction() {
  enemy.ap -= 2;

  if (enemy.behavior === "assassin") {
    log(`${enemy.name} uses Shadow Strike!`);
  } else if (enemy.behavior === "berserker") {
    log(`${enemy.name} enters a furious Rage Attack!`);
  } else if (enemy.behavior === "sentinel") {
    log(`${enemy.name} uses Shield Bash!`);
  }

  if (enemy.behavior === "berserker") {
    //sure hit
  } else {
    if (!rollHit(enemy, player)) {
      log("Enemy missed!");
      floatDamage("MISS", "playerCard");
      return;
    }
  }

  animateSkillDouble("playerCard");

  const base = getBaseDamage(enemy);

  // --- Final damage using your existing formula ---
  let dmg = computeDamage(base, enemy, player);
  const critDamage = criticalDamage(dmg, enemy);
  dmg += critDamage;

  if (enemy.behavior === "assassin") {
    // crit chance increase damage
    if (Math.random() < 0.35) {
      dmg = Math.floor(dmg * 2.5);
    } else {
      dmg *= 2;
    }
  } else if (enemy.behavior === "berserker") {
    // half damage
    dmg = Math.floor(dmg / 2);
  } else if (enemy.behavior === "sentinel") {
    // reduced damage
    dmg = Math.floor(dmg * 0.8);
    player.ap = Math.max(0, player.ap - 1);
    log("You lost 1 AP!");
  } else {
    dmg *= 2;
  }

  if (player.defending) {
    dmg = Math.floor(dmg / 2);
    log("You defended! Damage halved.");
  }

  if (dmg < 1) dmg = 1;
  player.hp -= dmg;
  if (player.hp < 0) player.hp = 0;

  if (critDamage > 0) log(`${enemy.name} unleashes ${enemy.weapon.name} for ${dmg} critical damage!`);
  else log(`${enemy.name} unleashes ${enemy.weapon.name} for ${dmg} damage!`);
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