import { SELECTORS } from '../../utils/constants.js';
import { harvestTree } from './tree.js';
import { harvestStone } from './stone.js';
import { initSell } from '../../systems/sell.js';

/**
 * Registra os listeners de clique nos recursos da fazenda.
 */
export function initFarm() {
    const treeElement = document.querySelector(SELECTORS.TREE_RESOURCE);
    const stoneElement = document.querySelector(SELECTORS.STONE_RESOURCE);

    treeElement.addEventListener('click', harvestTree);
    stoneElement.addEventListener('click', harvestStone);
    initSell();
}
