import { materials, inventory } from '../core/state.js';
import {
    DISPLAY,
    SELECTORS,
    BLUEPRINT_OWNED,
    ITEM_LEVEL_NONE,
} from '../utils/constants.js';
import { hasEnoughMaterial } from '../utils/helpers.js';
import { refreshHud } from '../ui/hudManager.js';
import { openModal } from '../ui/modalManager.js';
import { craftRecipes } from '../entities/shop/recipes.js';

/**
 * Fabrica um item se o jogador tiver materiais e nível suficientes.
 * @param {string} itemKey - Chave do item no inventário.
 * @param {number} cost - Custo em material.
 * @param {string} materialKey - Chave do material consumido.
 * @param {HTMLElement} rowElement - Linha do item a ocultar após craft.
 * @param {number} requiredLevel - Nível mínimo exigido para fabricar.
 */
export function craftItem(itemKey, cost, materialKey, rowElement, requiredLevel) {
    if (hasEnoughMaterial(materials, materialKey, cost) && inventory[itemKey] === requiredLevel) {
        materials[materialKey] -= cost;
        rowElement.style.display = DISPLAY.NONE;
        refreshHud();
        inventory[itemKey]++;
    }
}

/**
 * Exibe receitas de craft disponíveis com base nos blueprints possuídos.
 */
export function refreshCraftableItems() {
    craftRecipes.forEach(function (recipe) {
        const rowElement = document.querySelector(recipe.rowSelector);

        if (
            inventory[recipe.blueprintKey] === BLUEPRINT_OWNED &&
            inventory[recipe.itemKey] === ITEM_LEVEL_NONE
        ) {
            rowElement.style.display = DISPLAY.FLEX;
        }
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
                recipe.cost,
                recipe.materialKey,
                rowElement,
                recipe.requiredLevel
            );
        });
    });
}
