import { player, playerStats, setDungeonMode, startDungeon, loadProgress } from "./state.js";

// Phase 1: Simple navigation + dungeon start

loadProgress();

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
  loreText.style.animation = "none";
  void loreText.offsetWidth;
  loreText.style.animation = "scrollText 12s linear infinite";
}

function generateTownLayout() {
  randomArea.innerHTML = "";

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
      label: "Enter Dungeon",
      class: "btn-dungeon",
      action: () => {
        // Start dungeon mode with 8 enemies
        setDungeonMode(true);
        startDungeon(getDifficulty());

        window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
      },
      disabled: false
    }
  ];

  // Randomly decide how many buttons appear (0–3)
  const count = Math.floor(Math.random() * 4);

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

// Explore → reshuffle
exploreBtn.onclick = generateTownLayout;

function getDifficulty() {
  const roll = Math.random();
  if (roll < 0.30) return "normal";
  if (roll < 0.60) return "hard";
  return "nightmare";
}

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