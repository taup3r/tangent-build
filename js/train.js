import { playerStats, saveProgress, loadProgress } from "./state.js";

loadProgress();

// Populate UI
document.getElementById("statPoints").textContent = playerStats.statPoints;
document.getElementById("statSTR").textContent = playerStats.STR;
document.getElementById("statDEX").textContent = playerStats.DEX;
document.getElementById("statAGI").textContent = playerStats.AGI;
document.getElementById("statCON").textContent = playerStats.CON;

// Add stat buttons
document.querySelectorAll(".stat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const stat = btn.dataset.stat;

    if (playerStats.statPoints <= 0) return;

    playerStats[stat]++;
    playerStats.statPoints--;

    // Update UI
    document.getElementById("statPoints").textContent = playerStats.statPoints;
    document.getElementById("stat" + stat).textContent = playerStats[stat];

    saveProgress();
  });
});

// Return button
document.getElementById("returnBtn").onclick = () => {
  const from = localStorage.getItem("statsReturnTo");
  localStorage.removeItem("statsReturnTo");
  window.location.href = from;
};