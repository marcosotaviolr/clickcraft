import { materials } from '../core/state.js';
import { SELECTORS } from '../utils/constants.js';

/** Referências aos elementos de contagem do HUD. */
let woodCountElement;
let coinCountElement;
let stoneCountElement;
let ironCountElement;
let coalCountElement;
let goldCountElement;
let ironIngotCountElement;
let goldIngotCountElement;

/**
 * Expande o painel para o lado só se ele invadir o topo da ilha.
 */
export function refreshMaterialsPanelLayout() {
    const panel = document.querySelector(SELECTORS.MATERIALS_PANEL);
    const island = document.querySelector('#initial-island');

    if (!panel || !island) {
        return;
    }

    panel.classList.remove('hud__materials-panel--wide');

    requestAnimationFrame(function () {
        const panelBottom = panel.getBoundingClientRect().bottom;
        const islandTop = island.getBoundingClientRect().top;

        if (panelBottom > islandTop) {
            panel.classList.add('hud__materials-panel--wide');
        }
    });
}

/**
 * Armazena referências aos elementos do HUD de materiais.
 */
export function initHud() {
    woodCountElement = document.querySelector(SELECTORS.WOOD_COUNT);
    coinCountElement = document.querySelector(SELECTORS.COIN_COUNT);
    stoneCountElement = document.querySelector(SELECTORS.STONE_COUNT);
    ironCountElement = document.querySelector(SELECTORS.IRON_COUNT);
    coalCountElement = document.querySelector(SELECTORS.COAL_COUNT);
    goldCountElement = document.querySelector(SELECTORS.GOLD_COUNT);
    ironIngotCountElement = document.querySelector(SELECTORS.IRON_INGOT_COUNT);
    goldIngotCountElement = document.querySelector(SELECTORS.GOLD_INGOT_COUNT);

    window.addEventListener('resize', refreshMaterialsPanelLayout);
    refreshMaterialsPanelLayout();
}

/**
 * Atualiza os contadores de materiais exibidos no HUD.
 */
export function refreshHud() {
    woodCountElement.innerHTML = materials.wood;
    coinCountElement.innerHTML = materials.coin;
    stoneCountElement.innerHTML = materials.stone;
    ironCountElement.innerHTML = materials.iron;
    coalCountElement.innerHTML = materials.coal;
    goldCountElement.innerHTML = materials.gold;
    ironIngotCountElement.innerHTML = materials.ironIngot;
    goldIngotCountElement.innerHTML = materials.goldIngot;
}
