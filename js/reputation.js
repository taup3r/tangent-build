import { playerStats } from "./state.js";

export function weaponShopDiscount() {
  if ((playerStats.reputation || 0) > 0) {
    return 5;
  }
}

export function rollEnemyTier() {
  const rep = playerStats.reputation || 0;

  const normalChance = 50 - (rep * 0.5);
  const eliteChance = 30 + rep * 0.25);
  const veteranChance = 15 + (rep * 0.15);
  const bossChance = 5 + rep * (0.10);

  const roll = Math.random() * 100;

  if (roll < normalChance) return "normal";
  if (roll < normalChance + eliteChance) return "elite";
  if (roll < normalChance + eliteChance + veteranChance) return "veteran";
  return "boss";
}