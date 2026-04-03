import { player, playerStats, loadProgress } from "./state.js";

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
  "lostChild": {
    title: "The Lost Child",
    type: "residential",
    maxStage: 7,
    flow: [
      {
        npc: "Concerned Mother",
        message: "Have you seen my son? He hasn't come home since yesterday...",
        submit: "Offer Help",
        cancel: "Ignore",
        nextChance: 25
      },
      {
        npc: "",
        message: "You found small footprints towards the the different houses. The kid must be playing around somewhere.",
        submit: "Investigate",
        nextChance: 50
      },
      {
        npc: "",
        message: "A hooded figure flees as you are looking around the boxes.",
        submit: "Leave",
        nextChance: 10
      },
      {
        npc: "",
        message: "Looking through posters throughout the village you found a note: 'Bring the boy to the abandoned house'.",
        submit: "Continue",
        cancel: "Ignore",
        nextChance: 100
      },
      {
        npc: "",
        message: "As you searched around the house you found the missing boy tied up inside. A hooded figure is guarding him. Time to fight.",
        submit: "Fight",
        cancel: "Escape",
        nextChance: 100
      },
      {
        npc: "Lost Child",
        message: "Thank you kind sir. I was just playing outside the village when that hooded man took me. Can you take me home now please.",
        submit: "Finish",
        nextChance: 100
      },
      {
        npc: "Thankful Mother",
        message: "Thank you so much for finding and saving my son. I don't know what I'd do without your help. Please accept this small token of appreciation.",
        submit: "Accept",
        nextChance: 10
      }
    ]
  },
  "arenaNormal": {
    title: "Test your Mettle I",
    type: "repeatable",
    maxStage: 2,
    maxCount: 3,
    flow: [
      {
        npc: "Old man Calidore",
        message: "Good day recruit. Could you defeat 3 normal enemies in the Arena for me, this will promote my business well.",
        submit: "Accept",
        cancel: "Ignore",
        nextChance: 100
      },
      {
        npc: "Old man Calidore",
        message: "That is swift work! I've sent your reward through the merchant guild. Thanks again!",
        submit: "Accept",
        nextChance: 100
      }
    ]
  },
  "arenaElite": {
    title: "Test your Mettle II",
    type: "repeatable",
    maxStage: 2,
    maxCount: 3,
    flow: [
      {
        npc: "Old man Calidore",
        message: "Good day recruit. Looks like you know how to use that weapon. Could you defeat 3 elite enemies in the Arena for me, they are becoming more aggressive to newbies.",
        submit: "Accept",
        cancel: "Ignore",
        nextChance: 100
      },
      {
        npc: "Old man Calidore",
        message: "That is very fine work! I've sent your reward through the merchant guild. Thanks again!",
        submit: "Accept",
        nextChance: 100
      }
    ]
  },
  "h1": {
    title: "",
    type: "chat",
    maxStage: 1,
    flow: [
      {
        npc: "Selra, Merchant Guild Clerk",
        message: "Welcome, friend. Not many wander this far unless they’re lost or looking for something. Either way, you’re safe under this roof. Sit a spell and tell me what brings you.",
        submit: "Goodbye",
        nextChance: 100
      }
    ]
  },
  "h2": {
    title: "",
    type: "chat",
    maxStage: 1,
    flow: [
      {
        npc: "Old man Calidore",
        message: "You’ve the look of someone who’s walked a long road. Oakroot’s old, but she’s sturdy. Rest your boots, and I’ll fetch something warm to drink.",
        submit: "Goodbye",
        nextChance: 100
      }
    ]
  },
  "h3": {
    title: "",
    type: "chat",
    maxStage: 1,
    flow: [
      {
        npc: "Guard Captain Thorne",
        message: "The wind’s been restless today. When it carries a stranger to my door, I take it as a sign. Tell me your name, traveler — and whether trouble follows behind you.",
        nextChance: 100
      }
    ]
  },
  "h4": {
    title: "",
    type: "chat",
    maxStage: 1,
    flow: [
      {
        npc: "Blacksmith Roran",
        message: "Mind the kettle, it’s just about to sing. Oh! A visitor. Come warm your hands by the fire.",
        nextChance: 100
      }
    ]
  },
  "h5": {
    title: "",
    type: "chat",
    maxStage: 1,
    flow: [
      {
        npc: "Gardener Sheena",
        message: "Careful of the brambles — they’ve a mind of their own. Welcome, traveler. The stew’s simple, but it fills the bones.",
        nextChance: 100
      }
    ]
  },
  "h6": {
    title: "",
    type: "chat",
    maxStage: 1,
    flow: [
      {
        npc: "Trey Loudcry",
        message: "Don’t mind the moss — it grows where it pleases. Ah, someone new. Haven’t had company since the last thaw.",
        nextChance: 100
      }
    ]
  },
  "h7": {
    title: "",
    type: "chat",
    maxStage: 1,
    flow: [
      {
        npc: "",
        message: "The place is empty and you can see boxes stacked on one side of the house. There seems to be nobody here.",
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
    zone: "townSquare",
    active: false
  },
  {
    id: "merchantGuild",
    chance: 25,
    stage: 0,
    zone: "townSquare",
    active: false
  },
  {
    id: "arenaNormal",
    chance: 100,
    stage: 0,
    zone: "townSquare",
    count: 0,
    active: false
  },
  {
    id: "arenaElite",
    chance: 100,
    stage: 0,
    zone: "townSquare",
    count: 0,
    active: false
  },
  {
    id: "h1",
    chance: 100,
    stage: 1, // starts at 1 for view
    active: false
  },
  {
    id: "h2",
    chance: 100,
    stage: 1, // starts at 1 for view
    active: false
  },
  {
    id: "h3",
    chance: 100,
    stage: 1, // starts at 1 for view
    active: false
  },
  {
    id: "h4",
    chance: 100,
    stage: 1, // starts at 1 for view
    active: false
  },
  {
    id: "h5",
    chance: 100,
    stage: 1, // starts at 1 for view
    active: false
  },
  {
    id: "h6",
    chance: 100,
    stage: 1, // starts at 1 for view
    active: false
  },
  {
    id: "h7",
    chance: 100,
    stage: 1, // starts at 1 for view
    active: false
  },
  {
    id: "lostChild",
    chance: 10,
    stage: 0,
    zone: "residential",
    active: false
  }
];

loadQuestState();

/*
export function loadQuestState() {
  const saved = JSON.parse(localStorage.getItem(playerQuests) || "[]");
  if (saved.length > 0) {
    quests.forEach((q, i) => {
      quests[i] = { ...q, ...(saved[i] || q) };
    });
  }
  //alert(JSON.stringify(quests));
}
*/

export function loadQuestState() {
  const saved = JSON.parse(localStorage.getItem(playerQuests) || "[]");

  quests.forEach((q, i) => {
    // If saved[i] exists, merge it; otherwise keep original quest data
    if (saved[i] && saved[i].id === q.id) {
      quests[i] = { ...q, ...saved[i] };
    } else {
      quests[i] = { ...q }; // ensure fresh copy, not reference
    }
  });
  alert(JSON.stringify(quests));
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
quest.stage < questData[quest.id].maxStage && playerStats.zone === quest.zone) {
    triggerQuest(quest, action);
  } else {
    if (ignoreAction) ignoreAction();
  }
}

export function questIncrement(id, condition = false, nextAction = null) {
  const quest = getQuest(id);
  if (quest.stage !== 1 || questData[id].type !== "repeatable" || condition === false) {
    if (nextAction) nextAction();
    return;
  }
  
  quest.count += 1;
  saveQuestState();

  if (quest.count >= questData[id].maxCount) {
    //tryQuestEncounter(id, 1);
    triggerQuest(quest);
  }

  if (nextAction) nextAction();
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