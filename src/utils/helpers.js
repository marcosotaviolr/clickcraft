import { DISPLAY } from './constants.js';

/**
 * Verifica se um modal está visível na tela.
 * @param {HTMLElement} modalElement - Elemento do modal.
 * @returns {boolean}
 */
export function isModalVisible(modalElement) {
    return modalElement.style.display === DISPLAY.BLOCK;
}

/**
 * Verifica se o jogador possui moedas suficientes para uma compra.
 * @param {Object} materials - Estado de materiais do jogador.
 * @param {number} price - Preço do item.
 * @returns {boolean}
 */
export function hasEnoughCoins(materials, price) {
    return materials.coin >= price;
}

/**
 * Verifica se o jogador possui quantidade suficiente de um material.
 * @param {Object} materials - Estado de materiais do jogador.
 * @param {string} materialKey - Chave do material.
 * @param {number} cost - Custo necessário.
 * @returns {boolean}
 */
export function hasEnoughMaterial(materials, materialKey, cost) {
    return materials[materialKey] >= cost;
}
