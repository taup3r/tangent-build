/* ================================
   GAME STATE: PLAYER + ENEMY
================================ */

export let player = {
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

export let enemy = {
  hp: 30,
  max: 30,
  ap: 0,
  defending: false,
  ...enemyTypes[Math.floor(Math.random() * enemyTypes.length)],
  name: randomName()
};

/* ================================
   PORTRAIT SETUP
================================ */

const enemyPortraits = {
  aggressive: "assets/enemy_aggressive.png",
  defensive: "assets/enemy_defensive.png",
  warlock: "assets/enemy_warlock.png"
};

export function initializePortraits() {
  document.getElementById("enemyPortrait").src = enemyPortraits[enemy.behavior];
  document.getElementById("playerPortrait").src = "assets/player.png";

  document.getElementById("enemyName").textContent = enemy.name;
  document.getElementById("enemyHint").textContent = enemy.hint;
}

/* ================================
   AP CLAMP
================================ */

export function clampAP() {
  if (player.ap > 2) player.ap = 2;
  if (enemy.ap > 2) enemy.ap = 2;
}