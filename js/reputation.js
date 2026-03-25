import { playerStats, saveProgress } from "./state.js";

export function weaponShopDiscount() {
  const rep = playerStats.reputation || 0;
  if (rep > 80) return 20;
  if (rep > 60) return 16;
  if (rep > 40) return 12;
  if (rep > 20) return 8;
  if (rep > 0) return 5;
  return 0;
}

export function gainReputation(tier) {
  let rep = 0;

  //if no reputation yet, system not used
  if ((playerStats.reputation || 0) < 1) return null;

  if (tier === "normal") rep = 1;
  if (tier === "elite") rep = 2;
  if (tier === "veteran") rep = 3;
  if (tier === "boss") rep = 4;

  playerStats.reputation += rep;

  //max reputation capped at 100
  if (playerStats.reputation > 100) playerStats.reputation = 100;

  saveProgress();
  return rep;
}

export function loseReputation(tier) {
  let rep = 0;

  //if no reputation yet, system not used
  if ((playerStats.reputation || 0) < 1) return null;

  if (tier === "normal") rep = 4;
  if (tier === "elite") rep = 3;
  if (tier === "veteran") rep = 2;
  if (tier === "boss") rep = 1;

  playerStats.reputation -= rep;

  //min reputation capped at 1
  if (playerStats.reputation < 1) playerStats.reputation = 1;

  saveProgress();
  return rep;
}

export function getReputationTier(rep) {
  if (rep < 20) return "Unknown";
  if (rep < 40) return "Associate";
  if (rep < 60) return "Trusted";
  if (rep < 80) return "Respected";
  return "Elite";
}

export function getReputationColor(rep) {
  if (rep < 20) return "#666";        // grey
  if (rep < 40) return "#4aa3ff";     // blue
  if (rep < 60) return "#55ff88";     // green
  if (rep < 80) return "#ffaa2b";     // gold
  return "#ff44aa";                   // pink elite
}