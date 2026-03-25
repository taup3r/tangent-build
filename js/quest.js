import { player, loadProgress } from "./state.js";

loadProgress();

const playerQuests = `${player.name}_quests`;

export const questData = {
  "blacksmith": {
    title: "The Lost Hammer",
    type: "town",
    maxStage: 5, // set to 0 to turn off quest
    flow: [
      {
        npc: "Blacksmith Roran",
        message: "Adventurer! I’ve lost my hammer somewhere near the dungeon entrance. Without it, I can’t forge anything. Could you help me find it?",
        submit: "Accept Quest",
        cancel: "Ignore",
        nextChance: 10
      },{
        npc: "",
        message: "You found the Lost Hammer! Roran will be thrilled to see this.",
        submit: "Pick it up",
        cancel: "Leave it",
        nextChance: 100
      },{
        npc: "Blacksmith Roran",
        message: "You found it! I can finally get back to work. Let me repay you properly. I will let you know when I'm done.",
        submit: "Continue",
        nextChance: 30
      },{
        npc: "Blacksmith Roran",
        message: "Congratulations! Your weapon has been refined! Test it in the arena.",
        submit: "Compare",
        cancel: "Decline",
        nextChance: 100
      },{
        npc: "Blacksmith Roran",
        message: "Ha! I knew that refined weapon will serve you well. You've proven your strength, adventurer. From now on, my forge is open to you anytime.",
        submit: "Accept",
        nextChance: 10
      }
    ]
  },
  "merchantGuild": {
    title: "Merchant's Guild Problems",
    type: "town",
    maxStage: 9, // set to 0 to turn off quest
    flow: [
      {
        npc: "Selra, Merchant Guild Clerk",
        message: "You look like someone who gets things done. The Merchant Guild needs a reliable courier. Interested in earning some coin and reputation? Try and catch the Guild Captain in town as he roams on duty and deliver this sealed package.",
        submit: "Accept Sealed Package",
        cancel: "Ignore",
        nextChance: 10
      },
      {
        npc: "Guard Captain Thorne",
        message: "A delivery from the Merchant Guild? Hmph. They're late as usual. Hand it over.",
        submit: "Give Package",
        cancel: "Ignore",
        nextChance: 100
      },
      {
        npc: "Guard Captain Thorne",
        message: "Here, a small reward for your trouble. And tell Selra to send these on time.",
        submit: "Accept",
        nextChance: 80
      },
      {
        npc: "Selra, Merchant Guild Clerk",
        message: "Thank you. Although, the captain claims he never received the last shipment. Could you check the arena for anything unusual?",
        submit: "Agree",
        cancel: "Ignore",
        nextChance: 100
      },
      {
        npc: "",
        message: "Loosing the match, you went to the back door to sulk. You discover a smashed crate bearing the Merchant Guild seal. Someone has been stealing shipments and hiding them in the arena backdoor! Find the culprit.",
        submit: "Take clue",
        cancel: "Ignore it",
        nextChance: 100
      },
      {
        npc: "Guild Smuggler",
        message: "Huh, how did you find me? In any case, you should have never looked in the first place. You don't mess around with me.",
        submit: "Fight",
        nextChance: 100
      },
      {
        npc: "",
        message: "The smuggler drops a ledger detailing stolen merchant guild shipments. This is the proof Selra needs.",
        submit: "Take",
        nextChance: 100
      },
      {
        npc: "Selra, Merchant Guild Clerk",
        message: "This ledger... I knew something was wrong. You've done the guild a great service. Allow me to reward you properly.",
        submit: "Accept",
        nextChance: 100
      },
      {
        npc: "Selra, Merchant Guild Clerk",
        message: "The Merchant Guild Hall in town is now open for you. Expect better prices for goods and more opportunities to grow your reputation in the future.",
        submit: "Continue",
        nextChance: 100
      }
    ]
  },
  "arenaNormal": {
    title: "(Repeatable) Arena Normal",
    type: "repeatable",
    maxStage: 2,
    flow: [
      {
        npc: "Old man Calidore",
        message: "Defeat 3 normal enemies in the Arena",
        submit: "Accept",
        cancel: "Ignore",
        nextChance: 100
      }
    ]
  }
};

export const quests = [
  {
    id: "blacksmith",
    chance: 10,
    stage: 0, // 0 = not started
    active: false
  },
  {
    id: "merchantGuild",
    chance: 25,
    stage: 0,
    active: false
  },
  {
    id: "arenaNormal",
    chance: 100,
    stage: 0,
    active: false
  }
];

loadQuestState();

export function loadQuestState() {
  const saved = JSON.parse(localStorage.getItem(playerQuests) || "[]");
  if (saved.length > 0) {
    quests.forEach((q, i) => {
      quests[i] = { ...q, ...saved[i] };
    });
  }
}

export function saveQuestState() {
  localStorage.setItem(playerQuests, JSON.stringify(quests));
}

export function getQuest(id) {
  return quests.find(q => q.id === id);
}

export function triggerQuest(quest, action = null, isView = false) {
  const modal = document.getElementById("quest-modal");
  const questTitle = document.getElementById("questTitle");
  const npcName = document.getElementById("npcName");
  const npcText = document.getElementById("npcText");
  const npcButton = document.getElementById("npcButton");
  const ignoreButton = document.getElementById("ignoreButton");

  const currentQuest = questData[quest.id];
  let stage = quest.stage;
  if (isView === true) stage -= 1;
  const currentQuestStage = currentQuest.flow[stage];

  questTitle.textContent = currentQuest.title;
  npcName.textContent = currentQuestStage.npc;
  npcText.textContent = currentQuestStage.message;

  if (isView === true) {
    npcButton.textContent = "Close";
  } else {
    npcButton.textContent = currentQuestStage.submit;
  }

  if (isView === true) {
    ignoreButton.style.display = "none";
  } else if (currentQuestStage.cancel) {
    ignoreButton.textContent = currentQuestStage.cancel;
    ignoreButton.style.display = "flex";
  } else {
    ignoreButton.style.display = "none";
  }

  npcButton.onclick = () => {
    if (isView === false) {
      quest.stage += 1;
      quest.chance = currentQuestStage.nextChance;
      quest.active = true;
      saveQuestState();
    }

    modal.style.display = "none";
    if (action) action();
  };

  modal.style.display = "flex";
}

export function ignoreQuest(action = null) {
  document.getElementById("quest-modal").style.display = "none";
  if (action) action();
}

export function tryQuestEncounter(id, stage, action = null, ignoreAction = null) {
  const ignoreButton = document.getElementById("ignoreButton");
  if (ignoreButton) {
    ignoreButton.onclick = () => {
      ignoreQuest(ignoreAction);
    };
  }

  const quest = getQuest(id);

  // Only trigger if quest not started
  if (quest.stage === stage && Math.random() < (quest.chance/100) &&
quest.stage < questData[quest.id].maxStage) {
    triggerQuest(quest, action);
  } else {
    if (ignoreAction) ignoreAction();
  }
}

export function showQuestList()
{
  const container = document.getElementById("questListContainer");
  container.innerHTML = "";

  const activeQuests = quests.filter(q => q.active && q.stage < questData[q.id].maxStage);

  activeQuests.forEach(q => {
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