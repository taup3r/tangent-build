import { player, playerStats, loadProgress } from "./state.js";

loadProgress();

export const itemData = {
  "ore-w": {
    name: "White Ore",
    chance: 10,
    maxCount: 99,
    lore: "Common ore found on the most basic dungeons."
  }
};

export function getItem(id) {
  return playerStats.items.find(q => q.id === id);
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
      item.count = (item.count || 0) + 1;
      //todo: save to progress
    }

    modal.style.display = "none";
    if (action) action();
  };

  modal.style.display = "flex";
}

export function ignoreItem(action = null) {
  document.getElementById("item-modal").style.display = "none";
  if (action) action();
}

export function tryItemEncounter(id, action = null, ignoreAction = null) {
  const ignoreButton = document.getElementById("ignoreButton");
  if (ignoreButton) {
    ignoreButton.onclick = () => {
      ignoreItem(ignoreAction);
    };
  }

  const item = getItem(id);
  if (!item) {
    item = {
      id,
      count: 0
    }
  }

  if (Math.random() < (itemData[item.id].chance/100) &&
(item.count + 1) < itemData[item.id].maxCount) {
    triggerItem(item, action);
  } else {
    if (ignoreAction) ignoreAction();
  }
}

export function showItemList()
{
  const container = document.getElementById("itemListContainer");
  container.innerHTML = "";

  playerStats.items.forEach(i => {
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