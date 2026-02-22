import { generateWeapon } from "./weapon.js";

/* ================================
   PLAYER COMBAT STATE
================================ */

export let player = {
  baseMaxHP: 30,
  hp: 0,
  max: 30,
  ap: 0,
  defending: false,
  STR: 0,
  DEX: 0,
  AGI: 0,
  CON: 0,
  weapon: null
};

/* ================================
   LOAD / SAVE PLAYER PROGRESSION
================================ */

export let playerStats = {
  level: 1,
  exp: 0,
  expToNext: 20,
  statPoints: 0,
  STR: 0,
  DEX: 0,
  AGI: 0,
  CON: 0
};

function loadProgress() {
  const saved = localStorage.getItem("playerProgress");
  if (!saved) return;

  const data = JSON.parse(saved);

  Object.assign(playerStats, data.playerStats);

  // Load weapon if it exists
  if (data.playerWeapon) {
    player.weapon = data.playerWeapon;
  }
  applyStatsToCombat(player, playerStats);
  applyConstitution(player);
}

export function saveProgress() {
  localStorage.setItem("playerProgress", JSON.stringify({
    playerStats,
    playerWeapon: player.weapon || null
  }));
}

loadProgress();

/* ================================
   EXP + LEVELING
================================ */

export function gainExp(amount) {
  playerStats.exp += amount;

  while (playerStats.exp >= playerStats.expToNext) {
    playerStats.exp -= playerStats.expToNext;
    playerStats.level++;
    playerStats.statPoints += 3;
    playerStats.expToNext = Math.floor(playerStats.expToNext * 1.25);
  }

  saveProgress();
}

export function loseExp(amount) {
  playerStats.exp -= amount;
  if (playerStats.exp < 0) playerStats.exp = 0;
  saveProgress();
}

/* ================================
   ENEMY TYPES
================================ */

const enemyTypes = [
  { type: "Aggressive Fighter", behavior: "aggressive", hint: "This foe seems bloodthirsty..." },
  { type: "Defensive Guard", behavior: "defensive", hint: "This one watches your moves carefully..." },
  { type: "Cunning Warlock", behavior: "warlock", hint: "A strange aura surrounds this enemy..." }
];

function randomName() {
  const first = ["Gor", "Thal", "Rin", "Vor", "Kel", "Zar", "Mor", "Fen"];
  const last = ["Bloodfang", "Ironhide", "Nightweaver", "Stormborn", "Ashclaw"];
  return first[Math.floor(Math.random() * first.length)] + " " +
         last[Math.floor(Math.random() * last.length)];
}

/* ================================
   ENEMY STATS MATCH PLAYER LEVEL
================================ */

function randomEnemyStats(level) {
  const stats = { STR: 0, DEX: 0, AGI: 0, CON: 0 };
  let points = (level - 1) * 3;
  const keys = ["STR", "DEX", "AGI", "CON"];

  while (points > 0) {
    const k = keys[Math.floor(Math.random() * keys.length)];
    stats[k]++;
    points--;
  }

  return stats;
}

export let enemyStats = randomEnemyStats(playerStats.level);

/* ================================
   ENEMY OBJECT
================================ */

export let enemy = {
  baseMaxHP: 30,
  hp: 0,
  max: 30,
  ap: 0,
  defending: false,
  STR: 0,
  DEX: 0,
  AGI: 0,
  CON: 0,
  ...enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
  name: randomName(),
  level: playerStats.level,
  stats: enemyStats,
  weapon: generateWeapon(playerStats.level)
};

/* ================================
   PORTRAITS
================================ */

const enemyPortraits = {
  aggressive: "assets/enemy_aggressive.png",
  defensive: "assets/enemy_defensive.png",
  warlock: "assets/enemy_warlock.png"
};

export function initializePortraits() {
  document.getElementById("enemyPortrait").src = enemyPortraits[enemy.behavior];
  document.getElementById("playerPortrait").src = "assets/player.png";

  document.getElementById("enemyName").textContent = enemy.name;
  document.getElementById("enemyHint").textContent = enemy.hint;

document.getElementById("enemyName").textContent = enemy.name;

const weaponEl = document.getElementById("enemyWeapon");
weaponEl.textContent = enemy.weapon.name;
weaponEl.style.color = enemy.weapon.color;
}

/* ================================
   AP CLAMP
================================ */

export function clampAP() {
  if (player.ap > 2) player.ap = 2;
  if (enemy.ap > 2) enemy.ap = 2;
}

/* -------------------------
   APPLY CON STAT (MaxHP)
------------------------- */

export function applyConstitution(entity) {
  const base = Number(entity.baseMaxHP) || 0;
  const con = Number(entity.CON) || 0;

  entity.max = base + (con * 5);

  // Clamp HP to new max
  if (entity.hp > entity.max) {
    entity.hp = entity.max;
  }

  // If HP is 0 but max > 0 (fresh load), set HP to max
  if (entity.hp === 0 && entity.max > 0) {
    entity.hp = entity.max;
  }
}

/* -----------------------
   APPLY STATS TO COMBAT
------------------------ */
export function applyStatsToCombat(player, playerStats) {
  player.STR = Number(playerStats.STR) || 0;
  player.DEX = Number(playerStats.DEX) || 0;
  player.AGI = Number(playerStats.AGI) || 0;
  player.CON = Number(playerStats.CON) || 0;
}