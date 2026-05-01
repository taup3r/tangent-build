import { player, playerStats, loadProgress, saveProgress } from "./state.js";
import { updateHeaderStats } from "./ui.js";
import { showQuestList, questData, getQuest } from "./quest.js";
import { itemData, getItem, getNameByRarity, getColorByRarity, loadItems, saveItems, showItemList, oreData } from "./items.js";

loadProgress();
updateHeaderStats();
loadItems();

document.getElementById("loreText").textContent = `Select a recipe to view details.`;

const craftingRecipes = [
  {
    id: "spectroscope",
    materials: [
      { id: "ironbarkWood", qty: 1 },
      { id: "bindingTwine", qty: 1 },
      { id: "polishedRivets", qty: 1 }
    ]
  }
];

let selectedRecipe = null;

function renderRecipeList() {
  const list = document.getElementById("recipeList");
  list.innerHTML = "";

  craftingRecipes.forEach(recipe => {
    const div = document.createElement("div");
    div.classList.add("recipe-item");
    div.innerText = itemData[recipe.id].name;

    div.onclick = () => {
      document.querySelectorAll(".recipe-item").forEach(i => i.classList.remove("selected"));
      div.classList.add("selected");
      selectedRecipe = recipe;
      renderRecipePreview(recipe);
      updateCraftButtonState();
    };

    list.appendChild(div);
  });
}

function renderRecipePreview(recipe) {
  const preview = document.getElementById("recipePreview");

  let materialHTML = recipe.materials
    .map(m => `<p>${m.qty} × ${itemData[m.id].name}</p>`)
    .join("");

  preview.innerHTML = `
    <h4>${itemData[recipe.id].name}</h4>
    <p>${itemData[recipe.id].type} (${itemData[recipe.id].rarity})</p>
    <p><strong>Cost:</strong> ${itemData[recipe.id].use} g</p>
    ${materialHTML}
  `;
}

function updateCraftButtonState() {
  const btn = document.getElementById("craftButton");

  if (!selectedRecipe) {
    disableCraftButton();
    return;
  }

  if (!hasMaterials(selectedRecipe, playerStats.items || []) || player.gold < itemData[selectedRecipe.id].use) {
    disableCraftButton();
    return;
  }

  btn.classList.remove("disabled");
  btn.disabled = false;
}

function disableCraftButton() {
  const btn = document.getElementById("craftButton");
  btn.classList.add("disabled");
  btn.disabled = true;
}

function craftSelectedRecipe() {
  if (!selectedRecipe) return;

  if (!hasMaterials(selectedRecipe, playerStats.items || [])) {
    alert("You lack the required materials.");
    return;
  }

  if (player.gold < itemData[selectedRecipe.id].use) {
    alert("Not enough gold.");
    return;
  }

  consumeMaterials(selectedRecipe, playerStats.items || []);
  player.gold -= itemData[selectedRecipe.id].use;

  const crafted = getItem(selectedRecipe.id);
  playerStats.items.push(crafted);

  alert(`Crafted: ${itemData[crafted.id].name}`);
  saveItems();

  updateCraftButtonState();
}

function hasMaterials(recipe, inventory) {
  return recipe.materials.every(req => {
    const invItem = inventory.find(i => i.id === req.id);
    return invItem && invItem.count >= req.qty;
  });
}

const craftButton = document.getElementById("craftButton");
craftButton.onclick = () => craftSelectedRecipe();

renderRecipeList();

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};