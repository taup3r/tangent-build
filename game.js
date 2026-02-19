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