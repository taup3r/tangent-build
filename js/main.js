/* ============================================
   MAIN GAME INITIALIZER
   Wires everything together:
   - Loads portraits
   - Sets up button events
   - Starts first turn
============================================ */

import { initializePortraits } from "./state.js";
import { updateUI } from "./ui.js";
import { playerAttack, playerDefend, playerSkill, startPlayerTurn } from "./combat.js";
import { handleHitPress } from "./skillTiming.js";
import { openEnemyInfo } from "./modal.js";

/* -------------------------
   INITIAL SETUP
------------------------- */

window.addEventListener("DOMContentLoaded", () => {

  // Load portraits + enemy name/hint
  initializePortraits();

  // Initial UI render
  updateUI();

  // Player action buttons
  document.getElementById("attackBtn").addEventListener("click", playerAttack);
  document.getElementById("defendBtn").addEventListener("click", playerDefend);
  document.getElementById("skillBtn").addEventListener("click", playerSkill);

  // Skill timing button
  document.getElementById("hitBtn").addEventListener("click", handleHitPress);

  // Enemy info button
  document.getElementById("enemyInfoBtn").addEventListener("click", openEnemyInfo);

  // Start the first turn
  startPlayerTurn();
});