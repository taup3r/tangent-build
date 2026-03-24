import { playerStats } from "./state.js";

export function weaponShopDiscount() {
  if ((playerStats.reputation || 0) > 0) {
    return 5;
  }
}

export function gainReputation(tier) {
  let rep = playerStats.reputation || 0;

  if (tier === "normal") rep += 1;
  if (tier === "elite") rep += 2;
  if (tier === "veteran") rep += 3;
  if (tier === "boss") rep += 4;

  if (rep > 100) rep = 100;

  playerStats.reputation = rep;
}

export function loseReputation(tier) {
  let rep = playerStats.reputation || 0;

  if (tier === "normal") rep -= 3;
  if (tier === "elite") rep -= 2;
  if (tier === "veteran") rep -= 1;

  if (rep < 1) rep = 1;

  playerStats.reputation = rep;
}