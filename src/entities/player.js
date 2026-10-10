import { inventory } from '../core/state.js';
import {
    MATERIAL_KEYS,
    ITEM_LEVEL_WOOD,
    ITEM_LEVEL_STONE,
    ITEM_LEVEL_IRON,
    ITEM_LEVEL_GOLD,
    ITEM_LEVEL_DIAMOND,
} from '../utils/constants.js';

/**
 * Nível do machado atualmente equipado.
 * Pode ser menor que o nível já fabricado, se o jogador trocou na mochila.
 * @returns {number}
 */
export function getEquippedAxeLevel() {
    return inventory.equippedAxe;
}

/**
 * Nível da picareta atualmente equipada.
 * @returns {number}
 */
export function getEquippedPickaxeLevel() {
    return inventory.equippedPickaxe;
}

/**
 * Retorna a quantidade de madeira coletada por clique.
 * Sem: 1 | Madeira: 2 | Pedra: 3 | Ferro: 4 | Ouro: 5 | Diamante: 6
 * @returns {number}
 */
export function getWoodHarvestAmount() {
    const level = getEquippedAxeLevel();

    if (level >= ITEM_LEVEL_DIAMOND) {
        return 6;
    }

    if (level >= ITEM_LEVEL_GOLD) {
        return 5;
    }

    if (level >= ITEM_LEVEL_IRON) {
        return 4;
    }

    if (level >= ITEM_LEVEL_STONE) {
        return 3;
    }

    if (level >= ITEM_LEVEL_WOOD) {
        return 2;
    }

    return 1;
}

/**
 * Quantidade por clique de um minério: 1 no nível que libera e +1 a cada
 * picareta acima disso.
 * @param {number} unlockLevel - Nível mínimo da picareta para minerar.
 * @returns {number}
 */
function getOreHarvestAmount(unlockLevel) {
    const level = getEquippedPickaxeLevel();

    if (level < unlockLevel) {
        return 0;
    }

    return level - unlockLevel + 1;
}

/**
 * Retorna a quantidade de pedra coletada por clique.
 * Madeira: 1 | Pedra: 2 | Ferro: 3 | Ouro: 4 | Diamante: 5
 * @returns {number}
 */
export function getStoneHarvestAmount() {
    return getOreHarvestAmount(ITEM_LEVEL_WOOD);
}

/**
 * Verifica se a picareta equipada permite minerar pedra.
 * @returns {boolean}
 */
export function canMineStone() {
    return getEquippedPickaxeLevel() >= ITEM_LEVEL_WOOD;
}

/**
 * Verifica se a picareta equipada permite minerar ferro e carvão.
 * @returns {boolean}
 */
export function canMineOre() {
    return getEquippedPickaxeLevel() >= ITEM_LEVEL_STONE;
}

/**
 * Verifica se a picareta equipada permite minerar ouro.
 * @returns {boolean}
 */
export function canMineGold() {
    return getEquippedPickaxeLevel() >= ITEM_LEVEL_IRON;
}

/**
 * Quantidade de ferro por clique.
 * Pedra: 1 | Ferro: 2 | Ouro: 3 | Diamante: 4
 * @returns {number}
 */
export function getIronHarvestAmount() {
    return getOreHarvestAmount(ITEM_LEVEL_STONE);
}

/**
 * Quantidade de carvão por clique.
 * Pedra: 1 | Ferro: 2 | Ouro: 3 | Diamante: 4
 * @returns {number}
 */
export function getCoalHarvestAmount() {
    return getOreHarvestAmount(ITEM_LEVEL_STONE);
}

/**
 * Quantidade de ouro por clique.
 * Ferro: 1 | Ouro: 2 | Diamante: 3
 * @returns {number}
 */
export function getGoldHarvestAmount() {
    return getOreHarvestAmount(ITEM_LEVEL_IRON);
}

/**
 * Verifica se a picareta equipada permite minerar diamante.
 * @returns {boolean}
 */
export function canMineDiamond() {
    return getEquippedPickaxeLevel() >= ITEM_LEVEL_GOLD;
}

/**
 * Quantidade de diamante por clique.
 * Ouro: 1 | Diamante: 2
 * @returns {number}
 */
export function getDiamondHarvestAmount() {
    return getOreHarvestAmount(ITEM_LEVEL_GOLD);
}

/**
 * Quantidade que as ferramentas já fabricadas coletariam por clique.
 * Usado pelos autômatos, que não dependem do que está equipado.
 * @param {string} materialKey - Chave do material.
 * @returns {number}
 */
export function getOwnedHarvestAmount(materialKey) {
    if (materialKey === MATERIAL_KEYS.WOOD) {
        return inventory.axe + 1;
    }

    const unlockLevels = {
        [MATERIAL_KEYS.STONE]: ITEM_LEVEL_WOOD,
        [MATERIAL_KEYS.IRON]: ITEM_LEVEL_STONE,
        [MATERIAL_KEYS.COAL]: ITEM_LEVEL_STONE,
        [MATERIAL_KEYS.GOLD]: ITEM_LEVEL_IRON,
        [MATERIAL_KEYS.DIAMOND]: ITEM_LEVEL_GOLD,
    };
    const unlockLevel = unlockLevels[materialKey];

    if (!unlockLevel) {
        return 0;
    }

    const level = inventory.pickaxe;

    if (level < unlockLevel) {
        return 0;
    }

    return level - unlockLevel + 1;
}

/**
 * Verifica se o machado de madeira está equipado.
 * @returns {boolean}
 */
export function hasWoodenAxe() {
    return getEquippedAxeLevel() === ITEM_LEVEL_WOOD;
}

/**
 * Verifica se o machado de pedra está equipado.
 * @returns {boolean}
 */
export function hasStoneAxe() {
    return getEquippedAxeLevel() === ITEM_LEVEL_STONE;
}

/**
 * Verifica se o machado de ferro está equipado.
 * @returns {boolean}
 */
export function hasIronAxe() {
    return getEquippedAxeLevel() === ITEM_LEVEL_IRON;
}

/**
 * Verifica se o machado de ouro está equipado.
 * @returns {boolean}
 */
export function hasGoldAxe() {
    return getEquippedAxeLevel() === ITEM_LEVEL_GOLD;
}

/**
 * Verifica se o machado de diamante está equipado.
 * @returns {boolean}
 */
export function hasDiamondAxe() {
    return getEquippedAxeLevel() === ITEM_LEVEL_DIAMOND;
}

/**
 * Verifica se a picareta de madeira está equipada.
 * @returns {boolean}
 */
export function hasWoodenPickaxe() {
    return getEquippedPickaxeLevel() === ITEM_LEVEL_WOOD;
}

/**
 * Verifica se a picareta de pedra está equipada.
 * @returns {boolean}
 */
export function hasStonePickaxe() {
    return getEquippedPickaxeLevel() === ITEM_LEVEL_STONE;
}

/**
 * Verifica se a picareta de ferro está equipada.
 * @returns {boolean}
 */
export function hasIronPickaxe() {
    return getEquippedPickaxeLevel() === ITEM_LEVEL_IRON;
}

/**
 * Verifica se a picareta de ouro está equipada.
 * @returns {boolean}
 */
export function hasGoldPickaxe() {
    return getEquippedPickaxeLevel() === ITEM_LEVEL_GOLD;
}

/**
 * Verifica se a picareta de diamante está equipada.
 * @returns {boolean}
 */
export function hasDiamondPickaxe() {
    return getEquippedPickaxeLevel() === ITEM_LEVEL_DIAMOND;
}
