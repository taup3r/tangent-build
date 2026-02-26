import { generateWeapon } from "./weapon.js";

/* ================================
   PLAYER COMBAT STATE
================================ */

export let player = {
  name: null,
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
  CON: 0,
  playerWeapon: null
};

export function loadProgress() {
  const params = new URLSearchParams(window.location.search);
  const playerName = params.get("player");

  if (!playerName) return;

  const key = `save_${playerName}`;
  const saved = localStorage.getItem(key);

  if (!saved) return;

  const data = JSON.parse(saved);

  Object.assign(playerStats, data.playerStats);

  player.name = playerName;

  if (data.playerWeapon) {
    player.weapon = data.playerWeapon;
  }

  applyStatsToCombat(player, playerStats);
  applyConstitution(player);
}

export function saveProgress() {
  const params = new URLSearchParams(window.location.search);
  const playerName = params.get("player");

  if (!playerName) return;

  const key = `save_${playerName}`;

  localStorage.setItem(key, JSON.stringify({
    playerName,
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
   ENEMY TYPES + TIERS
================================ */

const enemyTypes = [
  { type: "Aggressive Fighter", behavior: "aggressive", hint: "This foe seems bloodthirsty..." },
  { type: "Defensive Guard", behavior: "defensive", hint: "This one watches your moves carefully..." },
  { type: "Cunning Warlock", behavior: "warlock", hint: "A strange aura surrounds this enemy..." }
];

// Tier roll: 80% normal, 15% elite, 5% boss
function rollEnemyTier() {
  const r = Math.random();
  if (r < 0.05) return "boss";
  if (r < 0.20) return "elite";
  return "normal";
}

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

/* ================================
   ENEMY GENERATOR (TIERED)
================================ */

export function generateEnemy(playerLevel) {
  const tier = rollEnemyTier();

  // Level scaling
  let level = playerLevel;
  if (tier === "elite") level += 1;
  if (tier === "boss") level += 3;

  // Base type
  const baseType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

  // Name prefix
  let name = randomName();
  if (tier === "elite") name = "Elite " + name;
  if (tier === "boss") name = "Boss " + name;

  // Tier hints
  let tierHint = "";
  if (tier === "elite") tierHint = "This enemy radiates dangerous strength.";
  if (tier === "boss") tierHint = "A terrifying presence looms over you.";

  const stats = randomEnemyStats(level);
  const weapon = generateWeapon(level);

  return {
    baseMaxHP: 30,
    hp: 0,
    max: 30,
    ap: 0,
    defending: false,

    // Combat stats
    STR: stats.STR,
    DEX: stats.DEX,
    AGI: stats.AGI,
    CON: stats.CON,

    // Metadata
    name,
    level,
    type: tier,
    behavior: baseType.behavior,
    hint: tierHint || baseType.hint,
    stats,
    weapon
  };
}

/* ================================
   INITIAL ENEMY INSTANCE
================================ */

export let enemy = generateEnemy(playerStats.level);

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

  // Tier color coding
  const nameEl = document.getElementById("enemyName");

  nameEl.textContent = enemy.name;

  if (enemy.type === "elite") {
    nameEl.style.color = "#ffcc00";
  } else if (enemy.type === "boss") {
    nameEl.style.color = "#ff4444";
  } else {
    nameEl.style.color = "";
  }
  document.getElementById("enemyHint").textContent = enemy.hint;

  const weaponEl = document.getElementById("enemyWeapon");
  weaponEl.textContent = enemy.weapon.name;
  weaponEl.style.color = enemy.weapon.color;
}

/* ================================
   AP CLAMP
================================ */

export function clampAP() {
  if (player.ap > 3) player.ap = 3;
  if (enemy.ap > 3) enemy.ap = 3;
}

/* -------------------------
   APPLY CON STAT (MaxHP)
------------------------- */

export function applyConstitution(entity) {
  const base = Number(entity.baseMaxHP) || 0;

  // --- Total CON = base CON + weapon CON (if any) ---
  let totalCON = Number(entity.CON) || 0;

  if (entity.weapon) {
    const weaponCON = Number(entity.weapon.stats.CON) || 0;
    totalCON += weaponCON;
  }

  // --- Final MaxHP ---
  entity.max = base + (totalCON * 5);

  // --- Adjust current HP if needed ---
  if (entity.hp > entity.max) {
    entity.hp = entity.max;
  }

  // If HP is 0 (new entity), set to full
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

/* -----------------------
   DUNGEON FUNCTIONS
------------------------ */

const playerDungeonMode = `dungeonMode_${player.name}`;
const playerDungeonEnemiesLeft = `dungeonEnemiesLeft_${player.name}`;

export let dungeonMode = localStorage.getItem(playerDungeonMode) === "true";

export let dungeonEnemiesLeft = Number(localStorage.getItem(playerDungeonEnemiesLeft) || 0);

export function setDungeonMode(enable) {
  if (enable) {
    localStorage.setItem(playerDungeonMode, "true");
  }
  else {
    localStorage.removeItem(playerDungeonMode);
    localStorage.removeItem(playerDungeonEnemiesLeft);
  }
}

export function setEnemiesLeft(count) {
  localStorage.setItem(playerDungeonEnemiesLeft, count);
}