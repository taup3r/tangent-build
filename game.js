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

/* -------------------------
   PORTRAITS
------------------------- */

const enemyPortraits = {
  aggressive: "assets/enemy_aggressive.png",
  defensive: "assets/enemy_defensive.png",
  warlock: "assets/enemy_warlock.png"
};

document.getElementById("enemyPortrait").src = enemyPortraits[enemy.behavior];
document.getElementById("playerPortrait").src = "assets/player.png";

document.getElementById("enemyName").textContent = enemy.name;

/* -------------------------
   UI HELPERS
------------------------- */

function clampAP() {
  if (player.ap > 2) player.ap = 2;
  if (enemy.ap > 2) enemy.ap = 2;
}

function renderAPIcons() {
  const playerRow = document.getElementById("playerAPIcons");
  const enemyRow = document.getElementById("enemyAPIcons");

  playerRow.innerHTML = "";
  enemyRow.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const p = document.createElement("div");
    p.className = "ap-icon" + (i < player.ap ? " active" : "");
    playerRow.appendChild(p);

    const e = document.createElement("div");
    e.className = "ap-icon" + (i < enemy.ap ? " active" : "");
    enemyRow.appendChild(e);
  }
}

function updateHPText() {
  document.getElementById("playerHPText").textContent = `${player.hp}/${player.max}`;
  document.getElementById("enemyHPText").textContent = `${enemy.hp}/${enemy.max}`;
}

function updateUI() {
  renderAPIcons();
  updateHPText();

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

function resetHitButton() {
  const hit = document.getElementById("hitBtn");
  hit.style.display = "none";
  hit.disabled = true;
  skillTimingActive = false;
}

/* -------------------------
   ANIMATIONS
------------------------- */

function animateCard(cardId, animClass, duration = 300) {
  const card = document.getElementById(cardId);
  card.classList.add(animClass);
  setTimeout(() => card.classList.remove(animClass), duration);
}

function animateSkillDouble(cardId) {
  animateCard(cardId, "skill-anim", 300);
  setTimeout(() => animateCard(cardId, "skill-anim", 300), 1000);
}

function applyDefendGlow(cardId) {
  document.getElementById(cardId).classList.add("defend-glow");
}

function removeDefendGlow(cardId) {
  document.getElementById(cardId).classList.remove("defend-glow");
}

/* -------------------------
   SKILL TIMING SYSTEM
------------------------- */

let skillTimingActive = false;
let skillTimingStart = 0;
const skillTimingWindow = 100;
const skillTimingFailTime = 200;

function playerSkill() {
  resetHitButton();

  if (player.ap < 2) return log("Not enough AP!");

  player.ap -= 2;
  clampAP();

  log("Skill activated! Prepare to strike...");

  disableButtons();

  const hit = document.getElementById("hitBtn");
  hit.style.display = "block";
  hit.disabled = true;

  animateCard("enemyCard", "skill-anim", 300);

  setTimeout(() => {
    animateCard("enemyCard", "skill-anim", 300);

    skillTimingActive = true;
    skillTimingStart = performance.now();
    hit.disabled = false;

    setTimeout(() => {
      if (skillTimingActive) {
        skillTimingActive = false;
        hit.style.display = "none";
        hit.disabled = true;
        log("Too slow! Skill deals reduced damage.");
        applySkillDamage(false);
      }
    }, skillTimingFailTime);

  }, 1000);
}

function playerHit() {
  if (!skillTimingActive) return;

  const now = performance.now();
  const delta = now - skillTimingStart;

  skillTimingActive = false;
  const hit = document.getElementById("hitBtn");
  hit.style.display = "none";
  hit.disabled = true;

  const success = delta <= skillTimingWindow;

  log(success ? "Perfect timing! Massive damage!" : "Good hit, but not perfect.");

  applySkillDamage(success);
}

function applySkillDamage(success) {
  resetHitButton();

  let base = Math.floor(Math.random() * 6) + 4;
  let dmg = success ? base * 2.5 : base * 2;

  if (enemy.defending) {
    dmg = Math.floor(dmg / 2);
    log(enemy.name + " defended! Damage halved.");
  }

  enemy.hp -= Math.floor(dmg);
  if (enemy.hp < 0) enemy.hp = 0;

  updateUI();

  if (!checkWin()) {
    enemyTurn();
  } else {
    disableButtons();
  }
}

/* -------------------------
   PLAYER ACTIONS
------------------------- */

function playerAttack() {
  resetHitButton();

  if (player.ap < 1) return log("Not enough AP!");

  player.ap -= 1;
  clampAP();

  disableButtons();

  animateCard("enemyCard", "attack-anim");

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
  resetHitButton();

  player.defending = true;
  applyDefendGlow("playerCard");
  log("You brace for impact...");

  disableButtons();
  enemyTurn();
}

/* -------------------------
   ENEMY AI
------------------------- */

function enemyTurn() {
  resetHitButton();

  log("\n--- Enemy Turn (" + enemy.name + ") ---");

  enemy.ap += 1;
  clampAP();
  enemy.defending = false;
  removeDefendGlow("enemyCard");

  let action = decideEnemyAction();

  if (action === "skill") {
    enemy.ap -= 2;

    animateSkillDouble("playerCard");

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

    animateCard("playerCard", "attack-anim");

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
    applyDefendGlow("enemyCard");
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
   TURN + WIN CHECK
------------------------- */

function startTurn() {
  player.ap += 1;
  clampAP();
  player.defending = false;
  removeDefendGlow("playerCard");
  log("\n--- Player Turn ---");
  updateUI();
  enableButtons();
}

function checkWin() {
  if (enemy.hp <= 0) {
    log("You defeated " + enemy.name + "!");
    return true;
  }
  return false;
}

/* -------------------------
   INIT
------------------------- */

updateUI();
startTurn();