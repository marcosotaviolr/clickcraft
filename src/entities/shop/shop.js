import { materials, inventory } from '../../core/state.js';
import {
    DISPLAY,
    SELECTORS,
} from '../../utils/constants.js';
import { hasEnoughCoins } from '../../utils/helpers.js';
import { refreshHud } from '../../ui/hudManager.js';
import { openModal } from '../../ui/modalManager.js';
import { shopProducts } from './products.js';

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
    }
}

/**
 * Abre o modal da loja.
 */
export function openShop() {
    openModal(document.querySelector(SELECTORS.SHOP_MODAL));
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
}
