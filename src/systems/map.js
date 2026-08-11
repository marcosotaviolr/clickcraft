import { materials, islands, inventory } from '../core/state.js';
import {
    DISPLAY,
    SELECTORS,
    ISLAND_PRICES,
    BLUEPRINT_OWNED,
    INVENTORY_KEYS,
} from '../utils/constants.js';
import { hasEnoughCoins } from '../utils/helpers.js';
import { refreshHud, refreshMaterialsPanelLayout } from '../ui/hudManager.js';
import { refreshShopItems } from '../entities/shop/shop.js';

/**
 * Retorna o elemento container do mapa de ilhas.
 * @returns {HTMLElement|null}
 */
export function getIslandMapElement() {
    return document.querySelector(SELECTORS.ISLAND_MAP);
}

/**
 * Mostra ou esconde materiais avançados no HUD e no modal de venda.
 */
export function refreshIslandMaterialsUi() {
    const ironCounter = document.querySelector(SELECTORS.IRON_COUNTER);
    const coalCounter = document.querySelector(SELECTORS.COAL_COUNTER);
    const goldCounter = document.querySelector(SELECTORS.GOLD_COUNTER);
    const ironIngotCounter = document.querySelector(SELECTORS.IRON_INGOT_COUNTER);
    const goldIngotCounter = document.querySelector(SELECTORS.GOLD_INGOT_COUNTER);
    const ironSellRow = document.querySelector(SELECTORS.SELL_IRON_ROW);
    const coalSellRow = document.querySelector(SELECTORS.SELL_COAL_ROW);
    const goldSellRow = document.querySelector(SELECTORS.SELL_GOLD_ROW);
    const islandVisibility = islands.second ? DISPLAY.FLEX : DISPLAY.NONE;
    const hasFurnaceBlueprint =
        inventory[INVENTORY_KEYS.FURNACE_BLUEPRINT] >= BLUEPRINT_OWNED;
    const ingotVisibility = hasFurnaceBlueprint ? DISPLAY.FLEX : DISPLAY.NONE;

    ironCounter.style.display = islandVisibility;
    coalCounter.style.display = islandVisibility;
    goldCounter.style.display = islandVisibility;
    ironSellRow.style.display = islandVisibility;
    coalSellRow.style.display = islandVisibility;
    goldSellRow.style.display = islandVisibility;
    ironIngotCounter.style.display = ingotVisibility;
    goldIngotCounter.style.display = ingotVisibility;
    refreshMaterialsPanelLayout();
}

/**
 * Desbloqueia a Ilha 2 se o jogador tiver moedas suficientes.
 */
export function unlockIslandSecond() {
    if (islands.second || !hasEnoughCoins(materials, ISLAND_PRICES.SECOND)) {
        return;
    }

    materials.coin -= ISLAND_PRICES.SECOND;
    islands.second = true;
    refreshHud();
    refreshIslandLocks();
    refreshShopItems();
}

/**
 * Desbloqueia a Ilha 3 se o jogador tiver moedas suficientes.
 */
export function unlockIslandThird() {
    if (islands.third || !hasEnoughCoins(materials, ISLAND_PRICES.THIRD)) {
        return;
    }

    materials.coin -= ISLAND_PRICES.THIRD;
    islands.third = true;
    refreshHud();
    refreshIslandLocks();
}

/**
 * Atualiza a exibição das travas e recursos das ilhas.
 */
export function refreshIslandLocks() {
    const secondLock = document.querySelector(SELECTORS.ISLAND_SECOND_LOCK);
    const secondResources = document.querySelector(SELECTORS.ISLAND_SECOND_RESOURCES);
    const thirdLock = document.querySelector(SELECTORS.ISLAND_THIRD_LOCK);

    if (islands.second) {
        secondLock.style.display = DISPLAY.NONE;
        secondResources.style.display = DISPLAY.BLOCK;
    } else {
        secondLock.style.display = DISPLAY.FLEX;
        secondResources.style.display = DISPLAY.NONE;
    }

    if (islands.third) {
        thirdLock.style.display = DISPLAY.NONE;
    } else {
        thirdLock.style.display = DISPLAY.FLEX;
    }

    refreshIslandMaterialsUi();
}

/**
 * Registra os botões de desbloqueio das ilhas.
 */
export function initMap() {
    document
        .querySelector(SELECTORS.UNLOCK_ISLAND_SECOND)
        .addEventListener('click', unlockIslandSecond);

    document
        .querySelector(SELECTORS.UNLOCK_ISLAND_THIRD)
        .addEventListener('click', unlockIslandThird);

    refreshIslandLocks();
}
