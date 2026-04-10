import { generateWeapon } from "./weapon.js";
import { generateDungeonQueue } from "./dungeon.js";

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
  weapon: null,
  tenacity: 0
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
  playerWeapon: null,
  gold: 0,
  reputation: 0,
  items: [],
  zone: "townSquare",
  combatEncounter: false
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

  if (playerStats.zone) {
    //do nothing
  } else {
    playerStats.zone = "townSquare";
  }

  if (playerStats.combatEncounter) {
    //do nothing
  } else {
    playerStats.combatEncounter = false;
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

export function gainGold(amount) {
  playerStats.gold += amount;
  saveProgress();
}

/* ================================
   ENEMY TYPES + TIERS
================================ */

const enemyTypes = [
  { type: "Aggressive Fighter", behavior: "aggressive", hint: "This foe seems bloodthirsty..." },
  { type: "Defensive Guard", behavior: "defensive", hint: "This one watches your moves carefully..." },
  { type: "Cunning Warlock", behavior: "warlock", hint: "A strange aura surrounds this enemy..." },
  { type: "Silent Assassin", behavior: "assassin", hint: "This foe moves with deadly precision..." },
  { type: "Raging Berserker", behavior: "berserker", hint: "Its eyes burn with uncontrollable fury..." },
  { type: "Iron Sentinel", behavior: "sentinel", hint: "A towering guardian stands unmoved..." }
];

// Tier roll:
function rollEnemyTier() {
  const rep = playerStats.reputation || 0;

  const normalChance = 70 - (rep * 0.7);
  const eliteChance = 25 + (rep * 0.3);
  const veteranChance = 4 + (rep * 0.26);
  const bossChance = 1 + (rep * 0.14);

  const roll = Math.random() * 100;

  if (roll < normalChance) return "normal";
  if (roll < normalChance + eliteChance) return "elite";
  if (roll < normalChance + eliteChance + veteranChance) return "veteran";
  return "boss";
}

function randomName() {
  const first = ["Gor", "Thal", "Rin", "Vor", "Kel", "Zar", "Mor", "Fen", "Lin", "Rex", "Stu", "Bal"];
  const last = ["Bloodfang", "Ironhide", "Nightweaver", "Stormborn", "Ashclaw", "Capslock", "Coldwind", "Boltsong"];
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

/* -----------------------
   DUNGEON FUNCTIONS
------------------------ */

const playerDungeonMode = `dungeonMode_${player.name}`;
const playerDungeonEnemiesLeft = `dungeonEnemiesLeft_${player.name}`;

export let dungeonMode = localStorage.getItem(playerDungeonMode) === "true";

export let dungeonEnemiesLeft = Number(localStorage.getItem(playerDungeonEnemiesLeft) || 0);

export function setEnemiesLeft(count) {
  localStorage.setItem(playerDungeonEnemiesLeft, count);
}

const playerDungeonType = `dungeonType_${player.name}`;
const playerDungeonQueue = `dungeonQueue_${player.name}`;
const playerDungeonIndex = `dungeonIndex_${player.name}`;
const playerEnemyName = `enemyName_${player.name}`;

export function setDungeonMode(enable) {
  if (enable) {
    localStorage.setItem(playerDungeonMode, "true");
  }
  else {
    localStorage.removeItem(playerDungeonMode);
    localStorage.removeItem(playerDungeonEnemiesLeft);
  localStorage.removeItem(playerDungeonType);

  localStorage.removeItem(playerDungeonQueue);

  localStorage.removeItem(playerDungeonIndex);
  }
}

export function startDungeon(type) {
  const queue = generateDungeonQueue(type);

  localStorage.setItem(playerDungeonType, type);
  localStorage.setItem(playerDungeonQueue, JSON.stringify(queue));
  localStorage.setItem(playerDungeonIndex, "0");
}

export let dungeonType = localStorage.getItem(playerDungeonType);

export let dungeonQueue = JSON.parse(localStorage.getItem(playerDungeonQueue) || "[]");

export let dungeonIndex = Number(localStorage.getItem(playerDungeonIndex) || 0);

export let enemyName = localStorage.getItem(playerEnemyName);

export function setEnemyName(name) {
  localStorage.setItem(playerEnemyName, name);
}

export function clearEnemyName() {
  localStorage.removeItem(playerEnemyName);
}

export function getNextDungeonIndex() {
  dungeonIndex++;
  localStorage.setItem(playerDungeonIndex, dungeonIndex);
}

export function getNextDungeonTier() {
  return dungeonQueue[dungeonIndex];
}

/* ================================
   ENEMY GENERATOR (TIERED)
================================ */

export function generateEnemy(playerLevel) {
  let tier;
  if (dungeonMode) {
    tier = getNextDungeonTier();
  } else {
    tier = rollEnemyTier();
  }
  if (enemyName === "Guild Smuggler" && dungeonMode) {
    tier = "veteran";
  }

  // Level scaling
  let level = playerLevel;
  if (tier === "elite") level += 1;
  if (tier === "veteran") level += 2;
  if (tier === "boss") level += 3;

  // Base type
  const baseType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

  let name = randomName();

  // Name prefix
  if (tier === "elite") name = "Elite " + name;
  if (tier === "veteran") name = "Veteran " + name;
  if (tier === "boss") name = "Boss " + name;

  if (enemyName && dungeonMode) name = enemyName;

  // Tier hints
  let tierHint = "";
  if (tier === "elite") tierHint = "This enemy radiates dangerous strength.";
  if (tier === "veteran") tierHint = "This looks to be a match with a seasoned warrior.";
  if (tier === "boss") tierHint = "A terrifying presence looms over you.";

  const stats = randomEnemyStats(level);
  const weapon = generateWeapon(level);
  const tenacity = 0;

  const stunned = {
    active: false,
    duration: 0
  };

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
    weapon,
    gold: level * 4,
    stunned,

    tenacity
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
  warlock: "assets/enemy_warlock.png",
  assassin: "assets/enemy_assassin.png",
  sentinel: "assets/enemy_sentinel.png",
  berserker: "assets/enemy_berserker.png"
};

export function initializePortraits() {
  document.getElementById("enemyPortrait").src = enemyPortraits[enemy.behavior];
  document.getElementById("playerPortrait").src = "assets/player.png";

  // Tier color coding
  const nameEl = document.getElementById("enemyName");

  nameEl.textContent = enemy.name;

  if (enemy.type === "elite") {
    nameEl.style.color = "#ffcc00";
  } else if (enemy.type === "veteran") {
    nameEl.style.color = "#ffa500";
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

function applyAttributes() {
  //todo
}