import { player, playerStats, loadProgress } from "./state.js";

loadProgress();

const playerSkills = `${player.name}_skills`;

export const skillData = {
  "bthrust": {
    title: "Balanced Thrust",
    description: "Deal 150% base damage with a 20% chance to gain 1 ap back.",
    maxLevel: 1
  },
  "bstrike": {
    title: "Blunt Strike",
    description: "20% chance to stun for 2 turns or 30% base damage when failed.",
    maxLevel: 1
  }
}

export const skills = [
  {
    id: "bthrust",
    level: 0
  },
  {
    id: "bstrike",
    level: 0
  }
]

loadSkills();

export function loadSkills() {
  let list = JSON.parse(localStorage.getItem(playerSkills) || "[]");

  let saved = [
  ...new Map(list.map(item => [item.id, item])).values()
];

  skills.forEach((q, i) => {
    // If saved[i] exists, merge it; otherwise keep original data
    if (saved[i] && saved[i].id === q.id) {
      skills[i] = { ...q, ...saved[i] };
    } else {
      skills[i] = { ...q }; // ensure fresh copy, not reference
    }
  });
}

export function saveSkills() {
  localStorage.setItem(playerSkills, JSON.stringify(skills));
}

export function getSkill(id) {
  return skills.find(q => q.id === id);
}

export function hasSkill(id) {
  const skill = getSkill(id);
  return skill.level > 0;
}

export function levelSkill(id) {
  const skill = getSkill(id);
  skill.level += 1;
  saveSkills();
}