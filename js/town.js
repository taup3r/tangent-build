import { player, playerStats, setDungeonMode, startDungeon, loadProgress } from "./state.js";
import { getRandomDungeonType } from "./dungeon.js";
import { updateHeaderStats } from "./ui.js";
import { loadQuestState, getQuest, triggerQuest } from "./quest.js";

// Phase 1: Simple navigation + dungeon start

loadProgress();
updateHeaderStats();
loadQuestState();

const randomArea = document.getElementById("randomArea");
const exploreBtn = document.getElementById("exploreBtn");
const loreText = document.getElementById("loreText");

const loreSnippets = [
  "You wandered through the quiet market streets.",
  "A stray cat followed you for a few steps before losing interest.",
  "You overheard adventurers arguing about treasure in the hills.",
  "A cool breeze carried the scent of pine and distant rain.",
  "You spotted a merchant packing up mysterious crates.",
  "A guard nodded at you, recognizing your growing reputation.",
  "You found a strange footprint near the town gate.",
  "A child pointed at you excitedly, whispering about heroes."
];

function resetLoreAnimation() {
  const animation = loreText.style.animation;
  loreText.style.animation = "none";
  void loreText.offsetWidth;
  loreText.style.animation = animation;
}

function generateTownLayout() {
  randomArea.innerHTML = "";
  const dungeonType = getRandomDungeonType();

  const buttons = [
    {
      label: "Train Stats",
      class: "btn-train",
      action: () => openStatModal(),
      disabled: playerStats.statPoints <= 0
    },
    {
      label: "Fight in Arena",
      class: "btn-arena",
      action: () => {
        // Normal single battle
        window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
      },
      disabled: false
    },
    {
      label: `Enter ${dungeonType.name}`,
      class: "btn-dungeon",
      action: () => {
        // Start dungeon
        setDungeonMode(true);
        startDungeon(dungeonType.type);

        window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
      },
      disabled: false
    },
    {
      label: "Weapon Shop",
      class: "btn-shop",
      action: () => window.location.href = `weaponshop.html?player=${encodeURIComponent(player.name)}`,
      disabled: false
    }
  ];

  // Randomly decide how many buttons appear (1–4)
  const count = Math.floor(Math.random() * 4) + 1;

  // Shuffle buttons
  const shuffled = [...buttons].sort(() => Math.random() - 0.5);

  // Take the first N
  const chosen = shuffled.slice(0, count);

  // Render them
  chosen.forEach(btn => {
    const el = document.createElement("button");
    el.classList.add("town-btn", btn.class);
    el.textContent = btn.label;
    el.disabled = btn.disabled;

    if (!btn.disabled) {
      el.onclick = btn.action;
    }

    randomArea.appendChild(el);
  });

  // Update scrolling lore text
  const lore = loreSnippets[Math.floor(Math.random() * loreSnippets.length)];
  loreText.textContent = lore;
  resetLoreAnimation();
}

// Initial generation
generateTownLayout();
tryQuestEncounter();

// Explore → travel
exploreBtn.onclick = () => {
  // Animate old content out
  randomArea.classList.remove("travel-in");
  randomArea.classList.add("travel-out");

  // After animation ends, regenerate and animate in
  setTimeout(() => {
    generateTownLayout();
    tryQuestEncounter();
    randomArea.classList.remove("travel-out");
    randomArea.classList.add("travel-in");
  }, 300);
};

/* -------------------------
   STAT MENU
------------------------- */

function openStatModal() {
  const modal = document.getElementById("statModal");
  const frame = document.getElementById("statsFrame");

  frame.src = `stats.html?player=${encodeURIComponent(player.name)}`;
  modal.style.display = "flex";
}

function closeStatModal() {
  document.getElementById("statModal").style.display = "none";
}

window.addEventListener("message", (event) => {
  if (event.data === "close-stats") {
    closeStatModal();
  }
});


/* QUESTS */

function tryQuestEncounter() {
  const blacksmith = getQuest("blacksmith");

  // Only trigger if quest not started
  if (blacksmith.stage === 0 && Math.random() < (blacksmit.chance/100)) {
    triggerQuest(blacksmith);
  }
}