import { materials, islands } from '../core/state.js';
import { MATERIAL_KEYS, SELECTORS, SELL_PRICES } from '../utils/constants.js';
import { refreshHud } from '../ui/hudManager.js';
import { openModal } from '../ui/modalManager.js';

/** Itens exibidos no modal de venda. */
const sellItems = [
    {
        materialKey: MATERIAL_KEYS.WOOD,
        price: SELL_PRICES.WOOD,
        quantitySelector: SELECTORS.SELL_WOOD_QUANTITY,
        totalSelector: SELECTORS.SELL_WOOD_TOTAL,
        inputSelector: SELECTORS.SELL_WOOD_INPUT,
        sellButtonSelector: SELECTORS.SELL_WOOD_BUTTON,
        sellAllButtonSelector: SELECTORS.SELL_WOOD_ALL_BUTTON,
        requiresIslandSecond: false,
    },
    {
        materialKey: MATERIAL_KEYS.STONE,
        price: SELL_PRICES.STONE,
        quantitySelector: SELECTORS.SELL_STONE_QUANTITY,
        totalSelector: SELECTORS.SELL_STONE_TOTAL,
        inputSelector: SELECTORS.SELL_STONE_INPUT,
        sellButtonSelector: SELECTORS.SELL_STONE_BUTTON,
        sellAllButtonSelector: SELECTORS.SELL_STONE_ALL_BUTTON,
        requiresIslandSecond: false,
    },
    {
        materialKey: MATERIAL_KEYS.IRON,
        price: SELL_PRICES.IRON,
        quantitySelector: SELECTORS.SELL_IRON_QUANTITY,
        totalSelector: SELECTORS.SELL_IRON_TOTAL,
        inputSelector: SELECTORS.SELL_IRON_INPUT,
        sellButtonSelector: SELECTORS.SELL_IRON_BUTTON,
        sellAllButtonSelector: SELECTORS.SELL_IRON_ALL_BUTTON,
        requiresIslandSecond: true,
    },
    {
        materialKey: MATERIAL_KEYS.COAL,
        price: SELL_PRICES.COAL,
        quantitySelector: SELECTORS.SELL_COAL_QUANTITY,
        totalSelector: SELECTORS.SELL_COAL_TOTAL,
        inputSelector: SELECTORS.SELL_COAL_INPUT,
        sellButtonSelector: SELECTORS.SELL_COAL_BUTTON,
        sellAllButtonSelector: SELECTORS.SELL_COAL_ALL_BUTTON,
        requiresIslandSecond: true,
    },
    {
        materialKey: MATERIAL_KEYS.GOLD,
        price: SELL_PRICES.GOLD,
        quantitySelector: SELECTORS.SELL_GOLD_QUANTITY,
        totalSelector: SELECTORS.SELL_GOLD_TOTAL,
        inputSelector: SELECTORS.SELL_GOLD_INPUT,
        sellButtonSelector: SELECTORS.SELL_GOLD_BUTTON,
        sellAllButtonSelector: SELECTORS.SELL_GOLD_ALL_BUTTON,
        requiresIslandSecond: true,
    },
];

/**
 * Vende uma quantidade de material por moedas.
 * @param {string} materialKey - Chave do material no estado.
 * @param {number} amount - Quantidade a vender.
 * @param {number} price - Preço unitário em moedas.
 */
export function sellMaterial(materialKey, amount, price) {
    const available = materials[materialKey];
    const quantity = Math.min(Math.max(0, Math.floor(amount)), available);

    if (quantity <= 0) {
        return;
    }

    materials[materialKey] -= quantity;
    materials.coin += quantity * price;
    refreshHud();
    refreshSellModal();
}

/**
 * Atualiza quantidades, totais e reseta os inputs do modal de venda.
 */
export function refreshSellModal() {
    let grandTotal = 0;

    sellItems.forEach(function (item) {
        if (item.requiresIslandSecond && !islands.second) {
            return;
        }

        const quantity = materials[item.materialKey];
        const itemTotal = quantity * item.price;

        document.querySelector(item.quantitySelector).textContent = quantity;
        document.querySelector(item.totalSelector).textContent = itemTotal;
        document.querySelector(item.inputSelector).value = 1;

        grandTotal += itemTotal;
    });

    document.querySelector(SELECTORS.SELL_TOTAL_VALUE).textContent = grandTotal;
}

/**
 * Abre o modal de venda e atualiza os valores exibidos.
 */
export function openSell() {
    openModal(document.querySelector(SELECTORS.SELL_MODAL));
    refreshSellModal();
}

/**
 * Vende todos os materiais listados no modal.
 */
function sellEverything() {
    sellItems.forEach(function (item) {
        if (item.requiresIslandSecond && !islands.second) {
            return;
        }

        sellMaterial(item.materialKey, materials[item.materialKey], item.price);
    });
}

/**
 * Registra o listener de abertura e os botões de venda.
 */
export function initSell() {
    const sellTrigger = document.querySelector(SELECTORS.SELL_TRIGGER);
    sellTrigger.addEventListener('click', openSell);

    document.querySelector(SELECTORS.SELL_ALL_BUTTON).addEventListener('click', sellEverything);

    sellItems.forEach(function (item) {
        const input = document.querySelector(item.inputSelector);
        const sellButton = document.querySelector(item.sellButtonSelector);
        const sellAllButton = document.querySelector(item.sellAllButtonSelector);

        sellButton.addEventListener('click', function () {
            sellMaterial(item.materialKey, Number(input.value), item.price);
        });

        sellAllButton.addEventListener('click', function () {
            sellMaterial(item.materialKey, materials[item.materialKey], item.price);
        });
    });
}
