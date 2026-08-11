import { materials, inventory } from '../core/state.js';
import {
    DISPLAY,
    SELECTORS,
    BLUEPRINT_OWNED,
    ITEM_LEVEL_NONE,
    INVENTORY_KEYS,
} from '../utils/constants.js';
import { hasEnoughMaterials } from '../utils/helpers.js';
import { refreshHud } from '../ui/hudManager.js';
import { openModal } from '../ui/modalManager.js';
import { craftRecipes } from '../entities/shop/recipes.js';
import { refreshResourceCursors } from '../entities/farm/farm.js';
import { refreshShopItems } from '../entities/shop/shop.js';

/**
 * Coloca a fornalha na ilha e empurra o Sell para a direita.
 */
function placeFurnaceOnIsland() {
    const sellTrigger = document.querySelector(SELECTORS.SELL_TRIGGER);
    const furnaceTrigger = document.querySelector(SELECTORS.FURNACE_TRIGGER);

    sellTrigger.classList.add('farm-trigger--sell-shifted');
    furnaceTrigger.style.display = DISPLAY.BLOCK;
}

/**
 * Fabrica um item se o jogador tiver materiais e nível suficientes.
 * @param {string} itemKey - Chave do item no inventário.
 * @param {Array<{materialKey: string, amount: number}>} costs - Custos em materiais.
 * @param {HTMLElement} rowElement - Linha do item a ocultar após craft.
 * @param {number} requiredLevel - Nível atual exigido para fabricar o upgrade.
 */
export function craftItem(itemKey, costs, rowElement, requiredLevel) {
    if (hasEnoughMaterials(materials, costs) && inventory[itemKey] === requiredLevel) {
        costs.forEach(function (cost) {
            materials[cost.materialKey] -= cost.amount;
        });

        rowElement.style.display = DISPLAY.NONE;
        refreshHud();
        inventory[itemKey]++;

        if (itemKey === INVENTORY_KEYS.FURNACE) {
            placeFurnaceOnIsland();
        }

        if (itemKey === INVENTORY_KEYS.AXE || itemKey === INVENTORY_KEYS.PICKAXE) {
            refreshResourceCursors();
            refreshShopItems();
        }
    }
}

/**
 * Exibe receitas de craft disponíveis com base nos blueprints e níveis.
 */
export function refreshCraftableItems() {
    craftRecipes.forEach(function (recipe) {
        const rowElement = document.querySelector(recipe.rowSelector);
        const canCraft =
            inventory[recipe.blueprintKey] === BLUEPRINT_OWNED &&
            inventory[recipe.itemKey] === recipe.requiredLevel;

        rowElement.style.display = canCraft ? DISPLAY.FLEX : DISPLAY.NONE;
    });
}

/**
 * Abre o modal do crafter e exibe itens fabricáveis.
 */
export function openCrafter() {
    openModal(document.querySelector(SELECTORS.CRAFTER_MODAL));
    refreshCraftableItems();
}

/**
 * Registra os listeners de craft e abertura do crafter.
 */
export function initCrafting() {
    const crafterTrigger = document.querySelector(SELECTORS.CRAFTER_TRIGGER);

    crafterTrigger.addEventListener('click', openCrafter);

    craftRecipes.forEach(function (recipe) {
        const craftButton = document.querySelector(recipe.buttonSelector);
        const rowElement = document.querySelector(recipe.rowSelector);

        craftButton.addEventListener('click', function () {
            craftItem(
                recipe.itemKey,
                recipe.costs,
                rowElement,
                recipe.requiredLevel
            );
        });
    });

    if (inventory[INVENTORY_KEYS.FURNACE] > ITEM_LEVEL_NONE) {
        placeFurnaceOnIsland();
    }
}
