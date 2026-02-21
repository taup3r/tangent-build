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
  Object.assign(playerStats, JSON.parse(saved).playerStats);
}

export function saveProgress() {
  localStorage.setItem("playerProgress", JSON.stringify({ playerStats }));
}

loadProgress();

/* ================================
   PLAYER COMBAT STATE
================================ */

export const player = {
  baseMaxHP: 30,
  hp: 30,
  max: 30,
  ap: 0,
  defending: false
};

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
  hp: 30,
  max: 30,
  ap: 0,
  defending: false,
  ...enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
  name: randomName(),
  level: playerStats.level,
  stats: enemyStats
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
  const base = entity.baseMaxHP;
  const con = entity.CON || 0;

  entity.max = base + (con * 5);

  // Clamp HP to new max
  if (entity.hp > entity.max) {
    entity.hp = entity.max;
  }

  // Prevent 0/0 HP display on initialization
  if (entity.hp === 0 && entity.max > 0) {
    entity.hp = entity.max;
  }
}