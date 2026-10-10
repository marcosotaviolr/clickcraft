import {
    islands,
    inventory,
    canAfford,
    spendMaterials,
    unlockIsland,
} from '../core/state.js';
import {
    DISPLAY,
    SELECTORS,
    ISLAND_PRICES,
    BLUEPRINT_OWNED,
    INVENTORY_KEYS,
    ISLAND_KEYS,
    MATERIAL_KEYS,
} from '../utils/constants.js';
import { bindTrustedClick } from '../utils/security.js';
import { setButtonAvailability } from '../ui/dom.js';
import { onGameStateChanged } from '../ui/uiEvents.js';
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
    const diamondCounter = document.querySelector(SELECTORS.DIAMOND_COUNTER);
    const ironIngotCounter = document.querySelector(SELECTORS.IRON_INGOT_COUNTER);
    const goldIngotCounter = document.querySelector(SELECTORS.GOLD_INGOT_COUNTER);
    const ironSellRow = document.querySelector(SELECTORS.SELL_IRON_ROW);
    const coalSellRow = document.querySelector(SELECTORS.SELL_COAL_ROW);
    const goldSellRow = document.querySelector(SELECTORS.SELL_GOLD_ROW);
    const diamondSellRow = document.querySelector(SELECTORS.SELL_DIAMOND_ROW);
    const islandVisibility = islands.second ? DISPLAY.FLEX : DISPLAY.NONE;
    const hasFurnaceBlueprint =
        inventory[INVENTORY_KEYS.FURNACE_BLUEPRINT] >= BLUEPRINT_OWNED;
    const ingotVisibility = hasFurnaceBlueprint ? DISPLAY.FLEX : DISPLAY.NONE;

    ironCounter.style.display = islandVisibility;
    coalCounter.style.display = islandVisibility;
    goldCounter.style.display = islandVisibility;
    diamondCounter.style.display = islandVisibility;
    ironSellRow.style.display = islandVisibility;
    coalSellRow.style.display = islandVisibility;
    goldSellRow.style.display = islandVisibility;
    if (diamondSellRow) {
        diamondSellRow.style.display = islandVisibility;
    }
    ironIngotCounter.style.display = ingotVisibility;
    goldIngotCounter.style.display = ingotVisibility;
    refreshMaterialsPanelLayout();
}

/**
 * Pinta os botões de liberar ilha conforme o saldo de moedas.
 * A Ilha 3 só fica verde depois que a Ilha 2 já foi liberada.
 */
export function refreshIslandButtons() {
    const secondCost = [{ materialKey: MATERIAL_KEYS.COIN, amount: ISLAND_PRICES.SECOND }];
    const thirdCost = [{ materialKey: MATERIAL_KEYS.COIN, amount: ISLAND_PRICES.THIRD }];

    setButtonAvailability(
        document.querySelector(SELECTORS.UNLOCK_ISLAND_SECOND),
        !islands.second && canAfford(secondCost)
    );

    setButtonAvailability(
        document.querySelector(SELECTORS.UNLOCK_ISLAND_THIRD),
        islands.second && !islands.third && canAfford(thirdCost)
    );
}

/**
 * Desbloqueia a Ilha 2 se o jogador tiver moedas suficientes.
 */
export function unlockIslandSecond() {
    if (islands.second) {
        return;
    }

    const cost = [{ materialKey: MATERIAL_KEYS.COIN, amount: ISLAND_PRICES.SECOND }];

    if (!spendMaterials(cost)) {
        return;
    }

    unlockIsland(ISLAND_KEYS.SECOND);
    refreshHud();
    refreshIslandLocks();
    refreshShopItems();
}

/**
 * Desbloqueia a Ilha 3 se a Ilha 2 já estiver liberada e houver moedas.
 */
export function unlockIslandThird() {
    if (islands.third || !islands.second) {
        return;
    }

    const cost = [{ materialKey: MATERIAL_KEYS.COIN, amount: ISLAND_PRICES.THIRD }];

    if (!spendMaterials(cost)) {
        return;
    }

    unlockIsland(ISLAND_KEYS.THIRD);
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
    const thirdResources = document.querySelector(SELECTORS.ISLAND_THIRD_RESOURCES);

    if (islands.second) {
        secondLock.style.display = DISPLAY.NONE;
        secondResources.style.display = DISPLAY.BLOCK;
    } else {
        secondLock.style.display = DISPLAY.FLEX;
        secondResources.style.display = DISPLAY.NONE;
    }

    if (islands.third) {
        thirdLock.style.display = DISPLAY.NONE;
        thirdResources.style.display = DISPLAY.BLOCK;
    } else {
        thirdLock.style.display = DISPLAY.FLEX;
        thirdResources.style.display = DISPLAY.NONE;
    }

    refreshIslandMaterialsUi();
    refreshIslandButtons();
}

/**
 * Registra os botões de desbloqueio das ilhas.
 */
export function initMap() {
    bindTrustedClick(
        document.querySelector(SELECTORS.UNLOCK_ISLAND_SECOND),
        unlockIslandSecond
    );

    bindTrustedClick(
        document.querySelector(SELECTORS.UNLOCK_ISLAND_THIRD),
        unlockIslandThird
    );

    document.querySelector(SELECTORS.ISLAND_SECOND_PRICE).textContent =
        ISLAND_PRICES.SECOND;
    document.querySelector(SELECTORS.ISLAND_THIRD_PRICE).textContent =
        ISLAND_PRICES.THIRD;

    onGameStateChanged(refreshIslandButtons);
    refreshIslandLocks();
}
