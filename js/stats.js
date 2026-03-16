import { playerStats, saveProgress, loadProgress } from "./state.js";

export function integrateStatsModal() {
  fetch("stats-modal.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("stats-modal-container").innerHTML = html;
    });
}

loadProgress();

let tempStats = {
    STR: playerStats.STR,
    DEX: playerStats.DEX,
    AGI: playerStats.AGI,
    CON: playerStats.CON
  };
let tempPoints = playerStats.statPoints;

document.querySelectorAll(".stat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const stat = btn.dataset.stat;

    if (btn.classList.contains("plus")) {
      if (tempPoints > 0) {
        tempStats[stat]++;
        tempPoints--;
      }
    } else {
      if (tempStats[stat] > playerStats[stat]) {
        tempStats[stat]--;
        tempPoints++;
      }
    }

    updateUI();
  });
});

document.getElementById("resetStatsBtn").onclick = () => {
  loadStats();
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

function loadStats() {
  loadProgress();
  tempStats = {
    STR: playerStats.STR,
    DEX: playerStats.DEX,
    AGI: playerStats.AGI,
    CON: playerStats.CON
  };
  tempPoints = playerStats.statPoints;
}

function updateUI() {
  document.getElementById("statPointsDisplay").textContent = tempPoints;
  document.getElementById("statValueSTR").textContent = tempStats.STR;
  document.getElementById("statValueDEX").textContent = tempStats.DEX;
  document.getElementById("statValueAGI").textContent = tempStats.AGI;
  document.getElementById("statValueCON").textContent = tempStats.CON;
}

export function showStatsModal() {
  loadStats();
  updateUI();
  document.getElementById("stats-modal").style.display = "flex";
}