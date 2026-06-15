import {
    DISPLAY,
    SELECTORS,
} from '../utils/constants.js';
import { isModalVisible } from '../utils/helpers.js';

/** Referências aos modais do jogo. */
let shopModal;
let crafterModal;
let settingsModal;
let inventoryModal;

/**
 * Armazena referências aos modais e registra botões de fechar.
 */
export function initModals() {
    shopModal = document.querySelector(SELECTORS.SHOP_MODAL);
    crafterModal = document.querySelector(SELECTORS.CRAFTER_MODAL);
    settingsModal = document.querySelector(SELECTORS.SETTINGS_MODAL);
    inventoryModal = document.querySelector(SELECTORS.INVENTORY_MODAL);

    const closeButtons = document.querySelectorAll(SELECTORS.MODAL_CLOSE);

    closeButtons.forEach(function (button) {
        button.addEventListener('click', closeActiveModal);
    });

    const settingsTrigger = document.querySelector(SELECTORS.SETTINGS_TRIGGER);
    settingsTrigger.addEventListener('click', openSettings);
}

/**
 * Exibe um modal na tela.
 * @param {HTMLElement} modalElement - Elemento do modal a abrir.
 */
export function openModal(modalElement) {
    modalElement.style.display = DISPLAY.BLOCK;
}

/**
 * Fecha o modal que estiver aberto no momento.
 */
export function closeActiveModal() {
    if (isModalVisible(shopModal)) {
        shopModal.style.display = DISPLAY.NONE;
    } else if (isModalVisible(crafterModal)) {
        crafterModal.style.display = DISPLAY.NONE;
    } else if (isModalVisible(settingsModal)) {
        settingsModal.style.display = DISPLAY.NONE;
    } else if (isModalVisible(inventoryModal)) {
        inventoryModal.style.display = DISPLAY.NONE;
    }
}

/**
 * Abre o modal de configurações.
 */
export function openSettings() {
    openModal(settingsModal);
}
