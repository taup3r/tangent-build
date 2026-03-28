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
    playerStats: { STR: 0, DEX: 0, AGI: 0, CON: 0, level: 1, exp: 0, statPoints: 0, gold: 0, reputation: 50 },
    playerWeapon: null
  };

  localStorage.setItem(key, JSON.stringify(newSave));

  window.location.href = `town.html?player=${encodeURIComponent(name)}`;
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

      const row = document.createElement("div");
      row.className = "save-item";
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";

      // Save name (click to load)
      const nameBtn = document.createElement("div");
      nameBtn.textContent = name;
      nameBtn.style.cursor = "pointer";
      nameBtn.onclick = () => {
        window.location.href = `town.html?player=${encodeURIComponent(name)}`;
      };

      // Delete button
      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.style.background = "transparent";
      delBtn.style.border = "none";
      delBtn.style.color = "#ff6b6b";
      delBtn.style.fontSize = "1.2rem";
      delBtn.style.cursor = "pointer";

      delBtn.onclick = (e) => {
        e.stopPropagation(); // prevent triggering load

        if (confirm(`Delete save "${name}"? This cannot be undone.`)) {
          localStorage.removeItem(key);
          row.remove(); // remove from UI
        }
      };

      row.appendChild(nameBtn);
      row.appendChild(delBtn);
      saveList.appendChild(row);
    }
  }
};