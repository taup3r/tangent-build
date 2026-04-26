import { player, playerStats, loadProgress } from "./state.js";

loadProgress();

const playerSkills = `${player.name}_skills`;

export const skillData = {
  "bthrust": {
    title: "Balanced Thrust",
    description: "Deal 150% base damage with a 20% chance to gain 1 ap back.",
    maxLevel: 1,
    flow: [
      {
        level: 1,
        type: "damage",
        baseDmgPct: 150,
        apGainChance: 20,
        apGainCount: 1,
        stunChance: 0,
        stunTurns: 0,
        failDmgPct: 0,
        counterMissDmgPct: 0,
        counterHitDmgPct: 0
      }
    ]
  },
  "bstrike": {
    title: "Blunt Strike",
    description: "20% chance to stun for 2 turns or 30% base damage when failed.",
    maxLevel: 1,
    flow: [
      {
        level: 1,
        type: "status",
        baseDmgPct: 0,
        apGainChance: 0,
        apGainCount: 0,
        stunChance: 20,
        stunTurns: 2,
        failDmgPct: 30,
        counterMissDmgPct: 0,
        counterHitDmgPct: 0
      }
    ]
  },
  "lriposte": {
    title: "Lean Riposte",
    description: "Riposte, when enemy attacks and misses counter with 220% base damage, otherwise 180% when hit.",
    maxLevel: 1,
    flow: [
      {
        level: 1,
        type: "counter",
        baseDmgPct: 0,
        apGainChance: 0,
        apGainCount: 0,
        stunChance: 0,
        stunTurns: 0,
        failDmgPct: 0,
        counterMissDmgPct: 220,
        counterHitDmgPct: 180
      }
    ]
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
  },
  {
    id: "lriposte",
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