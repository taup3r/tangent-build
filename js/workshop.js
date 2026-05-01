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
    name: "Spectroscope",
    outputType: "gadget",
    outputRank: 1,
    materials: [
      { itemId: "iWood", qty: 1 },
      { itemId: "bTwine", qty: 2 },
      { itemId: "pRivets", qty: 4 }
    ],
    goldCost: 2000
  }
];

let selectedRecipe = null;

function renderRecipeList() {
  const list = document.getElementById("recipeList");
  list.innerHTML = "";

  craftingRecipes.forEach(recipe => {
    const div = document.createElement("div");
    div.classList.add("recipe-item");
    div.innerText = recipe.name;

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
    .map(m => `<p>${m.qty} × ${m.itemId}</p>`)
    .join("");

  preview.innerHTML = `
    <h4>${recipe.name}</h4>
    <p><strong>Output:</strong> ${recipe.outputType} (Rank ${recipe.outputRank})</p>
    <p><strong>Gold Cost:</strong> ${recipe.goldCost}</p>
    <hr class="divider">
    ${materialHTML}
  `;
}

function updateCraftButtonState() {
  const btn = document.getElementById("craftButton");

  if (!selectedRecipe) {
    disableCraftButton();
    return;
  }

  if (!hasMaterials(selectedRecipe, player.inventory) || player.gold < selectedRecipe.goldCost) {
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

  if (!hasMaterials(selectedRecipe, player.inventory)) {
    alert("You lack the required materials.");
    return;
  }

  if (player.gold < selectedRecipe.goldCost) {
    alert("Not enough gold.");
    return;
  }

  consumeMaterials(selectedRecipe, player.inventory);
  player.gold -= selectedRecipe.goldCost;

  const crafted = craftItem(selectedRecipe);
  player.inventory.push(crafted);

  alert(`Crafted: ${crafted.name}`);

  updateCraftButtonState();
}

const craftButton = document.getElementById("craftButton");
craftButton.onclick = () => craftSelectedRecipe();

renderRecipeList();

questButton.onclick = () => showQuestList();
itemButton.onclick = () => showItemList();

document.getElementById("backButton").onclick = () => {
  window.location.href = `town.html?player=${encodeURIComponent(player.name)}`;
};