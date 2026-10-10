import { resetGameState } from '../core/state.js';
import { SELECTORS, SELL_PRICES, ISLAND_PRICES } from '../utils/constants.js';
import { deepFreeze } from '../utils/freeze.js';
import { bindTrustedClick } from '../utils/security.js';
import { openModal } from '../ui/modalManager.js';
import { refreshHud } from '../ui/hudManager.js';
import { setClickPopupEnabled, isClickPopupEnabled } from '../ui/clickPopup.js';
import { refreshResourceCursors } from '../entities/farm/farm.js';
import { refreshShopItems } from '../entities/shop/shop.js';
import { refreshCraftableItems, resetFurnacePlacement } from './crafting.js';
import { refreshInventoryDisplay } from './inventory.js';
import { refreshIslandLocks } from './map.js';
import { resetFurnace } from './furnace.js';
import { refreshSellModal } from './sell.js';
import { refreshAutomationShop, refreshWorldAutomators } from './automation.js';

/** Materiais listados na tabela de preços de venda. */
const PRICE_TABLE = deepFreeze([
    { name: 'Madeira', icon: 'assets/img/iconwood.png', price: SELL_PRICES.WOOD },
    { name: 'Pedra', icon: 'assets/img/iconstone.png', price: SELL_PRICES.STONE },
    { name: 'Carvão', icon: 'assets/img/iconcarvao.png', price: SELL_PRICES.COAL },
    { name: 'Ferro', icon: 'assets/img/iconferro.png', price: SELL_PRICES.IRON },
    { name: 'Ouro', icon: 'assets/img/iconouro.png', price: SELL_PRICES.GOLD },
    { name: 'Diamante', icon: 'assets/img/icondiamante.png', price: SELL_PRICES.DIAMOND },
]);

/** Tempo até o botão de reiniciar voltar ao estado normal. */
const RESET_CONFIRM_TIMEOUT_MS = 4000;

let resetArmed = false;
let resetTimerId = null;

/**
 * Monta a tabela de preços de venda a partir do balanceamento atual.
 */
function renderPriceTable() {
    const container = document.querySelector(SELECTORS.SETTINGS_PRICE_TABLE);
    container.textContent = '';

    PRICE_TABLE.forEach(function (entry) {
        const row = document.createElement('div');
        row.className = 'price-row';

        const icon = document.createElement('img');
        icon.className = 'price-row__icon';
        icon.src = entry.icon;
        icon.alt = entry.name;

        const name = document.createElement('span');
        name.className = 'price-row__name';
        name.textContent = entry.name;

        const value = document.createElement('span');
        value.className = 'price-row__value';
        value.textContent = entry.price;

        const coin = document.createElement('img');
        coin.className = 'price-row__coin';
        coin.src = 'assets/img/coin.png';
        coin.alt = 'moedas';

        value.appendChild(coin);
        row.append(icon, name, value);
        container.appendChild(row);
    });
}

/**
 * Preenche os preços das ilhas nos textos de progressão.
 */
function renderIslandPrices() {
    const secondPrice = document.querySelector('#settings-island-second-price');
    const thirdPrice = document.querySelector('#settings-island-third-price');

    secondPrice.textContent = ISLAND_PRICES.SECOND;
    thirdPrice.textContent = ISLAND_PRICES.THIRD;
}

/**
 * Reflete no botão o estado atual da preferência de popups.
 */
function renderPopupToggle() {
    const toggle = document.querySelector(SELECTORS.SETTINGS_POPUP_TOGGLE);
    const enabled = isClickPopupEnabled();

    toggle.textContent = enabled ? 'Ativado' : 'Desativado';
    toggle.classList.toggle('toggle--on', enabled);
    toggle.setAttribute('aria-pressed', String(enabled));
}

/**
 * Devolve o botão de reiniciar ao estado inicial.
 */
function disarmReset() {
    const button = document.querySelector(SELECTORS.SETTINGS_RESET_BUTTON);

    resetArmed = false;
    clearTimeout(resetTimerId);
    button.textContent = 'Reiniciar progresso';
    button.classList.remove('btn--confirm');
}

/**
 * Zera o jogo e devolve toda a interface ao estado inicial.
 */
function performReset() {
    resetFurnace();
    resetGameState();
    resetFurnacePlacement();
    refreshHud();
    refreshResourceCursors();
    refreshShopItems();
    refreshCraftableItems();
    refreshInventoryDisplay();
    refreshIslandLocks();
    refreshSellModal();
    refreshAutomationShop();
    refreshWorldAutomators();
}

/**
 * Primeiro clique arma o botão, segundo confirma o reinício.
 */
function handleResetClick() {
    if (resetArmed) {
        performReset();
        disarmReset();
        return;
    }

    const button = document.querySelector(SELECTORS.SETTINGS_RESET_BUTTON);

    resetArmed = true;
    button.textContent = 'Confirmar?';
    button.classList.add('btn--confirm');

    clearTimeout(resetTimerId);
    resetTimerId = setTimeout(disarmReset, RESET_CONFIRM_TIMEOUT_MS);
}

/**
 * Abre o modal de configurações com os dados atualizados.
 */
export function openSettings() {
    openModal(document.querySelector(SELECTORS.SETTINGS_MODAL));
    renderPriceTable();
    renderIslandPrices();
    renderPopupToggle();
    disarmReset();
}

/**
 * Registra os controles do modal de configurações.
 */
export function initSettings() {
    bindTrustedClick(document.querySelector(SELECTORS.SETTINGS_TRIGGER), openSettings);

    bindTrustedClick(document.querySelector(SELECTORS.SETTINGS_POPUP_TOGGLE), function () {
        setClickPopupEnabled(!isClickPopupEnabled());
        renderPopupToggle();
    });

    bindTrustedClick(
        document.querySelector(SELECTORS.SETTINGS_RESET_BUTTON),
        handleResetClick
    );
}
