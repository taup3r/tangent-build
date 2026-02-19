/* -------------------------
   PLAYER + ENEMY SETUP
------------------------- */

let player = {
  hp: 30,
  max: 30,
  ap: 0,
  defending: false
};

const enemyTypes = [
  { type: "Aggressive Fighter", behavior: "aggressive", hint: "This foe seems bloodthirsty..." },
  { type: "Defensive Guard", behavior: "defensive", hint: "This one watches your moves carefully..." },
  { type: "Cunning Warlock", behavior: "warlock", hint: "A strange aura surrounds this enemy..." }
];

function randomName() {
  const first = ["Gor", "Thal", "Rin", "Vor", "Kel", "Zar", "Mor", "Fen"];
  const last = ["Bloodfang", "Ironhide", "Nightweaver", "Stormborn", "Ashclaw"];
  return first[Math.floor(Math.random() * first.length)] + " " +
         last[Math.floor(Math.random() * last.length)];
}

let enemy = {
  hp: 30,
  max: 30,
  ap: 0,
  defending: false,
  ...enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
  name: randomName()
};

document.getElementById("enemyName").textContent = enemy.name;
document.getElementById("enemyHint").textContent = enemy.hint;

/* -------------------------
   UI + HELPERS
------------------------- */

function clampAP() {
  if (player.ap > 2) player.ap = 2;
  if (enemy.ap > 2) enemy.ap = 2;
}

function updateUI() {
  document.getElementById("ap").textContent = player.ap;
  document.getElementById("enemyAP").textContent = enemy.ap;

  document.getElementById("playerHPBar").style.width =
    (player.hp / player.max * 100) + "%";

  document.getElementById("enemyHPBar").style.width =
    (enemy.hp / enemy.max * 100) + "%";
}

function log(msg) {
  const logBox = document.getElementById("log");
  logBox.textContent += msg + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

function disableButtons() {
  document.getElementById("attackBtn").disabled = true;
  document.getElementById("defendBtn").disabled = true;
  document.getElementById("skillBtn").disabled = true;
}

function enableButtons() {
  document.getElementById("attackBtn").disabled = false;
  document.getElementById("defendBtn").disabled = false;
  document.getElementById("skillBtn").disabled = false;
}

/* -------------------------
   TURN SYSTEM
------------------------- */

function startTurn() {
  player.ap += 1;
  clampAP();
  player.defending = false;
  log("\n--- Player Turn ---");
  updateUI();
}

function checkWin() {
  if (enemy.hp <= 0) {
    log("You defeated " + enemy.name + "!");
    disableButtons();
    return true;
  }
  return false;
}

/* -------------------------
   PLAYER ACTIONS
------------------------- */

function playerAttack() {
  if (player.ap < 1) return log("Not enough AP!");

  player.ap -= 1;
  clampAP();

  let dmg = Math.floor(Math.random() * 6) + 4;

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  enemy.hp -= dmg;
  if (enemy.hp < 0) enemy.hp = 0;

  log("You attack for " + dmg + "!");

  updateUI();

  if (!checkWin()) enemyTurn();
}

function playerDefend() {
  player.defending = true;
  log("You brace for impact...");
  enemyTurn();
}

/* -------------------------
   TIMING MINI-GAME
------------------------- */

let timingActive = false;
let timingPos = 0;
let timingDir = 1;
let timingInterval = null;

function playerSkill() {
  if (player.ap < 2) return log("Not enough AP!");

  player.ap -= 2;
  clampAP();

  log("Skill activated! Time your hit...");

  disableButtons();
  startTimingMiniGame();
}

function startTimingMiniGame() {
  timingActive = true;
  timingPos = 0;
  timingDir = 1;

  document.getElementById("timingCard").style.display = "block";

  timingInterval = setInterval(() => {
    timingPos += timingDir * 2;

    if (timingPos >= 100) timingDir = -1;
    if (timingPos <= 0) timingDir = 1;

    document.getElementById("timingMarker").style.left = timingPos + "%";
  }, 16);

  document.getElementById("timingButton").onclick = stopTimingMiniGame;
}

function stopTimingMiniGame() {
  if (!timingActive) return;

  timingActive = false;
  clearInterval(timingInterval);
  document.getElementById("timingCard").style.display = "none";

  let success = timingPos >= 40 && timingPos <= 60;

  let base = Math.floor(Math.random() * 6) + 4;
  let dmg = success ? base * 2.5 : base * 2;

  log(success ? "Perfect timing! 2.5x damage!" : "Good hit! 2x damage.");

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  enemy.hp -= Math.floor(dmg);
  if (enemy.hp < 0) enemy.hp = 0;

  updateUI();

  if (!checkWin()) enemyTurn();

  enableButtons();
}

/* -------------------------
   ENEMY AI
------------------------- */

function enemyTurn() {
  log("\n--- Enemy Turn (" + enemy.name + ") ---");

  enemy.ap += 1;
  clampAP();
  enemy.defending = false;

  let action = decideEnemyAction();

  if (action === "skill") {
    enemy.ap -= 2;

    let base = Math.floor(Math.random() * 6) + 4;
    let dmg = base * 2;

    if (player.defending) {
      dmg = Math.floor(dmg / 2);
      log("You defended! Damage halved.");
    }

    player.hp -= dmg;
    if (player.hp < 0) player.hp = 0;

    log(enemy.name + " uses SKILL for " + dmg + " damage!");
  }

  else if (action === "attack") {
    enemy.ap -= 1;

    let dmg = Math.floor(Math.random() * 6) + 3;

    if (player.defending) {
      dmg = Math.floor(dmg / 2);
      log("You defended! Damage halved.");
    }

    player.hp -= dmg;
    if (player.hp < 0) player.hp = 0;

    log(enemy.name + " attacks for " + dmg + "!");
  }

  else if (action === "defend") {
    enemy.defending = true;
    log(enemy.name + " braces for impact.");
  }

  else {
    log(enemy.name + " has no AP and skips the turn.");
  }

  updateUI();

  if (player.hp <= 0) {
    log("You were defeated!");
    disableButtons();
    return;
  }

  startTurn();
}

/* -------------------------
   ENEMY AI DECISION LOGIC
------------------------- */

function decideEnemyAction() {
  const type = enemy.behavior;

  if (enemy.ap >= 2) {
    if (type === "aggressive") return Math.random() < 0.6 ? "skill" : "attack";
    if (type === "warlock") return Math.random() < 0.75 ? "skill" : "attack";
    if (type === "defensive") return Math.random() < 0.2 ? "skill" : "defend";
  }

  if (enemy.ap >= 1) {
    if (type === "defensive") return Math.random() < 0.5 ? "defend" : "attack";
    return "attack";
  }

  return Math.random() < 0.5 ? "defend" : "skip";
}

/* -------------------------
   INIT
------------------------- */

updateUI();
startTurn();

/* -------------------------
   PORTRAITS
------------------------- */

const enemyPortraits = {
  aggressive: "https://i.imgur.com/8Q1ZQ7L.jpeg",
  defensive: "https://i.imgur.com/6uQ1YpC.jpeg",
  warlock: "https://i.imgur.com/1gkYt8F.jpeg"
};

const playerPortraitURL = "https://i.imgur.com/3QeQ7kN.jpeg";

/* After enemy is created */
document.getElementById("enemyPortrait").src = enemyPortraits[enemy.behavior];
document.getElementById("playerPortrait").src = playerPortraitURL;