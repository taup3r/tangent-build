import { player, playerStats, loadProgress, saveProgress } from "./state.js";

loadProgress();

export const oreData = {
  "ore-w": {
    next: "ore-g",
    group: 12,
    tier: 1
  },
  "ore-g": {
    next: "ore-b",
    group: 10,
    tier: 2
  },
  "ore-b": {
    next: "ore-p",
    group: 8,
    tier: 3
  },
  "ore-p": {
    next: "ore-o",
    group: 6,
    tier: 4
  },
  "ore-o": {
    next: "ore-r",
    group: 4,
    tier: 5
  }
}

export const itemData = {
  "ore-w": {
    name: "White Ore",
    chance: 12,
    maxCount: 99,
    type: "ore",
    use: 1000,
    rarity: "Common",
    lore: "Common ore found on the most basic dungeons."
  },
  "ore-g": {
    name: "Green Ore",
    chance: 10,
    maxCount: 99,
    type: "ore",
    use: 2000,
    rarity: "Uncommon",
    lore: "Uncommon ore found on dungeons."
  },
  "ore-b": {
    name: "Blue Ore",
    chance: 8,
    maxCount: 99,
    type: "ore",
    use: 3000,
    rarity: "Rare",
    lore: "Rare ore used for powerful weapon refinements."
  },
  "ore-p": {
    name: "Purple Ore",
    chance: 6,
    maxCount: 99,
    type: "ore",
    use: 4000,
    rarity: "Epic",
    lore: "Very rare ore used to refine already powerful weapons."
  },
  "ore-o": {
    name: "Orange Ore",
    chance: 4,
    maxCount: 99,
    type: "ore",
    use: 5000,
    rarity: "Legendary",
    lore: "One-of-a-kind ore found in deep treacherous dungeons."
  },
  "ore-r": {
    name: "Red Ore",
    chance: 2,
    maxCount: 99,
    type: "ore",
    use: 8000,
    rarity: "Mythic",
    lore: "Mythical ores rumored by blacksmiths as 'the Ones'."
  },
  "ironbarkWood": {
    name: "Ironbark Wood",
    chance: 100,
    maxCount: 99,
    type: "craft",
    use: 10,
    rarity: "Common",
    lore: "Dense, fire-resistant wood used for sturdy handles and bows."
  },
  "bindingTwine": {
    name: "Binding Twine",
    chance: 100,
    maxCount: 99,
    type: "craft",
    use: 20,
    rarity: "Common",
    lore: "Simple but essential for assembling gear."
  },
  "polishedRivets": {
    name: "Polished Rivets",
    chance: 100,
    maxCount: 99,
    type: "craft",
    use: 30,
    rarity: "Common",
    lore: "Reinforcement components for weapons and tools."
  }
};

export const items = [
  {
    id: "ore-w",
    count: 0
  },
  {
    id: "ore-g",
    count: 0
  },
  {
    id: "ore-b",
    count: 0
  },
  {
    id: "ore-p",
    count: 0
  },
  {
    id: "ore-o",
    count: 0
  },
  {
    id: "ore-r",
    count: 0
  },
  {
    id: "ironbarkWood",
    count: 0
  },
  {
    id: "bindingTwine",
    count: 0
  },
  {
    id: "polishedRivets",
    count: 0
  }
];

loadItems();

export function loadItems() {
  const saved = playerStats.items || "[]";

  items.forEach((q, i) => {
    // If saved[i] exists, merge it; otherwise keep original quest data
    if (saved[i] && saved[i].id === q.id) {
      items[i] = { ...q, ...saved[i] };
    } else {
      items[i] = { ...q }; // ensure fresh copy, not reference
    }
  });
}

export function getColorByRarity(rarity) {
  switch (rarity) {
    case "Common":
      return "#C0C0C0";
    case "Uncommon":
      return "#4CAF50";
    case "Rare":
      return "#2196F3";
    case "Epic":
      return "#9C27B0";
    case "Legendary":
      return "#FF9800";
    default:
      return "#FF0000";
  }
}

export function getNameByRarity(rarity) {
  switch (rarity) {
    case "Common":
      return "ore-w";
    case "Uncommon":
      return "ore-g";
    case "Rare":
      return "ore-b";
    case "Epic":
      return "ore-p";
    case "Legendary":
      return "ore-o";
    default:
      return "ore-r";
  }
}

export function getItem(id) {
  return items.find(q => q.id === id);
}

export function getItems(type) {
  const itemList = [];
  items.forEach((q, i) => {
    if (itemData[q.id].type === type) {
      itemList.push(q);
    }
  });
  return itemList;
}

export function triggerItem(item, action = null, isView = false) {
  const modal = document.getElementById("item-modal");
  const itemName = document.getElementById("itemName");
  const itemLore = document.getElementById("itemLore");
  const acceptButton = document.getElementById("acceptButton");
  const ignoreButton = document.getElementById("ignoreButton");

  const currentItem = itemData[item.id];

  itemName.textContent = currentItem.name;
  itemLore.textContent = currentItem.lore;

  if (isView === true) {
    acceptButton.textContent = "Close";
  } else {
    acceptButton.textContent = label;
  }

  if (isView === true) {
    ignoreButton.style.display = "none";
  } else {
    ignoreButton.textContent = "Ignore";
    ignoreButton.style.display = "flex";
  }

  acceptButton.onclick = () => {
    if (isView === false) {
      item.count += 1;
      saveItems();
    }

    modal.style.display = "none";
    if (action) action();
  };

  modal.style.display = "flex";
}

export function saveItems() {
  playerStats.items = items;
  saveProgress();
}

export function ignoreItem(action = null) {
  document.getElementById("item-modal").style.display = "none";
  if (action) action();
}

export function tryItemEncounter(id, alwaysAction = null, acceptAction = null, ignoreAction = null, label = "Pick up") {
  const ignoreButton = document.getElementById("ignoreButton");
  if (ignoreButton) {
    ignoreButton.onclick = () => {
      ignoreItem(ignoreAction || alwaysAction);
    };
  }

  let item = getItem(id);
  if (!item) {
    item = {
      id,
      count: 0
    };
    items.push(item);
  }

  if (Math.random() < (itemData[item.id].chance/100) &&
(item.count + 1) < itemData[item.id].maxCount) {
    triggerItem(item, acceptAction || alwaysAction, false, label);
  } else {
    if (ignoreAction) {
      ignoreAction();
    } else if (alwaysAction) {
      alwaysAction();
    }
  }
}

export function showItemList()
{
  const container = document.getElementById("itemListContainer");
  container.innerHTML = "";

  const availItems = items.filter(i => i.count > 0);

  availItems.forEach(i => {
    const btn = document.createElement("button");
    btn.classList.add("item-entry-btn");
    btn.textContent = itemData[i.id].name + " (" + i.count + ")";

    btn.onclick = () => {
      triggerItem(i, null, true);
    };

    container.appendChild(btn);
  });

  document.getElementById("itemListCloseBtn").onclick = () => {
    document.getElementById("item-list-modal").style.display = "none";
};

  document.getElementById("item-list-modal").style.display = "flex";
}