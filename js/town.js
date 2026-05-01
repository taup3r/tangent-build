import { player, playerStats, setDungeonMode, startDungeon, loadProgress, saveProgress, setEnemyType } from "./state.js";
import { hasSkill } from "./skills.js";
import { getRandomDungeonType } from "./dungeon.js";
import { updateHeaderStats } from "./ui.js";
import { tryQuestEncounter, loadQuestState, showQuestList, getQuest, questData, triggerQuest, questCompleted, checkQuest, getMessage } from "./quest.js";
import { showItemList } from "./items.js";
import { openCompareWeapon } from "./modal.js";
import { upgradeWeapon } from "./weapon.js";
import { showStatsModal } from "./stats.js";
import { clampReputation } from "./reputation.js";

const randomArea = document.getElementById("randomArea");
const exploreBtn = document.getElementById("exploreBtn");
const loreText = document.getElementById("loreText");
const questButton = document.getElementById("questButton");
const itemButton = document.getElementById("itemButton");
const zoneName = document.getElementById("zoneName");

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

function getAlleyZone() {
  randomArea.innerHTML = "";
  const buttons = [
    {
      label: "Item Shop",
      class: "btn-shop",
      action: () => window.location.href = `itemshop.html?player=${encodeURIComponent(player.name)}`,
      disabled: false
    },
    {
      label: "Abandoned Shack",
      class: "btn-arena",
      action: () => {
        tryQuestEncounter("smuggler", 3, () => {
          if (Math.random() < 0.15) {
            tryQuestEncounter("smuggler", 4);
          } else {
            getMessage("e4", () => {
              playerStats.combatEncounter = true;
              saveProgress();
              window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
            });
          }
        }, () => getMessage("h7"));
      },
      disabled: false
    },
    {
      label: "Great Wall",
      class: "btn-dungeon",
      action: () => getMessage("e1", () => {
        if (playerStats.reputation >= 10) {
          playerStats.reputation -= 10;
        } else {
          playerStats.reputation = 0;
        }
        if (playerStats.gold >= 100) {
          playerStats.gold -= 100;
        } else {
          playerStats.gold = 0;
        }
        saveProgress();
      }),
      disabled: false
    },
    {
      label: "Go back to Village",
      class: "btn-zone",
      action: () => {
        playerStats.zone = "residential";
        saveProgress();
        location.reload();
      },
      disabled: false
    }
  ];

  const isTreasure = (Math.random() < 0.05);
  if (isTreasure) {
    buttons.push({
      label: "Treasure Chest",
      class: "btn-train",
      action: () => getMessage("e3", () => {
        const weapon = upgradeWeapon(player.weapon, 1);
        openCompareWeapon(weapon, "Equip", () => {
          player.weapon = weapon;
          saveProgress();
          location.reload();
        });
      }),
      disabled: false
    });
  } else {
    buttons.push({
      label: "Treasure Chest",
      class: "btn-train",
      action: () => getMessage("e2", () => {
        playerStats.combatEncounter = true;
        saveProgress();
        window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
      }),
      disabled: false
    });
  }

  if (questCompleted("smuggler")) {
    buttons.push({
      label: "Crafting Workshop",
      class: "btn-blacksmith",
      action: () => window.location.href = `workshop.html?player=${encodeURIComponent(player.name)}`,
      disabled: false
    });
  }

  zoneName.textContent = "Wayfarer's Edge";
  return buttons;
}

function getResidentialZone() {
  randomArea.innerHTML = "";
  const buttons = [
    {
      label: "Hearthwhistle Cottage",
      class: "btn-shop",
      action: () => {
        const quest = getQuest("lostChild");
        if (quest.stage < questData["lostChild"].maxStage) {
          getMessage("h7");
        } else {
          getMessage("h4");
        }
      },
      disabled: false
    },
    {
      label: "Thistledown Rest",
      class: "btn-arena",
      action: () => getMessage("h1", () => {
        if (!hasSkill("bthrust")) {
          getMessage("s1", () => {
            playerStats.combatEncounter = true;
            saveProgress();
            setEnemyType("bthrust");
            window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
          });
        }
      }),
      disabled: false
    },
    {
      label: "Mosslight Cabin",
      class: "btn-train",
      action: () => {
        const quest = getQuest("lostChild");
        if (quest.stage < questData["lostChild"].maxStage) {
          getMessage("h7", () => tryQuestEncounter("lostChild", 2));
        } else {
          getMessage("h6");
        }
      },
      disabled: false
    },
    {
      label: "Bramblegate Lodge",
      class: "btn-merchant-guild",
      action: () => {
        const quest = getQuest("lostChild");
        if (quest.stage < questData["lostChild"].maxStage) {
          getMessage("h7", () => tryQuestEncounter("lostChild", 4, () => {
            playerStats.combatEncounter = true;
            saveProgress();
            window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
          }));
        } else {
          getMessage("h5");
        }
      },
      disabled: false
    },
    {
      label: "Oakroot Dwelling",
      class: "btn-blacksmith",
      action: () => getMessage("h2", () => {
        if (!hasSkill("bstrike")) {
          getMessage("s2", () => {
            playerStats.combatEncounter = true;
            saveProgress();
            setEnemyType("bstrike");
            window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
          });
        }
      }),
      disabled: false
    },
    {
      label: "Go to Town Square",
      class: "btn-zone",
      action: () => {
        playerStats.zone = "townSquare";
        saveProgress();
        location.reload();
      },
      disabled: false
    },
    {
      label: "Go to the Back Alleys",
      class: "btn-zone",
      action: () => {
        playerStats.zone = "backAlley";
        saveProgress();
        location.reload();
      },
      disabled: false
    }
  ];

  checkQuest("smuggler", 5, () => {
    buttons.push({
      label: "Enter Smuggler Hideout",
      class: "btn-dungeon",
      action: () => {
        // Start dungeon
        setDungeonMode(true);
        startDungeon("smuggler");
        window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
      },
      disabled: false
    });
  }, () => {
    buttons.push({
      label: "Willowbend Homestead",
      class: "btn-dungeon",
      action: () => getMessage("h3", () => {
        if (!hasSkill("lriposte")) {
          getMessage("s3", () => {
            playerStats.combatEncounter = true;
            saveProgress();
            setEnemyType("lriposte");
            window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
          });
        }
      }),
      disabled: false
    });
  });

  zoneName.textContent = "Wayfarer's Keep";
  return buttons;
}

function getOutskirtsZone() {
  randomArea.innerHTML = "";
  const buttons = [
    {
      label: "Old Watchtower",
      class: "btn-shop",
      action: () => getMessage("h8"),
      disabled: false
    },
    {
      label: "Ruined Chapel",
      class: "btn-dungeon",
      action: () => {
        // Start dungeon
        setDungeonMode(true);
        startDungeon("chapel");
        window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
      },
      disabled: false
    },
    {
      label: "Underground Cave",
      class: "btn-blacksmith",
      action: () => getMessage("h9"),
      disabled: false
    },
    {
      label: "Go to Town Square",
      class: "btn-zone",
      action: () => {
        playerStats.zone = "townSquare";
        saveProgress();
        location.reload();
      },
      disabled: false
    }
  ];

  const isTreasure = (Math.random() < 0.05);
  if (isTreasure) {
    buttons.push({
      label: "Treasure Chest",
      class: "btn-train",
      action: () => getMessage("e3", () => {
        const weapon = upgradeWeapon(player.weapon, 1);
        openCompareWeapon(weapon, "Equip", () => {
          player.weapon = weapon;
          saveProgress();
          location.reload();
        });
      }),
      disabled: false
    });
  } else {
    buttons.push({
      label: "Treasure Chest",
      class: "btn-train",
      action: () => getMessage("e2", () => {
        playerStats.combatEncounter = true;
        saveProgress();
        window.location.href = `combat.html?player=${encodeURIComponent(player.name)}`;
      }),
      disabled: false
    });
  }

  zoneName.textContent = "Wayfarer's Crest";
  return buttons;
}

function getTownSquareZone() {
  randomArea.innerHTML = "";
  const dungeonType = getRandomDungeonType();

  const buttons = [
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

  if (playerStats.statPoints <= 0) {
    buttons.push({
      label: "Guard Post",
      class: "btn-train",
      action: () => tryQuestEncounter("smuggler", 6, null, () => tryQuestEncounter("smuggler", 1, null, () => getMessage("t1"))),
      disabled: false
    });
  } else {
    buttons.push({
      label: "Train Stats",
      class: "btn-train",
      action: () => showStatsModal(),
      disabled: false
    });
  }

  let blacksmithDone = false;
  let merchantGuildDone = false;

  if (questCompleted("smuggler")) {
    buttons.push({
      label: "Go to Outskirts",
      class: "btn-zone",
      action: () => {
        playerStats.zone = "outskirts";
        saveProgress();
        location.reload();
      },
      disabled: false
    });
  }

  if (questCompleted("blacksmith")) {
    buttons.push({
      label: "Blacksmith's Forge",
      class: "btn-blacksmith",
      action: () => {
        window.location.href = `blacksmith.html?player=${encodeURIComponent(player.name)}`;
      },
      disabled: false
    });
    blacksmithDone = true;
  }
  if (questCompleted("merchantGuild")) {
    buttons.push({
      label: "Merchant Guild",
      class: "btn-merchant-guild",
      action: () => {
        window.location.href = `merchantguild.html?player=${encodeURIComponent(player.name)}`;
      },
      disabled: false
    });
    merchantGuildDone = true;
  }

  if (blacksmithDone === true && merchantGuildDone === true) {
    buttons.push({
      label: "Go to the Village",
      class: "btn-zone",
      action: () => {
        playerStats.zone = "residential";
        saveProgress();
        location.reload();
      },
      disabled: false
    });
  }

  zoneName.textContent = "Wayfarer's Rest";
  return buttons;
}

function generateTownLayout() {
  let buttons;
  const zone = playerStats.zone;
  if (zone === "residential") {
    buttons = getResidentialZone();
  } else if (zone === "backAlley") {
    buttons = getAlleyZone();
  } else if (zone === "outskirts") {
    buttons = getOutskirtsZone();
  } else {
    buttons = getTownSquareZone();
  }

  // Randomly decide how many buttons appear (1–4)
  const count = Math.floor(Math.random() * 3) + 2;

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
  //reset combat encounter
  playerStats.combatEncounter = false;
  saveProgress();

  tryQuestEncounter("blacksmith", 0);
  tryQuestEncounter("blacksmith", 2);
  tryQuestEncounter("blacksmith", 3, () => {
    const weapon = upgradeWeapon(player.weapon, 1);
    openCompareWeapon(weapon, "Equip", () => player.weapon = weapon);
  });
  tryQuestEncounter("merchantGuild", 1, () => {
    playerStats.gold += 20;
    playerStats.reputation = (playerStats.reputation || 0) + 1;
    clampReputation();
    saveProgress();

    tryQuestEncounter("merchantGuild", 2);
  });
  tryQuestEncounter("lostChild", 0);
  tryQuestEncounter("lostChild", 1);
  tryQuestEncounter("lostChild", 3);
  tryQuestEncounter("lostChild", 6, () => {
    playerStats.gold += 100;
    playerStats.reputation += 5;
    clampReputation();
    saveProgress();
  });
  tryQuestEncounter("smuggler", 0, null, null, questCompleted("lostChild"));
  tryQuestEncounter("smuggler", 2);
}

function explore() {

  randomArea.classList.remove("travel-in");
  randomArea.classList.add("travel-out");

  // After animation ends, regenerate and animate in
  setTimeout(() => {
    loadProgress();
    loadQuestState();
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
loadQuestState();
updateHeaderStats();
generateTownLayout();
questEncounters();


