import { materials, progress } from '../core/state.js';
import { SELECTORS, PLAYER_MAX_LEVEL, getXpRequiredForLevel } from '../utils/constants.js';
import { emitGameStateChanged } from './uiEvents.js';

/** Referências aos elementos de contagem do HUD. */
let woodCountElement;
let coinCountElement;
let stoneCountElement;
let ironCountElement;
let coalCountElement;
let goldCountElement;
let diamondCountElement;
let ironIngotCountElement;
let goldIngotCountElement;
let playerLevelElement;
let xpBarFillElement;
let xpBarLabelElement;
let xpBarElement;
let lastShownLevel = 1;

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
 * Atualiza a barra de XP e o número do nível.
 */
function refreshXpBar() {
    const required = getXpRequiredForLevel(progress.level);
    const atMax = progress.level >= PLAYER_MAX_LEVEL;
    const ratio = atMax ? 1 : required > 0 ? progress.xp / required : 0;

    playerLevelElement.textContent = progress.level;
    xpBarFillElement.style.width = Math.min(100, ratio * 100) + '%';
    xpBarLabelElement.textContent = atMax
        ? 'Nível máximo'
        : progress.xp + ' / ' + required;

    if (progress.level > lastShownLevel) {
        xpBarElement.classList.remove('hud__xp--levelup');
        void xpBarElement.offsetWidth;
        xpBarElement.classList.add('hud__xp--levelup');
    }

    lastShownLevel = progress.level;
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
    diamondCountElement = document.querySelector(SELECTORS.DIAMOND_COUNT);
    ironIngotCountElement = document.querySelector(SELECTORS.IRON_INGOT_COUNT);
    goldIngotCountElement = document.querySelector(SELECTORS.GOLD_INGOT_COUNT);
    playerLevelElement = document.querySelector(SELECTORS.PLAYER_LEVEL);
    xpBarFillElement = document.querySelector(SELECTORS.XP_BAR_FILL);
    xpBarLabelElement = document.querySelector(SELECTORS.XP_BAR_LABEL);
    xpBarElement = document.querySelector(SELECTORS.XP_BAR);
    lastShownLevel = progress.level;

    window.addEventListener('resize', refreshMaterialsPanelLayout);
    refreshMaterialsPanelLayout();
    refreshXpBar();
}

/**
 * Atualiza os contadores de materiais exibidos no HUD.
 */
export function refreshHud() {
    woodCountElement.textContent = materials.wood;
    coinCountElement.textContent = materials.coin;
    stoneCountElement.textContent = materials.stone;
    ironCountElement.textContent = materials.iron;
    coalCountElement.textContent = materials.coal;
    goldCountElement.textContent = materials.gold;
    diamondCountElement.textContent = materials.diamond;
    ironIngotCountElement.textContent = materials.ironIngot;
    goldIngotCountElement.textContent = materials.goldIngot;
    refreshXpBar();

    emitGameStateChanged();
}
