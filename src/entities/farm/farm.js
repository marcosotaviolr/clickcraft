import { SELECTORS } from '../../utils/constants.js';
import { harvestTree } from './tree.js';
import { harvestStone } from './stone.js';
import { harvestIron } from './iron.js';
import { harvestCoal } from './coal.js';
import { harvestGold } from './gold.js';
import { initSell } from '../../systems/sell.js';
import {
    hasWoodenAxe,
    hasStoneAxe,
    hasIronAxe,
    hasGoldAxe,
    hasWoodenPickaxe,
    hasStonePickaxe,
    hasIronPickaxe,
    hasGoldPickaxe,
} from '../player.js';

/**
 * Atualiza o cursor da árvore e dos minérios conforme as ferramentas.
 */
export function refreshResourceCursors() {
    const treeElement = document.querySelector(SELECTORS.TREE_RESOURCE);
    const stoneElement = document.querySelector(SELECTORS.STONE_RESOURCE);
    const ironElement = document.querySelector(SELECTORS.IRON_RESOURCE);
    const coalElement = document.querySelector(SELECTORS.COAL_RESOURCE);
    const goldElement = document.querySelector(SELECTORS.GOLD_RESOURCE);

    treeElement.classList.toggle('has-axe', hasWoodenAxe());
    treeElement.classList.toggle('has-axe-stone', hasStoneAxe());
    treeElement.classList.toggle('has-axe-iron', hasIronAxe());
    treeElement.classList.toggle('has-axe-gold', hasGoldAxe());

    const woodenPickaxe = hasWoodenPickaxe();
    const stonePickaxe = hasStonePickaxe();
    const ironPickaxe = hasIronPickaxe();
    const goldPickaxe = hasGoldPickaxe();

    [stoneElement, ironElement, coalElement, goldElement].forEach(function (element) {
        if (!element) {
            return;
        }

        element.classList.toggle('has-pickaxe', woodenPickaxe);
        element.classList.toggle('has-pickaxe-stone', stonePickaxe);
        element.classList.toggle('has-pickaxe-iron', ironPickaxe);
        element.classList.toggle('has-pickaxe-gold', goldPickaxe);
    });
}

/**
 * Registra os listeners de clique nos recursos da fazenda.
 */
export function initFarm() {
    const treeElement = document.querySelector(SELECTORS.TREE_RESOURCE);
    const stoneElement = document.querySelector(SELECTORS.STONE_RESOURCE);
    const ironElement = document.querySelector(SELECTORS.IRON_RESOURCE);
    const coalElement = document.querySelector(SELECTORS.COAL_RESOURCE);
    const goldElement = document.querySelector(SELECTORS.GOLD_RESOURCE);

    treeElement.addEventListener('click', harvestTree);
    stoneElement.addEventListener('click', harvestStone);
    ironElement.addEventListener('click', harvestIron);
    coalElement.addEventListener('click', harvestCoal);
    goldElement.addEventListener('click', harvestGold);
    initSell();
    refreshResourceCursors();
}
