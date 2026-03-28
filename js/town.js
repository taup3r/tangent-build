import { player, playerStats, setDungeonMode, startDungeon, loadProgress, saveProgress } from "./state.js";
import { getRandomDungeonType } from "./dungeon.js";
import { updateHeaderStats } from "./ui.js";
import { tryQuestEncounter, loadQuestState, showQuestList, getQuest, questData } from "./quest.js";
import { showItemList } from "./items.js";
import { openCompareWeapon } from "./modal.js";
import { upgradeWeapon } from "./weapon.js";
import { showStatsModal } from "./stats.js";

const randomArea = document.getElementById("randomArea");
const exploreBtn = document.getElementById("exploreBtn");
const loreText = document.getElementById("loreText");
const questButton = document.getElementById("questButton");
const itemButton = document.getElementById("itemButton");

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

function getResidentialZone() {
  randomArea.innerHTML = "";
  const buttons = [
    {
      label: "Yellow House",
      class: "btn-shop",
      action: () => showStatsModal(),
      disabled: false
    },
    {
      label: "Red Mansion",
      class: "btn-arena",
      action: () => showStatsModal(),
      disabled: false
    },
    {
      label: "Blue Pad",
      class: "btn-dungeon",
      action: () => showStatsModal(),
      disabled: false
    },
    {
      label: "Green Cottage",
      class: "btn-shop",
      action: () => showStatsModal(),
      disabled: false
    },
    {
      label: "Purple Cove",
      class: "btn-blacksmith",
      action: () => showStatsModal(),
      disabled: false
    },
    {
      label: "Orange Hub",
      class: "btn-merchant-guild",
      action: () => showStatsModal(),
      disabled: false
    }
  ];

  return buttons;
}

function getTownSquareZone() {
  randomArea.innerHTML = "";
  const dungeonType = getRandomDungeonType();

  const buttons = [
    {
      label: "Train Stats",
      class: "btn-train",
      action: () => showStatsModal(),
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

  loadQuestState();
  const blacksmithQuest = getQuest("blacksmith");
  const merchantGuildQuest = getQuest("merchantGuild");

  if (blacksmithQuest && blacksmithQuest.stage >= questData["blacksmith"].maxStage) {
    buttons.push({
      label: "Blacksmith's Forge",
      class: "btn-blacksmith",
      action: () => {
        window.location.href = `blacksmith.html?player=${encodeURIComponent(player.name)}`;
      },
      disabled: false
    });
  }
  if (merchantGuildQuest && merchantGuildQuest.stage >= questData["merchantGuild"].maxStage) {
    buttons.push({
      label: "Merchant Guild",
      class: "btn-merchant-guild",
      action: () => {
        window.location.href = `merchantguild.html?player=${encodeURIComponent(player.name)}`;
      },
      disabled: false
    });
  }

  return buttons;
}

function generateTownLayout() {
  let buttons = [];
  const zone = Math.Random();
  if (zone < 0.20) {
    buttons = getResidentialZone();
  } else {
    buttons = getTownSquareZone();
  }

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

function questEncounters() {
  loadProgress();
  loadQuestState();
  tryQuestEncounter("blacksmith", 0);
  tryQuestEncounter("blacksmith", 2);
  tryQuestEncounter("blacksmith", 3, () => {
    const weapon = upgradeWeapon(player.weapon, 1);
    openCompareWeapon(weapon, "Equip", () => player.weapon = weapon);
  });
  tryQuestEncounter("merchantGuild", 1, () => {
    playerStats.gold += 20;
    playerStats.reputation = (playerStats.reputation || 0) + 1;
    saveProgress();

    tryQuestEncounter("merchantGuild", 2);
  });
}

function explore() {

  randomArea.classList.remove("travel-in");
  randomArea.classList.add("travel-out");

  // After animation ends, regenerate and animate in
  setTimeout(() => {
    loadProgress();
    updateHeaderStats();
    generateTownLayout();
    questEncounters();
    randomArea.classList.remove("travel-out");
    randomArea.classList.add("travel-in");
  }, 300);
}

// Button events
exploreBtn.onclick = () => explore();
questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

// Main
loadProgress();
updateHeaderStats();
generateTownLayout();
questEncounters();


