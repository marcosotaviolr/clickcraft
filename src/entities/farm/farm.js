import { SELECTORS } from '../../utils/constants.js';
import { bindTrustedClick, HARVEST_COOLDOWN_MS } from '../../utils/security.js';
import { harvestTree } from './tree.js';
import { harvestStone } from './stone.js';
import { harvestIron } from './iron.js';
import { harvestCoal } from './coal.js';
import { harvestGold } from './gold.js';
import { harvestDiamond } from './diamond.js';
import { initSell } from '../../systems/sell.js';
import {
    hasWoodenAxe,
    hasStoneAxe,
    hasIronAxe,
    hasGoldAxe,
    hasDiamondAxe,
    hasWoodenPickaxe,
    hasStonePickaxe,
    hasIronPickaxe,
    hasGoldPickaxe,
    hasDiamondPickaxe,
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
    const diamondElement = document.querySelector(SELECTORS.DIAMOND_RESOURCE);

    treeElement.classList.toggle('has-axe', hasWoodenAxe());
    treeElement.classList.toggle('has-axe-stone', hasStoneAxe());
    treeElement.classList.toggle('has-axe-iron', hasIronAxe());
    treeElement.classList.toggle('has-axe-gold', hasGoldAxe());
    treeElement.classList.toggle('has-axe-diamond', hasDiamondAxe());

    const woodenPickaxe = hasWoodenPickaxe();
    const stonePickaxe = hasStonePickaxe();
    const ironPickaxe = hasIronPickaxe();
    const goldPickaxe = hasGoldPickaxe();
    const diamondPickaxe = hasDiamondPickaxe();

    [stoneElement, ironElement, coalElement, goldElement, diamondElement].forEach(function (element) {
        if (!element) {
            return;
        }

        element.classList.toggle('has-pickaxe', woodenPickaxe);
        element.classList.toggle('has-pickaxe-stone', stonePickaxe);
        element.classList.toggle('has-pickaxe-iron', ironPickaxe);
        element.classList.toggle('has-pickaxe-gold', goldPickaxe);
        element.classList.toggle('has-pickaxe-diamond', diamondPickaxe);
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
    const diamondElement = document.querySelector(SELECTORS.DIAMOND_RESOURCE);

    bindTrustedClick(treeElement, harvestTree, HARVEST_COOLDOWN_MS);
    bindTrustedClick(stoneElement, harvestStone, HARVEST_COOLDOWN_MS);
    bindTrustedClick(ironElement, harvestIron, HARVEST_COOLDOWN_MS);
    bindTrustedClick(coalElement, harvestCoal, HARVEST_COOLDOWN_MS);
    bindTrustedClick(goldElement, harvestGold, HARVEST_COOLDOWN_MS);
    bindTrustedClick(diamondElement, harvestDiamond, HARVEST_COOLDOWN_MS);
    initSell();
    refreshResourceCursors();
}
