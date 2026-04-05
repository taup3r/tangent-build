import { player, playerStats } from "./state.js";
import { loadProgress } from "./state.js";

export function openPlayerInfoModal() {
  loadProgress();
  const modal = document.getElementById("playerModal");
  modal.style.display = "flex";
  document.getElementById("playerInfoCloseBtn").onclick = () => modal.style.display = "none";

  // Portrait
  document.getElementById("playerInfoPortrait").src =
    document.getElementById("playerPortrait").src;

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