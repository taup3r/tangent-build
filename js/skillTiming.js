/* ============================================
   SKILL TIMING MODULE
   Handles:
   - Timing window activation
   - Hit button logic
   - Perfect vs. normal timing
============================================ */

import { player } from "./state.js";
import { log } from "./ui.js";
import { applySkillDamage } from "./combat.js";

/* -------------------------
   TIMING CONFIG
------------------------- */

let skillTimingActive = false;
let skillTimingStart = 0;

const TIMING_WINDOW = 100;   // ms for perfect hit
const FAIL_TIMEOUT = 200;    // ms after second animation

/* -------------------------
   START TIMING WINDOW
------------------------- */

export function startSkillTiming() {
  const hitBtn = document.getElementById("hitBtn");

  skillTimingActive = true;
  skillTimingStart = performance.now();

  hitBtn.disabled = false;
  hitBtn.style.display = "block";

  // If player never presses Hit → auto fail
  setTimeout(() => {
    if (skillTimingActive) {
      skillTimingActive = false;
      hitBtn.style.display = "none";
      hitBtn.disabled = true;
      log("Too slow! Skill deals reduced damage.");
      applySkillDamage(false);
    }
  }, FAIL_TIMEOUT);
}

/* -------------------------
   PLAYER PRESSES HIT
------------------------- */

export function handleHitPress() {
  if (!skillTimingActive) return;

  const now = performance.now();
  const delta = now - skillTimingStart;

  skillTimingActive = false;

  const hitBtn = document.getElementById("hitBtn");
  hitBtn.style.display = "none";
  hitBtn.disabled = true;

  const perfect = delta <= TIMING_WINDOW;

  if (perfect) {
    log("Perfect timing! Massive damage!");
  } else {
    log("Good hit, but not perfect.");
  }

  applySkillDamage(perfect);
}

/* -------------------------
   RESET (called by combat)
------------------------- */

export function resetSkillTiming() {
  skillTimingActive = false;
}