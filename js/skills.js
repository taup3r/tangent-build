import { player, playerStats, loadProgress } from "./state.js";

loadProgress();

const playerSkills = `${player.name}_skills`;

export const skillData = {
  "bthrust": {
    title: "Balanced Thrust",
    description: "Deal 150% base damage with a 20% chance to gain 1 ap back.",
    maxLevel: 1
  }
}

export const skills = [
  {
    id: "bthrust",
    level: 0
  }
]