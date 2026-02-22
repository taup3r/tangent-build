// =========================
// WEAPON DATA (Even Ranks 1–30)
// =========================
const weapons = [
  { rank: 1,  type: "Dagger",      min: 3,  max: 7 },
  { rank: 3,  type: "Shortsword",  min: 6,  max: 12 },
  { rank: 5,  type: "Spear",       min: 8,  max: 16 },
  { rank: 8,  type: "Scimitar",    min: 7,  max: 15 },
  { rank: 10, type: "Mace",        min: 9,  max: 17 },
  { rank: 13, type: "Longsword",   min: 10, max: 18 },
  { rank: 15, type: "Morningstar", min: 10, max: 21 },
  { rank: 18, type: "Flail",       min: 7,  max: 19 },
  { rank: 20, type: "War Pick",    min: 11, max: 24 },
  { rank: 23, type: "Battle Axe",  min: 12, max: 22 },
  { rank: 25, type: "Halberd",     min: 13, max: 25 },
  { rank: 28, type: "Warhammer",   min: 14, max: 26 },
  { rank: 30, type: "Greatsword",  min: 15, max: 28 }
];

// =========================
// PREFIX / SUFFIX POOLS
// =========================
const prefixPools = {
  STR: ["Ravager’s", "Ironbound", "Warborn", "Bonecrusher", "Stalwart"],
  DEX: ["Keen‑Edged", "Shadowtip", "Needlepoint", "Quickhand", "Windlaced"],
  AGI: ["Swift‑Edged", "Windpiercer", "Gale‑Forged", "Stormpiercer", "Lightfoot"],
  CON: ["Stone‑Hewn", "Ironbound", "Stalwart", "Resolute", "Bulwark"]
};

const suffixPools = {
  STR: ["of Ruinous Force", "of the Iron Tempest", "of Breaking Might"],
  DEX: ["of the Needle Fang", "of Swift Precision", "of the Silent Step"],
  AGI: ["of the Silent Gale", "of Piercing Winds", "of the Whirling Hunt"],
  CON: ["of Enduring Might", "of the Iron Vanguard", "of Unbroken Steel"]
};

// =========================
// COLOR SYSTEM (BY 10s)
// =========================
function getColorByRank(rank) {
  if (rank <= 10) return { tier: "Common",    color: "#C0C0C0" };
  if (rank <= 20) return { tier: "Uncommon",  color: "#4CAF50" };
  if (rank <= 30) return { tier: "Rare",      color: "#2196F3" };
  if (rank <= 40) return { tier: "Epic",      color: "#9C27B0" };
  if (rank <= 50) return { tier: "Legendary", color: "#FF9800" };
  return { tier: "Mythic", color: "#FF0000" };
}

// =========================
// UTILITY FUNCTIONS
// =========================
function weightedStatCount() {
  const roll = Math.random();
  if (roll < 0.50) return 1;
  if (roll < 0.80) return 2;
  if (roll < 0.95) return 3;
  return 4;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function distributePoints(total, count) {
  const result = Array(count).fill(0);
  for (let i = 0; i < total; i++) {
    result[Math.floor(Math.random() * count)]++;
  }
  return result;
}

// =========================
// MAIN GENERATOR
// =========================
export function generateWeapon(inputRank) {
  const eligible = weapons.filter(w => w.rank <= inputRank);
  const weapon = pickRandom(eligible);

  const remaining = inputRank - weapon.rank;

  let stats = {};
  let name = weapon.type;

  // =========================
  // CASE 1: No remaining rank → No stats, no prefix/suffix
  // =========================
  if (remaining === 0) {
    const colorInfo = getColorByRank(inputRank);

    return {
      name,
      type: weapon.type,
      rarity: colorInfo.tier,
      color: colorInfo.color,
      baseRank: weapon.rank,
      inputRank,
      remainingRank: remaining,
      damage: { min: weapon.min, max: weapon.max },
      stats: {}
    };
  }

  // =========================
  // CASE 2: Normal stat generation
  // =========================
  const statCount = weightedStatCount();
  const statTypes = ["STR", "DEX", "AGI", "CON"];
  const chosenStats = [];

  while (chosenStats.length < statCount) {
    const stat = pickRandom(statTypes);
    if (!chosenStats.includes(stat)) chosenStats.push(stat);
  }

  const distribution = distributePoints(remaining, chosenStats.length);

  chosenStats.forEach((s, i) => stats[s] = distribution[i]);

  // Count stats with actual value
  const statsWithValue = Object.entries(stats).filter(([_, v]) => v > 0);

  // If no stats have value → base name only
  if (statsWithValue.length === 0) {
    const colorInfo = getColorByRank(inputRank);

    return {
      name,
      type: weapon.type,
      rarity: colorInfo.tier,
      color: colorInfo.color,
      baseRank: weapon.rank,
      inputRank,
      remainingRank: remaining,
      damage: { min: weapon.min, max: weapon.max },
      stats
    };
  }

  // Determine dominant stat
  const dominantStat = statsWithValue.sort((a, b) => b[1] - a[1])[0][0];

  // Always apply prefix
  const prefix = pickRandom(prefixPools[dominantStat]);

  // Apply suffix ONLY if more than one stat has value
  if (statsWithValue.length > 1) {
    const suffix = pickRandom(suffixPools[dominantStat]);
    name = `${prefix} ${weapon.type} ${suffix}`;
  } else {
    name = `${prefix} ${weapon.type}`;
  }

  const colorInfo = getColorByRank(inputRank);

  return {
    name,
    type: weapon.type,
    rarity: colorInfo.tier,
    color: colorInfo.color,
    baseRank: weapon.rank,
    inputRank,
    remainingRank: remaining,
    damage: { min: weapon.min, max: weapon.max },
    stats
  };
}