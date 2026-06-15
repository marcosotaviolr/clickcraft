import { SELECTORS } from '../utils/constants.js';
import { getAxeLevelName, getPickaxeLevelName } from '../entities/player.js';
import { openModal } from '../ui/modalManager.js';

/**
 * Atualiza os níveis de ferramentas exibidos na mochila.
 */
export function refreshInventoryDisplay() {
    const axeLevelElement = document.querySelector(SELECTORS.AXE_LEVEL);
    const pickaxeLevelElement = document.querySelector(SELECTORS.PICKAXE_LEVEL);

    axeLevelElement.innerHTML = getAxeLevelName();
    pickaxeLevelElement.innerHTML = getPickaxeLevelName();
}

/**
 * Abre o modal da mochila e atualiza os níveis das ferramentas.
 */
export function openInventory() {
    openModal(document.querySelector(SELECTORS.INVENTORY_MODAL));
    refreshInventoryDisplay();
}

/**
 * Registra o listener de abertura da mochila.
 */
export function initInventory() {
    const inventoryTrigger = document.querySelector(SELECTORS.INVENTORY_TRIGGER);

    inventoryTrigger.addEventListener('click', openInventory);
}
