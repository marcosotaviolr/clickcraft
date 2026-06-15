import { inventory, toolLevels } from '../core/state.js';

/**
 * Retorna o nome do nível atual do machado.
 * @returns {string}
 */
export function getAxeLevelName() {
    return toolLevels[inventory.axe];
}

/**
 * Retorna o nome do nível atual da picareta.
 * @returns {string}
 */
export function getPickaxeLevelName() {
    return toolLevels[inventory.pickaxe];
}

/**
 * Retorna o bônus de madeira proporcional ao nível do machado.
 * @returns {number}
 */
export function getAxeWoodBonus() {
    return inventory.axe;
}

/**
 * Retorna o bônus de pedra proporcional ao nível da picareta.
 * @returns {number}
 */
export function getPickaxeStoneBonus() {
    return inventory.pickaxe;
}

/**
 * Verifica se o jogador possui picareta para minerar pedra.
 * @returns {boolean}
 */
export function canMineStone() {
    return inventory.pickaxe >= 1;
}
