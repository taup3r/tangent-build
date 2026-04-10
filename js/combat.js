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
  alert(`computeDamage ${attacker.name}`);

  let defenderCON = defender.CON;
  let defenderAGI = defender.AGI;
  if (defender.weapon) {
    defenderCON += Number(defender.weapon.stats.CON) || 0;
    defenderAGI += Number(defender.weapon.stats.AGI) || 0;
  }

  alert(`computeWdamage ${attacker.name}`);

  let dmgReduction = 0;
  //Damage Reduction formula is 2CON+1AGI
  if (defenderAGI > 0 && defenderCON > defenderAGI * 2) {
    defenderCON = defenderAGI * 2;
    dmgReduction = Math.floor(defenderCON * 0.25) + Math.floor(defenderAGI * 0.5);
  }

  let attackerSTR = attacker.STR;
  if (attacker.weapon) {
    attackerSTR += Number(attacker.weapon.stats.STR) || 0;
  }
  
  return baseDamage + attackerSTR - dmgReduction;
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

export function useSkill(type) {
  document.getElementById("skillMenu").style.display = "none"; // close menu

  if (type === "tackle") return playerSkill();        // your existing skill
  if (type === "blunt") return playerBluntStrike();   // new stun skill
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

  //if (player.weapon) {
    //const w = player.weapon;
    //base = Math.floor(Math.random() * (w.damage.max - w.damage.min + 1)) + w.damage.min;

    //base = computeDamage(base, player, enemy);
  //} else {
    //base = Math.floor(Math.random() * 6) + 4;
    //base = computeDamage(base, player, enemy);
  //}

  //reduced skill damage
  dmg = Math.floor(dmg * 0.3);

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  enemy.hp -= dmg;
  if (enemy.hp < 0) enemy.hp = 0;

  log(`Blunt Strike fails, deals ${dmg} damage!`);
  floatDamage(dmg, "enemyCard");
  animateCard("enemyCard", "skill-anim");

  updateUI();
  if (!checkWin()) enemyTurn();
}

/* -------------------------
   APPLY SKILL DAMAGE
   Called by skillTiming.js
------------------------- */

export function applySkillDamage(perfect) {
  resetSkillTiming();

  let base = getBaseDamage(player);
  let dmg = computeDamage(base, player, enemy);

  //if (player.weapon) {
    //const w = player.weapon;
    //base = Math.floor(Math.random() * (w.damage.max - w.damage.min + 1)) + w.damage.min;

    //base = computeDamage(base, player, enemy);

  //} else {
    // Original unarmed damage
    //base = Math.floor(Math.random() * 6) + 4;
    //base = computeDamage(base, player, enemy);
  //}

  if (perfect === true) {
    dmg = dmg * 2; // Perfect timing
  } else if (perfect === false) {
    dmg = Math.floor(dmg * 1.5); // Normal timing
  }

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  dmg = Math.floor(dmg);
  enemy.hp -= dmg;
  if (enemy.hp < 0) enemy.hp = 0;

  log(`You attack for ${dmg}!`);
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
  //const w = enemy.weapon;

  // --- Weapon base damage roll ---
  //const base = Math.floor(Math.random() * (w.damage.max - w.damage.min + 1)) + w.damage.min;

  // --- Final damage using your existing formula ---
  let dmg = computeDamage(base, enemy, player);

  alert(`computed ${dmg}`);

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
  //const w = enemy.weapon;

  // --- Weapon base damage roll ---
  //const base = Math.floor(Math.random() * (w.damage.max - w.damage.min + 1)) + w.damage.min;

  // --- Final damage using your existing formula ---
  let dmg = computeDamage(base, enemy, player);

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
  alert("start player turn");
  player.ap += 1;
  clampAP();

  player.defending = false;
  removeDefendGlow("playerCard");

  log("\n--- Player Turn ---");

  updateUI();
  enableButtons();
}