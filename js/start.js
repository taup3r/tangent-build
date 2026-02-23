// NEW GAME
document.getElementById("newGameBtn").onclick = () => {
  const name = prompt("Enter your player name:");

  if (!name) return;

  const key = `save_${name}`;

  if (localStorage.getItem(key)) {
    alert("A save with that name already exists.");
    return;
  }

  const newSave = {
    playerName: name,
    playerStats: { STR: 0, DEX: 0, AGI: 0, CON: 0, level: 1, exp: 0, statPoints: 0 },
    playerWeapon: null
  };

  localStorage.setItem(key, JSON.stringify(newSave));

  window.location.href = `combat.html?player=${encodeURIComponent(name)}`;
};


// CONTINUE
document.getElementById("continueBtn").onclick = () => {
  const saveList = document.getElementById("saveList");
  saveList.innerHTML = "";
  saveList.style.display = "block";

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("save_")) {
      const name = key.replace("save_", "");

      const div = document.createElement("div");
      div.className = "save-item";
      div.textContent = name;

      div.onclick = () => {
        window.location.href = `combat.html?player=${encodeURIComponent(name)}`;
      };

      saveList.appendChild(div);
    }
  }
};