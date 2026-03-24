import { playerStats } from "./state.js";

export function weaponShopDiscount() {
  if ((playerStats.reputation || 0) > 0) {
    return 5;
  }
}