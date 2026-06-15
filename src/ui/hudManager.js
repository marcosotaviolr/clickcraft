import { materials } from '../core/state.js';
import { SELECTORS } from '../utils/constants.js';

/** Referências aos elementos de contagem do HUD. */
let woodCountElement;
let coinCountElement;
let stoneCountElement;

/**
 * Armazena referências aos elementos do HUD de materiais.
 */
export function initHud() {
    woodCountElement = document.querySelector(SELECTORS.WOOD_COUNT);
    coinCountElement = document.querySelector(SELECTORS.COIN_COUNT);
    stoneCountElement = document.querySelector(SELECTORS.STONE_COUNT);
}

/**
 * Atualiza os contadores de materiais exibidos no HUD.
 */
export function refreshHud() {
    woodCountElement.innerHTML = materials.wood;
    coinCountElement.innerHTML = materials.coin;
    stoneCountElement.innerHTML = materials.stone;
}
