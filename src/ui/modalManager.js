import { SELECTORS, MODAL_OPEN_CLASS, BODY_MODAL_OPEN_CLASS } from '../utils/constants.js';
import { bindTrustedClick } from '../utils/security.js';

/** Referências a todos os modais do jogo. */
let modals = [];

/**
 * Armazena referências aos modais e registra botões de fechar.
 */
export function initModals() {
    modals = [
        SELECTORS.SHOP_MODAL,
        SELECTORS.CRAFTER_MODAL,
        SELECTORS.SETTINGS_MODAL,
        SELECTORS.INVENTORY_MODAL,
        SELECTORS.SELL_MODAL,
        SELECTORS.FURNACE_MODAL,
        SELECTORS.AUTOMATION_MODAL,
    ].map(function (selector) {
        return document.querySelector(selector);
    });

    const closeButtons = document.querySelectorAll(SELECTORS.MODAL_CLOSE);

    closeButtons.forEach(function (button) {
        bindTrustedClick(button, closeActiveModal);
    });
}

/**
 * Exibe um modal na tela, fechando qualquer outro que esteja aberto.
 * @param {HTMLElement} modalElement - Elemento do modal a abrir.
 */
export function openModal(modalElement) {
    closeActiveModal();
    modalElement.classList.add(MODAL_OPEN_CLASS);
    document.body.classList.add(BODY_MODAL_OPEN_CLASS);
}

/**
 * Fecha o modal que estiver aberto no momento.
 */
export function closeActiveModal() {
    modals.forEach(function (modalElement) {
        modalElement.classList.remove(MODAL_OPEN_CLASS);
    });
    document.body.classList.remove(BODY_MODAL_OPEN_CLASS);
}
