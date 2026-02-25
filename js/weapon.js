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
// PREFIX / SUFFIX TIERS
// =========================

const prefixTiers = {
  STR: [
    "Ironbound", "Warborn", "Bonecrusher",
    "Titan‑Forged", "Colossus‑Wrought", "Worldbreaker"
  ],
  DEX: [
    "Keen‑Edged", "Shadowtip", "Needlepoint",
    "Ghosthand", "Phantom‑Laced", "Specter‑Forged"
  ],
  AGI: [
    "Swift‑Edged", "Windpiercer", "Gale‑Forged",
    "Stormstride", "Tempest‑Wrought", "Hurricane‑Born"
  ],
  CON: [
    "Stone‑Hewn", "Bulwark‑Forged", "Iron‑Rooted",
    "Earthshaker", "Mountain‑Born", "Titan‑Shelled"
  ]
};

const suffixTiers = {
  STR: ["of Force", "of the Iron Tempest", "of Breaking Might"],
  DEX: ["of Precision", "of the Silent Step", "of the Needle Fang"],
  AGI: ["of the Gale", "of Piercing Winds", "of the Whirling Hunt"],
  CON: ["of Endurance", "of the Iron Vanguard", "of Unbroken Steel"]
};

// =========================
// UNIQUE NAME POOLS
// (keys are alphabetical: AGI+CON, DEX+STR, etc.)
// =========================

const hybridUniques = {
  "DEX+STR": ["The Crimson Needle", "Razor of the Iron Tempest", "Blood‑Quick Edge", "The Split Fang", "Ironwind Severer"],
  "AGI+STR": ["Stormbreaker’s Leap", "Thunderclad Arc", "Gale‑Sunder", "The Sky‑Hammer", "Tempest Rend"],
  "CON+STR": ["The Immovable Wrath", "Ironheart Colossus", "Stone‑Split Fury", "The Granite Reaver", "Earthshatter Oathblade"],
  "AGI+DEX": ["Windshadow Blade", "The Whispering Tempest", "Skyfang", "Stormstep Razor", "The Gale‑Thread Edge"],
  "CON+DEX": ["The Silent Bulwark", "Ironthread Edge", "Quiet Bastion", "The Still Fang", "Stone‑Veil Cutter"],
  "AGI+CON": ["Stormroot Edge", "Gale‑Forged Bulwark", "Earthwind Talon", "The Iron Gale", "Tempest‑Rooted Blade"]
};

const triUniques = {
  "AGI+DEX+STR": ["The Trifold Tempest", "Storm‑Threaded Edge", "The Threefold Fang", "Gale‑Riven Trinity", "The Tri‑Strike Arc"],
  "CON+DEX+STR": ["Iron‑Wrought Trinity", "The Stone‑Threaded Edge", "Tri‑Forged Bulwark", "The Iron Triad", "Colossus‑Thread Blade"],
  "AGI+CON+STR": ["The Earthstorm Edge", "Tri‑Rooted Tempest", "The Mountain Gale", "Storm‑Shelled Reaver", "The Titan’s Breath"],
  "AGI+CON+DEX": ["The Whispering Bastion", "Wind‑Wrought Sentinel", "The Silent Tempest", "Gale‑Bound Aegis", "The Veiled Trinity"]
};

const mythicUniques = [
  "Eclipse of the Worldforge",
  "The Last Dawn",
  "Star‑Eater",
  "The Shattered Sky",
  "Oath of the Eternal Flame",
  "Voidcarver",
  "The First Blade",
  "Sunsunder",
  "The Pale King’s Judgment",
  "Heart of the Fallen Star"
];

// =========================
// UNIQUE LORE TEXT
// =========================

const hybridLore = [
  "Forged where two forces meet, its edge carries the tension of opposing strengths.",
  "A weapon born of dual mastery, resonating with paired energies.",
  "Legends say it was wielded by one who walked two paths at once.",
  "Balanced between two natures, it strikes with blended purpose.",
  "Its forging united rival clans, each contributing their essence."
];

const triLore = [
  "Threefold power hums beneath its surface, each force reinforcing the others.",
  "A rare creation said to require three masters working in perfect harmony.",
  "Its tri‑woven essence makes it unpredictable yet devastating.",
  "Forged at the convergence of three storms, its power is unmatched.",
  "Only those who embody balance in all things can wield it fully."
];

const mythicLore = [
  "A perfect convergence of all forces, its balance is said to mirror the cosmos.",
  "Legends claim it predates the written word, forged in the first dawn.",
  "Its power is absolute equilibrium — neither chaos nor order dominates.",
  "Sages say it chooses its wielder, not the other way around.",
  "Said to be crafted from the heart of a fallen star, its harmony is flawless."
];

// =========================
// COLOR SYSTEM
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
// UTILITY
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
/* UNIQUE DETECTION */
// =========================

function detectUnique(stats) {
  const entries = Object.entries(stats).filter(([_, v]) => v > 0);
  if (entries.length === 0) return { type: "NONE" };

  entries.sort((a, b) => b[1] - a[1]);

  const highestValue = entries[0][1];
  const tied = entries.filter(e => e[1] === highestValue).map(e => e[0]);

  if (tied.length === 4) return { type: "MYTHIC" };
  if (tied.length === 3) return { type: "TRI", stats: tied };
  if (tied.length === 2) return { type: "HYBRID", stats: tied };

  return { type: "NONE" };
}

// =========================
/* MAIN GENERATOR */
// =========================

export function generateWeapon(inputRank) {
  const eligible = weapons.filter(w => w.rank <= inputRank);
  const weapon = pickRandom(eligible);

  const remaining = inputRank - weapon.rank;

  let stats = {};
  let name = weapon.type;
  let lore = null;
  let isUnique = false;
  let uniqueType = "NONE";

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
      stats: {},
      lore: null
    };
  }

  const statCount = weightedStatCount();
  const statTypes = ["STR", "DEX", "AGI", "CON"];
  const chosenStats = [];

  while (chosenStats.length < statCount) {
    const stat = pickRandom(statTypes);
    if (!chosenStats.includes(stat)) chosenStats.push(stat);
  }

  const distribution = distributePoints(remaining, chosenStats.length);
  chosenStats.forEach((s, i) => stats[s] = distribution[i]);

  const statsWithValue = Object.entries(stats).filter(([_, v]) => v > 0);

  const unique = detectUnique(stats);
  uniqueType = unique.type;

  if (uniqueType === "MYTHIC") {
    name = pickRandom(mythicUniques);
    lore = pickRandom(mythicLore);
    isUnique = true;
  } else if (uniqueType === "TRI") {
    const key = unique.stats.sort().join("+");
    const pool = triUniques[key];
    if (pool && pool.length) {
      name = pickRandom(pool);
      lore = pickRandom(triLore);
      isUnique = true;
    }
  } else if (uniqueType === "HYBRID") {
    const key = unique.stats.sort().join("+");
    const pool = hybridUniques[key];
    if (pool && pool.length) {
      name = pickRandom(pool);
      lore = pickRandom(hybridLore);
      isUnique = true;
    }
  }

  if (!isUnique) {
    if (statsWithValue.length > 0) {
      const highest = statsWithValue.sort((a, b) => b[1] - a[1])[0];
      const highestStat = highest[0];
      const highestValue = highest[1];

      const prefixIndex = Math.min(Math.floor((highestValue - 1) / 5), 5);
      const prefix = prefixTiers[highestStat][prefixIndex];

      if (statsWithValue.length > 1) {
        const secondStat = statsWithValue[1][0];
        const extraStats = statsWithValue.length - 1;
        const suffixIndex = Math.min(extraStats - 1, 2);
        const suffix = suffixTiers[secondStat][suffixIndex];
        name = `${prefix} ${weapon.type} ${suffix}`;
      } else {
        name = `${prefix} ${weapon.type}`;
      }
    }
  }

  let minDamage = weapon.min;
  let maxDamage = weapon.max;

  if (uniqueType === "HYBRID") {
    minDamage += 1;
    maxDamage -= 1;
  } else if (uniqueType === "TRI") {
    minDamage += 2;
    maxDamage -= 2;
  } else if (uniqueType === "MYTHIC") {
    minDamage += 3;
    maxDamage -= 3;
  }

  const colorInfo = getColorByRank(inputRank);

  return {
    name,
    type: weapon.type,
    rarity: isUnique ? "Unique" : colorInfo.tier,
    color: isUnique ? "#FFD700" : colorInfo.color,
    baseRank: weapon.rank,
    inputRank,
    remainingRank: remaining,
    damage: { min: minDamage, max: maxDamage },
    stats,
    lore
  };
}