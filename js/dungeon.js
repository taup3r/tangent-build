export const dungeonTypes = {
  normal: {
    type: "normal",
    name: "Dim Caverns",
    enemies: 4,
    elites: 1,
    veterans: 0,
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
    veterans: 1,
    bosses: 1,
    intro: "The ancient ruins groan as you enter. Something powerful stirs deeper within.",
    epilogue: "The ruins tremble as the boss falls. A strange energy dissipates into the air.",
    rewardBonus: 6
  },
  nightmare: {
    type: "nightmare",
    name: "Obsidian Halls",
    enemies: 8,
    elites: 2,
    veterans: 2,
    bosses: 1,
    intro: "A cursed wind howls through the obsidian halls. Only the strongest return from this place.",
    epilogue: "The nightmare fades as the final monstrosity falls. You feel changed by what you survived.",
    rewardBonus: 8
  },
  smuggler: {
    type: "normal",
    name: "Smuggler Hideout",
    enemies: 4,
    elites: 1,
    veterans: 1,
    bosses: 1,
    intro: "The townsfolk whisper about a place beneath the old trade roads — a forgotten wine cellar carved into the bedrock long before the town existed. Now, its stone corridors echo with the low murmur of contraband deals and the clatter of crates dragged across the floor.",
    epilogue: "The last smuggler collapses, their torch clattering across the stone floor. The hideout falls silent — no more whispered deals, no more crates dragged through the dark. Only the drip of water and the faint smell of smoke remain.",
    rewardBonus: 6
  },
  chapel: {
    type: "normal",
    name: "Ruined Chapel",
    enemies: 4,
    elites: 1,
    veterans: 1,
    bosses: 1,
    intro: "The chapel stands in silent collapse, its once‑proud spire snapped like a broken spear. Moonlight filters through shattered stained glass, scattering fractured colors across the dust‑choked floor. The air is thick with the scent of old incense and something far less holy — a metallic tang that clings to the back of your throat. Wooden pews lie overturned, clawed, and splintered. Faded murals peel from the walls, their saints’ faces scratched away by desperate hands. A faint hum vibrates beneath the stone tiles, pulsing like a heartbeat buried deep below.",
    epilogue: "The final echo of battle fades, swallowed by the chapel’s hollow acoustics. Dust settles over the broken altar as the unnatural hum beneath the floor finally dies, leaving behind a silence that feels almost relieved. Among the rubble, you uncover fragments of ritual chalk, torn pages of scripture rewritten in a trembling hand, and a symbol scorched into the stone — a mark that radiates faint warmth even now. Whatever happened here wasn’t an isolated act of madness. It was preparation. And the one who began it has already moved on.",
    rewardBonus: 6
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
  for (let i = 0; i < d.enemies - d.elites - d.veterans - d.bosses; i++) {
    queue.push("normal");
  }

  // Add elites
  for (let i = 0; i < d.elites; i++) {
    queue.push("elite");
  }

  // Add veterans
  for (let i = 0; i < d.veterans; i++) {
    queue.push("veteran");
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