/* ============================================
   MODAL MODULE
   Handles:
   - Victory / Defeat modal
   - Log injection (line-by-line)
   - Restarting the battle
   - Win/Lose checks
============================================ */

import { player, enemy } from "./state.js";

/* -------------------------
   SHOW RESULT MODAL
------------------------- */

export function showResultModal(victory) {
  const modal = document.getElementById("resultModal");
  const title = document.getElementById("resultTitle");
  const logBox = document.getElementById("resultLog");

  title.textContent = victory ? "Victory!" : "Defeat";

  // Convert newline logs into <br> for readable formatting
  const rawLog = document.getElementById("log").textContent;
  logBox.innerHTML = rawLog.replace(/\n/g, "<br>");

  modal.style.display = "flex";
}

/* -------------------------
   CHECK WIN / LOSE
------------------------- */

export function checkWin() {
  if (enemy.hp <= 0) {
    document.getElementById("log").textContent += `You defeated ${enemy.name}!\n`;
    showResultModal(true);
    return true;
  }

  if (player.hp <= 0) {
    document.getElementById("log").textContent += "You were defeated!\n";
    showResultModal(false);
    return true;
  }

  return false;
}

/* -------------------------
   START NEW BATTLE
------------------------- */

export function startNewBattle() {
  // Easiest clean reset
  location.reload();
}