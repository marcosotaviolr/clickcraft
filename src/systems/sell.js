import { materials, islands, addMaterial, spendMaterials } from '../core/state.js';
import { DISPLAY, MATERIAL_KEYS, SELECTORS, SELL_PRICES } from '../utils/constants.js';
import { deepFreeze } from '../utils/freeze.js';
import { isModalVisible } from '../utils/helpers.js';
import { bindTrustedClick } from '../utils/security.js';
import { getMaterialInfo } from '../entities/materials.js';
import {
    createElement,
    createImage,
    setButtonAvailability,
} from '../ui/dom.js';
import { onGameStateChanged } from '../ui/uiEvents.js';
import { refreshHud } from '../ui/hudManager.js';
import { openModal } from '../ui/modalManager.js';

/** Materiais que podem ser vendidos, na ordem exibida. */
const sellItems = deepFreeze([
    {
        materialKey: MATERIAL_KEYS.WOOD,
        price: SELL_PRICES.WOOD,
        rowSelector: '#sell-item-wood',
        requiresIslandSecond: false,
    },
    {
        materialKey: MATERIAL_KEYS.STONE,
        price: SELL_PRICES.STONE,
        rowSelector: '#sell-item-stone',
        requiresIslandSecond: false,
    },
    {
        materialKey: MATERIAL_KEYS.COAL,
        price: SELL_PRICES.COAL,
        rowSelector: SELECTORS.SELL_COAL_ROW,
        requiresIslandSecond: true,
    },
    {
        materialKey: MATERIAL_KEYS.IRON,
        price: SELL_PRICES.IRON,
        rowSelector: SELECTORS.SELL_IRON_ROW,
        requiresIslandSecond: true,
    },
    {
        materialKey: MATERIAL_KEYS.GOLD,
        price: SELL_PRICES.GOLD,
        rowSelector: SELECTORS.SELL_GOLD_ROW,
        requiresIslandSecond: true,
    },
    {
        materialKey: MATERIAL_KEYS.DIAMOND,
        price: SELL_PRICES.DIAMOND,
        rowSelector: SELECTORS.SELL_DIAMOND_ROW,
        requiresIslandSecond: true,
    },
]);

/** Elementos montados para cada material, indexados pela chave do material. */
const sellViews = new Map();

/**
 * Indica se o item pode ser negociado no estado atual do jogo.
 * @param {Object} item - Definição do item de venda.
 * @returns {boolean}
 */
function isItemAvailable(item) {
    return !item.requiresIslandSecond || islands.second;
}

/**
 * Vende uma quantidade de material pelo preço oficial da tabela.
 * O preço nunca vem do parâmetro: é sempre lido da definição do item.
 * @param {string} materialKey - Chave do material no estado.
 * @param {number} amount - Quantidade solicitada.
 */
export function sellMaterial(materialKey, amount) {
    const item = sellItems.find(function (entry) {
        return entry.materialKey === materialKey;
    });

    if (!item || !isItemAvailable(item)) {
        return;
    }

    const requested = Math.floor(Number(amount));

    if (!Number.isFinite(requested) || requested <= 0) {
        return;
    }

    const quantity = Math.min(requested, materials[materialKey]);

    if (quantity <= 0 || !spendMaterials([{ materialKey: materialKey, amount: quantity }])) {
        return;
    }

    addMaterial(MATERIAL_KEYS.COIN, quantity * item.price);
    refreshHud();
}

/**
 * Monta a linha de venda de um material.
 * @param {Object} item - Definição do item de venda.
 * @returns {Object} Referências usadas na atualização.
 */
function createSellRow(item) {
    const info = getMaterialInfo(item.materialKey);

    const row = createElement('article', 'sell-row');
    row.id = item.rowSelector.slice(1);

    const frame = createElement('div', 'sell-row__frame');
    frame.appendChild(createImage(info.icon, info.name, 'sell-row__image'));

    const details = createElement('div', 'sell-row__details');
    details.appendChild(createElement('h2', 'sell-row__name', info.name));

    const stockValue = createElement('span', 'sell-row__stock-value', '0');
    const meta = createElement('p', 'sell-row__meta');
    meta.append(
        createElement('span', 'sell-row__unit-value', String(item.price)),
        createImage('assets/img/coin.png', 'moedas', 'sell-row__coin'),
        createElement('span', 'sell-row__meta-label', 'por unidade  ·  você tem'),
        stockValue
    );
    details.appendChild(meta);

    const total = createElement('p', 'sell-row__total');
    const totalValue = createElement('span', 'sell-row__total-value', '0');
    total.append(
        createElement('span', 'sell-row__total-label', 'Vale '),
        totalValue,
        createImage('assets/img/coin.png', 'moedas', 'sell-row__coin')
    );

    const input = document.createElement('input');
    input.className = 'game-input';
    input.type = 'number';
    input.id = 'sell-' + item.materialKey + '-input';
    input.min = '1';
    input.value = '1';

    const inputWrap = createElement('div', 'game-input-wrap');
    inputWrap.appendChild(input);

    const sellButton = createElement('button', 'btn btn--action btn--compact', 'Vender');
    sellButton.type = 'button';
    sellButton.id = 'sell-' + item.materialKey + '-button';

    const sellAllButton = createElement('button', 'btn btn--action btn--compact', 'Tudo');
    sellAllButton.type = 'button';
    sellAllButton.id = 'sell-' + item.materialKey + '-all-button';

    const actions = createElement('div', 'sell-row__actions');
    actions.append(total, inputWrap, sellButton, sellAllButton);

    row.append(frame, details, actions);

    bindTrustedClick(sellButton, function () {
        sellMaterial(item.materialKey, input.value);
        input.value = '1';
    });

    bindTrustedClick(sellAllButton, function () {
        sellMaterial(item.materialKey, materials[item.materialKey]);
        input.value = '1';
    });

    return { row, stockValue, totalValue, sellButton, sellAllButton, input };
}

/**
 * Atualiza quantidades, totais e disponibilidade dos botões de venda.
 */
export function refreshSellModal() {
    if (!isModalVisible(document.querySelector(SELECTORS.SELL_MODAL))) {
        return;
    }

    let grandTotal = 0;

    sellItems.forEach(function (item) {
        const view = sellViews.get(item.materialKey);

        if (!view) {
            return;
        }

        const available = isItemAvailable(item);
        view.row.style.display = available ? DISPLAY.FLEX : DISPLAY.NONE;

        if (!available) {
            return;
        }

        const quantity = materials[item.materialKey];
        const itemTotal = quantity * item.price;

        view.stockValue.textContent = quantity;
        view.totalValue.textContent = itemTotal;
        setButtonAvailability(view.sellButton, quantity > 0);
        setButtonAvailability(view.sellAllButton, quantity > 0);

        grandTotal += itemTotal;
    });

    document.querySelector(SELECTORS.SELL_TOTAL_VALUE).textContent = grandTotal;
    setButtonAvailability(
        document.querySelector(SELECTORS.SELL_ALL_BUTTON),
        grandTotal > 0
    );
}

/**
 * Abre o modal de venda com os campos zerados.
 */
export function openSell() {
    openModal(document.querySelector(SELECTORS.SELL_MODAL));

    sellViews.forEach(function (view) {
        view.input.value = '1';
    });

    refreshSellModal();
}

/**
 * Vende todos os materiais listados no modal.
 */
function sellEverything() {
    sellItems.forEach(function (item) {
        sellMaterial(item.materialKey, materials[item.materialKey]);
    });
}

/**
 * Monta as linhas de venda e registra os listeners do modal.
 */
export function initSell() {
    const list = document.querySelector(SELECTORS.SELL_ITEM_LIST);

    sellItems.forEach(function (item) {
        const view = createSellRow(item);
        sellViews.set(item.materialKey, view);
        list.appendChild(view.row);
    });

    bindTrustedClick(document.querySelector(SELECTORS.SELL_TRIGGER), openSell);
    bindTrustedClick(document.querySelector(SELECTORS.SELL_ALL_BUTTON), sellEverything);
    onGameStateChanged(refreshSellModal);
}
