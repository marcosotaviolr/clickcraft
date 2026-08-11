import { inventory, toolLevels } from '../core/state.js';
import {
    ITEM_LEVEL_WOOD,
    ITEM_LEVEL_STONE,
    ITEM_LEVEL_IRON,
    ITEM_LEVEL_GOLD,
} from '../utils/constants.js';

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
 * Retorna a quantidade de madeira coletada por clique.
 * Sem: 1 | Madeira: 2 | Pedra: 3 | Ferro: 4 | Ouro: 5
 * @returns {number}
 */
export function getWoodHarvestAmount() {
    if (inventory.axe >= ITEM_LEVEL_GOLD) {
        return 5;
    }

    if (inventory.axe >= ITEM_LEVEL_IRON) {
        return 4;
    }

    if (inventory.axe >= ITEM_LEVEL_STONE) {
        return 3;
    }

    if (inventory.axe >= ITEM_LEVEL_WOOD) {
        return 2;
    }

    return 1;
}

/**
 * Retorna a quantidade de pedra coletada por clique.
 * Madeira: 1 | Pedra: 2 | Ferro: 3 | Ouro: 4
 * @returns {number}
 */
export function getStoneHarvestAmount() {
    if (inventory.pickaxe >= ITEM_LEVEL_GOLD) {
        return 4;
    }

    if (inventory.pickaxe >= ITEM_LEVEL_IRON) {
        return 3;
    }

    if (inventory.pickaxe >= ITEM_LEVEL_STONE) {
        return 2;
    }

    if (inventory.pickaxe >= ITEM_LEVEL_WOOD) {
        return 1;
    }

    return 0;
}

/**
 * Verifica se o jogador possui picareta para minerar pedra.
 * @returns {boolean}
 */
export function canMineStone() {
    return inventory.pickaxe >= ITEM_LEVEL_WOOD;
}

/**
 * Verifica se o jogador possui picareta de pedra para minerar ferro/carvão.
 * @returns {boolean}
 */
export function canMineOre() {
    return inventory.pickaxe >= ITEM_LEVEL_STONE;
}

/**
 * Verifica se o jogador possui picareta de ferro (ou superior) para minerar ouro.
 * @returns {boolean}
 */
export function canMineGold() {
    return inventory.pickaxe >= ITEM_LEVEL_IRON;
}

/**
 * Quantidade de ferro por clique.
 * Pedra/Ferro: 1 | Ouro: 2
 * @returns {number}
 */
export function getIronHarvestAmount() {
    if (!canMineOre()) {
        return 0;
    }

    if (inventory.pickaxe >= ITEM_LEVEL_GOLD) {
        return 2;
    }

    return 1;
}

/**
 * Quantidade de carvão por clique.
 * Pedra: 1 | Ferro/Ouro: 2
 * @returns {number}
 */
export function getCoalHarvestAmount() {
    if (!canMineOre()) {
        return 0;
    }

    if (inventory.pickaxe >= ITEM_LEVEL_IRON) {
        return 2;
    }

    return 1;
}

/**
 * Verifica se o jogador possui machado de madeira.
 * @returns {boolean}
 */
export function hasWoodenAxe() {
    return inventory.axe === ITEM_LEVEL_WOOD;
}

/**
 * Verifica se o jogador possui machado de pedra.
 * @returns {boolean}
 */
export function hasStoneAxe() {
    return inventory.axe === ITEM_LEVEL_STONE;
}

/**
 * Verifica se o jogador possui machado de ferro.
 * @returns {boolean}
 */
export function hasIronAxe() {
    return inventory.axe === ITEM_LEVEL_IRON;
}

/**
 * Verifica se o jogador possui machado de ouro.
 * @returns {boolean}
 */
export function hasGoldAxe() {
    return inventory.axe >= ITEM_LEVEL_GOLD;
}

/**
 * Verifica se o jogador possui picareta de madeira.
 * @returns {boolean}
 */
export function hasWoodenPickaxe() {
    return inventory.pickaxe === ITEM_LEVEL_WOOD;
}

/**
 * Verifica se o jogador possui picareta de pedra.
 * @returns {boolean}
 */
export function hasStonePickaxe() {
    return inventory.pickaxe === ITEM_LEVEL_STONE;
}

/**
 * Verifica se o jogador possui picareta de ferro.
 * @returns {boolean}
 */
export function hasIronPickaxe() {
    return inventory.pickaxe === ITEM_LEVEL_IRON;
}

/**
 * Verifica se o jogador possui picareta de ouro.
 * @returns {boolean}
 */
export function hasGoldPickaxe() {
    return inventory.pickaxe >= ITEM_LEVEL_GOLD;
}

/**
 * Verifica se o jogador possui machado.
 * @returns {boolean}
 */
export function hasAxe() {
    return inventory.axe >= ITEM_LEVEL_WOOD;
}

/**
 * Verifica se o jogador possui picareta.
 * @returns {boolean}
 */
export function hasPickaxe() {
    return inventory.pickaxe >= ITEM_LEVEL_WOOD;
}
