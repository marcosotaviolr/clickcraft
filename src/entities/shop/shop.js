import { materials, inventory, islands } from '../../core/state.js';
import {
    DISPLAY,
    SELECTORS,
    ITEM_LEVEL_NONE,
    INVENTORY_KEYS,
} from '../../utils/constants.js';
import { hasEnoughCoins } from '../../utils/helpers.js';
import { refreshHud } from '../../ui/hudManager.js';
import { openModal } from '../../ui/modalManager.js';
import { shopProducts } from './products.js';
import { refreshIslandMaterialsUi } from '../../systems/map.js';

/**
 * Compra um item na loja se o jogador tiver moedas e nível suficientes.
 * @param {string} itemKey - Chave do item no inventário.
 * @param {number} price - Preço em moedas.
 * @param {HTMLElement} rowElement - Linha do item a ocultar após compra.
 * @param {number} requiredLevel - Nível mínimo exigido para comprar.
 */
export function purchaseItem(itemKey, price, rowElement, requiredLevel) {
    if (hasEnoughCoins(materials, price) && inventory[itemKey] === requiredLevel) {
        materials.coin = materials.coin - price;
        rowElement.style.display = DISPLAY.NONE;
        refreshHud();
        inventory[itemKey]++;
        refreshShopItems();

        if (itemKey === INVENTORY_KEYS.FURNACE_BLUEPRINT) {
            refreshIslandMaterialsUi();
        }
    }
}

/**
 * Verifica se machado e picareta do nível exigido já foram craftados.
 * @param {number} requiredToolsLevel - Nível mínimo das duas ferramentas.
 * @returns {boolean}
 */
function hasRequiredTools(requiredToolsLevel) {
    if (requiredToolsLevel <= ITEM_LEVEL_NONE) {
        return true;
    }

    return (
        inventory[INVENTORY_KEYS.AXE] >= requiredToolsLevel &&
        inventory[INVENTORY_KEYS.PICKAXE] >= requiredToolsLevel
    );
}

/**
 * Atualiza quais produtos da loja devem aparecer.
 */
export function refreshShopItems() {
    shopProducts.forEach(function (product) {
        const rowElement = document.querySelector(product.rowSelector);
        const alreadyOwned = inventory[product.itemKey] > ITEM_LEVEL_NONE;
        const islandLocked = product.requiresIslandSecond && !islands.second;
        const toolsLocked = !hasRequiredTools(product.requiredToolsLevel);

        if (alreadyOwned || islandLocked || toolsLocked) {
            rowElement.style.display = DISPLAY.NONE;
        } else {
            rowElement.style.display = DISPLAY.FLEX;
        }
    });
}

/**
 * Abre o modal da loja.
 */
export function openShop() {
    openModal(document.querySelector(SELECTORS.SHOP_MODAL));
    refreshShopItems();
}

/**
 * Registra os listeners de compra e abertura da loja.
 */
export function initShop() {
    const shopTrigger = document.querySelector(SELECTORS.SHOP_TRIGGER);

    shopTrigger.addEventListener('click', openShop);

    shopProducts.forEach(function (product) {
        const buyButton = document.querySelector(product.buttonSelector);
        const rowElement = document.querySelector(product.rowSelector);

        buyButton.addEventListener('click', function () {
            purchaseItem(product.itemKey, product.price, rowElement, product.requiredLevel);
        });
    });

    refreshShopItems();
}
