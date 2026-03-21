import { player, playerStats, loadProgress, saveProgress } from "./state.js";

loadProgress();

export const itemData = {
  "ore-w": {
    name: "Common Ore",
    chance: 10,
    maxCount: 99,
    use: 1000,
    minRank: 1,
    maxRank: 10,
    lore: "Common ore found on the most basic dungeons."
  }
};

export const items = [
  {
    id: "ore-w",
    count: 0
  }
];

loadItems();

export function loadItems() {
  const saved = playerStats.items || "[]";
  if (saved.length > 0) {
    items.forEach((q, i) => {
      items[i] = { ...q, ...saved[i] };
    });
  }
}

export function getColorByRank(rank) {
  if (rank <= 10) return { tier: "Common", color: "#C0C0C0" };
  if (rank <= 20) return { tier: "Uncommon", color: "#4CAF50" };
  if (rank <= 30) return { tier: "Rare", color: "#2196F3" };
  if (rank <= 40) return { tier: "Epic", color: "#9C27B0" };
  if (rank <= 50) return { tier: "Legendary", color: "#FF9800" };
  return { tier: "Mythic", color: "#FF0000" };
}

export function getItem(id) {
  return items.find(q => q.id === id);
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
    acceptButton.textContent = "Pick up";
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

export function tryItemEncounter(id, alwaysAction = null, acceptAction = null, ignoreAction = null) {
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
    triggerItem(item, acceptAction || alwaysAction);
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