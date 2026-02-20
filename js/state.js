/* ============================================
   STATE MODULE
   Handles:
   - Player stats
   - Enemy stats
   - Derived stat computation
============================================ */

export const playerStats = {
  level: 1,
  exp: 0,
  expToNext: 20,

  STR: 0,
  DEX: 0,
  AGI: 0,
  CON: 0,
};

export const player = {
  baseDamage: 5,
  baseMaxHP: 30,

  STR: 0,
  DEX: 0,
  AGI: 0,
  CON: 0,

  hp: 30,
  max: 30,
  ap: 3,
};

export const enemy = {
  baseDamage: 4,
  baseMaxHP: 20,

  STR: 1,
  DEX: 1,
  AGI: 1,
  CON: 1,

  hp: 20,
  max: 20,
  ap: 3,
};

/* -------------------------
   DERIVED STAT CALCULATION
------------------------- */

export function computeDerivedStats(entity) {
  entity.max = entity.baseMaxHP + (entity.CON * 5);
  entity.hp = Math.min(entity.hp, entity.max);

  entity.damage = entity.baseDamage + (entity.STR * 2);

  entity.hitChance = 80 + (entity.DEX * 2);   // %
  entity.evadeChance = 0 + (entity.AGI * 2);  // %
}

/* -------------------------
   INITIALIZE PORTRAITS
------------------------- */

export function initializePortraits() {
  document.getElementById("playerPortrait").src = "assets/player.png";
  document.getElementById("enemyPortrait").src = "assets/enemy.png";

  computeDerivedStats(player);
  computeDerivedStats(enemy);
}