import { player, playerStats } from "./state.js";

export function openPlayerInfoModal() {
  const modal = document.getElementById("playerModal");
  modal.style.display = "flex";
  document.getElementById("playerInfoCloseBtn").onclick = () => modal.style.display = "none";

  // Portrait
  document.getElementById("playerInfoPortrait").src = "assets/player.png";

  // Name + Level
  document.getElementById("playerInfoName").textContent = player.name;
  document.getElementById("playerInfoLevel").textContent = playerStats.level;
  document.getElementById("playerInfoExp").textContent = `${playerStats.exp}/${playerStats.expToNext}`;
  document.getElementById("playerInfoGold").textContent = playerStats.gold || 0;

  // Stats (after weapon bonuses)
  document.getElementById("playerInfoSTR").textContent = player.STR;
  document.getElementById("playerInfoDEX").textContent = player.DEX;
  document.getElementById("playerInfoAGI").textContent = player.AGI;
  document.getElementById("playerInfoCON").textContent = player.CON;

  // Weapon section
  if (player.weapon) {
    const w = player.weapon;

    // Weapon name (H3)
    const weaponNameEl = document.getElementById("playerProfileWeapon");
    weaponNameEl.textContent = w.name;
    weaponNameEl.style.color = w.color;

    // Damage
    document.getElementById("playerProfileWeaponDamage").textContent =
      `Damage: ${w.damage.min} – ${w.damage.max}`;

    // Stat modifiers (no label)
    const statStrings = Object.entries(w.stats)
      .filter(([_, val]) => val > 0)
      .map(([stat, val]) => `${stat} +${val}`);

    document.getElementById("playerProfileWeaponStats").textContent =
      statStrings.length > 0 ? statStrings.join(", ") : "";

    // Lore
    if (w.lore && w.lore.trim() !== "") {
      document.getElementById("playerProfileWeaponLore").textContent = `"${w.lore}"`;
    } else {
      document.getElementById("playerProfileWeaponLore").textContent = "";
    }

  } else {
    // No weapon equipped
    document.getElementById("playerProfileWeapon").textContent = "Unarmed";
    document.getElementById("playerProfileWeapon").style.color = "#ccc";
    document.getElementById("playerProfileWeaponDamage").textContent = "-";
    document.getElementById("playerProfileWeaponStats").textContent = "";
    document.getElementById("playerProfileWeaponLore").textContent = "";
  }
}

function updateDerivedStats() {
  const STR = playerStats.STR;
  const DEX = playerStats.DEX;
  const AGI = playerStats.AGI;
  const CON = playerStats.CON;

  // You can tune these formulas later
  const damageAdjust = Math.floor(STR * 1);
  const hitChance = 80 + Math.floor(DEX * 1);
  const evadeChance = 0 + Math.floor(AGI * 1);
  const hpAdjust = Math.floor(CON * 5);

  document.getElementById("derivedDamage").textContent = `+${damageAdjust}`;
  document.getElementById("derivedHit").textContent = `${hitChance}%`;
  document.getElementById("derivedEvade").textContent = `${evadeChance}%`;
  document.getElementById("derivedHP").textContent = `+${hpAdjust}`;
}