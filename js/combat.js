/* ============================================
   COMBAT MODULE
   Handles:
   - Player attack / defend / skill
   - Damage application
   - Animations
   - Turn transitions
============================================ */

import { player, enemy, clampAP } from "./state.js";
import { updateUI, log, disableButtons, enableButtons, floatDamage, resetHitButton } from "./ui.js";
import { startSkillTiming, resetSkillTiming } from "./skillTiming.js";
import { enemyTurn } from "./enemyAI.js";
import { checkWin } from "./modal.js";

/* -------------------------
   ANIMATION HELPERS
------------------------- */

function animateCard(cardId, animClass, duration = 300) {
  const card = document.getElementById(cardId);
  card.classList.add(animClass);
  setTimeout(() => card.classList.remove(animClass), duration);
}

function animateSkillDouble(cardId) {
  animateCard(cardId, "skill-anim", 300);
  setTimeout(() => animateCard(cardId, "skill-anim", 300), 1000);
}

function applyDefendGlow(cardId) {
  document.getElementById(cardId).classList.add("defend-glow");
}

function removeDefendGlow(cardId) {
  document.getElementById(cardId).classList.remove("defend-glow");
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
  animateCard("enemyCard", "attack-anim");

  let dmg = Math.floor(Math.random() * 6) + 4;

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