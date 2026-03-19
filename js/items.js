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

//todo
export function tryItemEncounter(id, action = null, ignoreAction = null) {
  const ignoreButton = document.getElementById("ignoreButton");
  if (ignoreButton) {
    ignoreButton.onclick = () => {
      ignoreItem(ignoreAction);
    };
  }

  const item = getItem(id);
  //todo fix here

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

  items.forEach(q => {
    const btn = document.createElement("button");
    btn.classList.add("quest-entry-btn");
    btn.textContent = questData[q.id].title;

    btn.onclick = () => {
      triggerQuest(q, null, true);
    };

    container.appendChild(btn);
  });

  const doneContainer = document.getElementById("questListDoneContainer");
  doneContainer.innerHTML = "";

  const completedQuests = quests.filter(q => q.active && q.stage === questData[q.id].maxStage);

  completedQuests.forEach(q => {
    const btn = document.createElement("button");
    btn.classList.add("quest-entry-btn");
    btn.textContent = questData[q.id].title;

    btn.onclick = () => {
      triggerQuest(q, null, true);
    };

    doneContainer.appendChild(btn);
  });

  document.getElementById("questListCloseBtn").onclick = () => {
    document.getElementById("quest-list-modal").style.display = "none";
};

  document.getElementById("quest-list-modal").style.display = "flex";
}