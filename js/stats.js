import { playerStats, saveProgress, loadProgress } from "./state.js";

loadProgress();

let tempStats = {
  STR: playerStats.STR,
  DEX: playerStats.DEX,
  AGI: playerStats.AGI,
  CON: playerStats.CON
};

let tempPoints = playerStats.statPoints;

function updateUI() {
  document.getElementById("statPointsDisplay").textContent = tempPoints;

  document.getElementById("statValueSTR").textContent = tempStats.STR;
  document.getElementById("statValueDEX").textContent = tempStats.DEX;
  document.getElementById("statValueAGI").textContent = tempStats.AGI;
  document.getElementById("statValueCON").textContent = tempStats.CON;
}

export function showStatsModal() {
  updateUI();

  document.querySelectorAll(".stat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const stat = btn.dataset.stat;

      if (btn.classList.contains("plus")) {
        if (tempPoints > 0) {
          tempStats[stat]+=1;
          tempPoints-=1;
        }
      } else {
        if (tempStats[stat] > playerStats[stat]) {
          tempStats[stat]-=1;
          tempPoints+=1;
        }
      }

      updateUI();
    });
  });

  document.getElementById("resetStatsBtn").onclick = () => {
    tempStats = {
      STR: playerStats.STR,
      DEX: playerStats.DEX,
      AGI: playerStats.AGI,
      CON: playerStats.CON
    };
    tempPoints = playerStats.statPoints;
    updateUI();
  };

  document.getElementById("saveStatsBtn").onclick = () => {
    playerStats.STR = tempStats.STR;
    playerStats.DEX = tempStats.DEX;
    playerStats.AGI = tempStats.AGI;
    playerStats.CON = tempStats.CON;
    playerStats.statPoints = tempPoints;

    saveProgress();

    document.getElementById("stats-modal").style.display = "none";
  };

  document.getElementById("stats-modal").style.display = "flex";
}