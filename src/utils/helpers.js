import { MODAL_OPEN_CLASS } from './constants.js';

/**
 * Verifica se um modal está visível na tela.
 * @param {HTMLElement} modalElement - Elemento do modal.
 * @returns {boolean}
 */
export function isModalVisible(modalElement) {
    return modalElement.classList.contains(MODAL_OPEN_CLASS);
}
