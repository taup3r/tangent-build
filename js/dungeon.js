export const dungeonTypes = {
  normal: {
    name: "Normal Dungeon",
    enemies: 3,
    elites: 0,
    bosses: 1,
    intro: "You step into the dim caverns, the air thick with dust and forgotten echoes.",
    epilogue: "The cavern falls silent as the final foe collapses. You emerge into daylight once more.",
    rewardBonus: 2
  },
  hard: {
    name: "Hard Dungeon",
    enemies: 5,
    elites: 1,
    bosses: 1,
    intro: "The ancient ruins groan as you enter. Something powerful stirs deeper within.",
    epilogue: "The ruins tremble as the boss falls. A strange energy dissipates into the air.",
    rewardBonus: 4
  },
  nightmare: {
    name: "Nightmare Dungeon",
    enemies: 8,
    elites: 2,
    bosses: 1,
    intro: "A cursed wind howls through the obsidian halls. Only the strongest return from this place.",
    epilogue: "The nightmare fades as the final monstrosity falls. You feel changed by what you survived.",
    rewardBonus: 6
  }
};

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