export const dungeonTypes = {
  normal: {
    type: "normal",
    name: "Dim Caverns",
    enemies: 4,
    elites: 1,
    bosses: 1,
    intro: "You step into the dim caverns, the air thick with dust and forgotten echoes.",
    epilogue: "The cavern falls silent as the final foe collapses. You emerge into daylight once more.",
    rewardBonus: 4
  },
  hard: {
    type: "hard",
    name: "Ancient Ruins",
    enemies: 6,
    elites: 2,
    bosses: 1,
    intro: "The ancient ruins groan as you enter. Something powerful stirs deeper within.",
    epilogue: "The ruins tremble as the boss falls. A strange energy dissipates into the air.",
    rewardBonus: 6
  },
  nightmare: {
    type: "nightmare",
    name: "Obsidian Halls",
    enemies: 8,
    elites: 3,
    bosses: 1,
    intro: "A cursed wind howls through the obsidian halls. Only the strongest return from this place.",
    epilogue: "The nightmare fades as the final monstrosity falls. You feel changed by what you survived.",
    rewardBonus: 8
  }
};

function getDifficulty() {
  const roll = Math.random();
  if (roll < 0.30) return "normal";
  if (roll < 0.60) return "hard";
  return "nightmare";
}

export function getRandomDungeonType() {
  return dungeonTypes[getDifficulty()];
}

export function generateDungeonQueue(type) {
  const d = dungeonTypes[type];

  const queue = [];

  // Add normals
  for (let i = 0; i < d.enemies - d.elites - d.bosses; i++) {
    queue.push("normal");
  }

  // Add elites
  for (let i = 0; i < d.elites; i++) {
    queue.push("elite");
  }

  // Add boss (we will keep this last)
  const boss = "boss";

  // Shuffle normals + elites
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  // Boss always last
  queue.push(boss);

  return queue;
}