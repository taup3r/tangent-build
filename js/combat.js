/* ============================================
   COMBAT MODULE
   Handles:
   - Player attack
   - Player defend
   - Player skill
   - Enemy attack
   - Turn flow
============================================ */

import { player, enemy } from "./state.js";
import { updateUI, log, disableButtons, enableButtons, floatDamage } from "./ui.js";
import { computeDerivedStats } from "./state.js";

/* -------------------------
   HIT / MISS ROLL
------------------------- */

function rollHit(attacker, defender) {
  const hit = attacker.hitChance;
  const evade = defender.evadeChance;

  const finalChance = Math.max(5, Math.min(95, hit - evade));
  return Math.random() * 100 < finalChance;
}

/* -------------------------
   PLAYER ATTACK
------------------------- */

export function playerAttack() {
  if (!rollHit(player, enemy)) {
    log("You missed!");
    endPlayerTurn();
    return;
  }

  const dmg = player.damage;
  enemy.hp = Math.max(0, enemy.hp - dmg);

  floatDamage(dmg, "enemyCard");
  log(`You hit the enemy for ${dmg}!`);

  updateUI();
  endPlayerTurn();
}

/* -------------------------
   PLAYER DEFEND
------------------------- */

export function playerDefend() {
  player.defending = true;
  log("You brace for impact.");
  endPlayerTurn();
}

/* -------------------------
   PLAYER SKILL
------------------------- */

export function playerSkill() {
  // Check hit BEFORE timing mini-game
  if (!rollHit(player, enemy)) {
    log("Your skill missed!");
    endPlayerTurn();
    return;
  }

  // If hit, show timing mini-game
  document.getElementById("hitBtn").style.display = "block";
  disableButtons();

  window.skillAttackPending = true;
}

/* -------------------------
   ENEMY ATTACK
------------------------- */

export function enemyAttack() {
  if (!rollHit(enemy, player)) {
    log("Enemy missed!");
    startPlayerTurn();
    return;
  }

  let dmg = enemy.damage;

  if (player.defending) {
    dmg = Math.floor(dmg / 2);
    player.defending = false;
  }

  player.hp = Math.max(0, player.hp - dmg);

  floatDamage(dmg, "playerCard");
  log(`Enemy hits you for ${dmg}!`);

  updateUI();
  startPlayerTurn();
}

/* -------------------------
   TURN FLOW
------------------------- */

export function startPlayerTurn() {
  enableButtons();
}

export function endPlayerTurn() {
  disableButtons();
  setTimeout(enemyAttack, 600);
}