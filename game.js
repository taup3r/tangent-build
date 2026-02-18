let player = {
  hp: 30,
  max: 30,
  ap: 0,
  defending: false
};

let enemy = {
  hp: 30,
  max: 30
};

function updateUI() {
  document.getElementById("ap").textContent = player.ap;

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

function startTurn() {
  player.ap += 1;
  player.defending = false;
  log("\n--- Player Turn ---");
  updateUI();
}

function enemyTurn() {
  log("\n--- Enemy Turn ---");

  let dmg = Math.floor(Math.random() * 6) + 3;

  if (player.defending) {
    dmg = Math.floor(dmg / 2);
    log("You defended! Damage halved.");
  }

  player.hp -= dmg;
  if (player.hp < 0) player.hp = 0;

  log("Enemy hits you for " + dmg + "!");

  updateUI();

  if (player.hp <= 0) {
    log("You were defeated!");
    disableButtons();
    return;
  }

  startTurn();
}

function disableButtons() {
  document.querySelectorAll("button").forEach(btn => btn.disabled = true);
}

function checkWin() {
  if (enemy.hp <= 0) {
    log("You defeated the enemy!");
    disableButtons();
    return true;
  }
  return false;
}

function playerAttack() {
  if (player.ap < 1) return log("Not enough AP!");

  player.ap -= 1;
  let dmg = Math.floor(Math.random() * 6) + 4;

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

function playerSkill() {
  if (player.ap < 2) return log("Not enough AP!");

  player.ap -= 2;
  let dmg = (Math.floor(Math.random() * 6) + 4) * 2;

  enemy.hp -= dmg;
  if (enemy.hp < 0) enemy.hp = 0;

  log("You unleash a Skill for " + dmg + "!");

  updateUI();

  if (!checkWin()) enemyTurn();
}

updateUI();
startTurn();
