import { materials, inventory, addMaterial, spendMaterials } from '../core/state.js';
import {
    SELECTORS,
    FURNACE_DURATION_MS,
    FURNACE_RECIPES,
    INVENTORY_KEYS,
    ITEM_LEVEL_NONE,
    MATERIAL_KEYS,
} from '../utils/constants.js';
import { getMaterialInfo } from '../entities/materials.js';
import { isModalVisible } from '../utils/helpers.js';
import { bindTrustedClick } from '../utils/security.js';
import { createElement, createImage, setButtonAvailability } from '../ui/dom.js';
import { onGameStateChanged } from '../ui/uiEvents.js';
import { refreshHud } from '../ui/hudManager.js';
import { openModal } from '../ui/modalManager.js';

/** Fornos exibidos no modal, na ordem de progressão do jogo. */
const FURNACE_SLOTS = [
    { id: 'iron', recipe: FURNACE_RECIPES.IRON },
    { id: 'gold', recipe: FURNACE_RECIPES.GOLD },
];

/** Intervalo de atualização da barra de progresso e do contador (ms). */
const TICK_INTERVAL_MS = 100;

/** Referências de DOM de cada forno, preenchidas ao montar o modal. */
const slotViews = new Map();

/** Estado da fila de fundição de cada forno. */
const smeltStates = new Map();

/**
 * Cria o estado inicial de uma fila de fundição.
 * @returns {{isSmelting: boolean, remainingIngots: number, totalIngots: number, smeltTimerId: number|null, tickTimerId: number|null, smeltStartedAt: number}}
 */
function createEmptySmeltState() {
    return {
        isSmelting: false,
        remainingIngots: 0,
        totalIngots: 0,
        smeltTimerId: null,
        tickTimerId: null,
        smeltStartedAt: 0,
    };
}

/**
 * Indica se o jogador já construiu a fornalha.
 * @returns {boolean}
 */
function hasFurnace() {
    return inventory[INVENTORY_KEYS.FURNACE] > ITEM_LEVEL_NONE;
}

/**
 * Lista o que um lingote consome, na ordem em que aparece na interface.
 * @param {{oreKey: string, orePerIngot: number, coalPerIngot: number}} recipe
 * @returns {Array<{materialKey: string, perIngot: number}>}
 */
function getRecipeInputs(recipe) {
    return [
        { materialKey: recipe.oreKey, perIngot: recipe.orePerIngot },
        { materialKey: MATERIAL_KEYS.COAL, perIngot: recipe.coalPerIngot },
    ];
}

/**
 * Retorna quantos lingotes o jogador consegue fabricar para uma receita.
 * @param {{oreKey: string, orePerIngot: number, coalPerIngot: number}} recipe
 * @returns {number}
 */
function getMaxCraftable(recipe) {
    if (!hasFurnace()) {
        return 0;
    }

    const maxCraftable = getRecipeInputs(recipe).reduce(function (limit, input) {
        if (input.perIngot <= 0) {
            return limit;
        }

        return Math.min(limit, Math.floor(materials[input.materialKey] / input.perIngot));
    }, Infinity);

    return maxCraftable === Infinity ? 99 : maxCraftable;
}

/**
 * Lê e valida a quantidade digitada no input de um forno.
 * @param {string} slotId - Identificador do forno.
 * @returns {number}
 */
function getInputAmount(slotId) {
    const amount = Math.floor(Number(slotViews.get(slotId).input.value));

    if (!Number.isFinite(amount) || amount < 1) {
        return 1;
    }

    return amount;
}

/**
 * Monta uma etiqueta de custo cujo número muda conforme o tamanho do lote.
 * @param {{materialKey: string, perIngot: number}} input - Insumo da receita.
 * @returns {{element: HTMLElement, amountElement: HTMLElement, materialKey: string, perIngot: number}}
 */
function createCostChip(input) {
    const info = getMaterialInfo(input.materialKey);
    const element = createElement('span', 'cost-chip');
    const amountElement = createElement('span', 'cost-chip__amount', String(input.perIngot));

    element.title = info.name;
    element.appendChild(amountElement);
    element.appendChild(createImage(info.icon, info.name, 'cost-chip__icon'));

    return {
        element,
        amountElement,
        materialKey: input.materialKey,
        perIngot: input.perIngot,
    };
}

/**
 * Descreve a receita em texto corrido (ex.: "2 Ouro + 4 Carvão").
 * @param {Array<{materialKey: string, perIngot: number}>} inputs - Insumos da receita.
 * @returns {string}
 */
function formatRecipe(inputs) {
    return inputs
        .map(function (input) {
            return input.perIngot + ' ' + getMaterialInfo(input.materialKey).name;
        })
        .join(' + ');
}

/**
 * Monta o cartão de um forno e registra suas referências de DOM.
 * @param {{id: string, recipe: Object}} slot - Forno a montar.
 * @returns {HTMLElement}
 */
function createFurnaceCard(slot) {
    const output = getMaterialInfo(slot.recipe.outputKey);
    const inputs = getRecipeInputs(slot.recipe);
    const seconds = Math.round(FURNACE_DURATION_MS / 1000);

    const card = createElement('article', 'furnace-card');
    const frame = createElement('div', 'furnace-card__frame');
    frame.appendChild(createImage(output.icon, output.name, 'furnace-card__image'));

    const badge = createElement('span', 'furnace-card__badge');

    const titleRow = createElement('div', 'furnace-card__title-row');
    titleRow.appendChild(createElement('h2', 'furnace-card__name', output.name));
    titleRow.appendChild(badge);

    const heading = createElement('div', 'furnace-card__heading');
    heading.appendChild(titleRow);
    heading.appendChild(
        createElement(
            'p',
            'furnace-card__formula',
            formatRecipe(inputs) + ' · ' + seconds + 's cada'
        )
    );

    const header = createElement('header', 'furnace-card__header');
    header.append(frame, heading);

    const costList = createElement('div', 'cost-list');
    const costChips = inputs.map(function (input) {
        const chip = createCostChip(input);
        costList.appendChild(chip.element);

        return chip;
    });

    const costRow = createElement('div', 'furnace-card__row');
    costRow.appendChild(createElement('span', 'furnace-card__label', 'Custo do lote'));
    costRow.appendChild(costList);

    const stock = createElement('span', 'furnace-card__stock', '0');
    const stockRow = createElement('div', 'furnace-card__row');
    stockRow.appendChild(createElement('span', 'furnace-card__label', 'Dá para fundir'));
    stockRow.appendChild(stock);

    const input = createElement('input', 'game-input');
    input.type = 'number';
    input.min = '1';
    input.value = '1';
    input.id = 'furnace-' + slot.id + '-input';

    const inputWrap = createElement('div', 'game-input-wrap');
    inputWrap.appendChild(input);

    const craftButton = createElement('button', 'btn btn--action btn--compact', 'Fundir');
    craftButton.type = 'button';
    craftButton.id = 'furnace-' + slot.id + '-craft';

    const craftAllButton = createElement('button', 'btn btn--action btn--compact', 'Tudo');
    craftAllButton.type = 'button';
    craftAllButton.id = 'furnace-' + slot.id + '-craft-all';

    const controls = createElement('div', 'furnace-card__controls');
    controls.append(inputWrap, craftButton, craftAllButton);

    const fill = createElement('div', 'furnace-bar__fill');
    const bar = createElement('div', 'furnace-bar');
    bar.appendChild(fill);

    const queue = createElement('span', 'furnace-card__queue');
    const timer = createElement('span', 'furnace-card__timer', '--');
    const status = createElement('div', 'furnace-card__status');
    status.append(queue, timer);

    const progress = createElement('div', 'furnace-card__progress');
    progress.append(bar, status);

    card.append(header, costRow, stockRow, controls, progress);

    slotViews.set(slot.id, {
        card,
        badge,
        costChips,
        stock,
        input,
        craftButton,
        craftAllButton,
        fill,
        queue,
        timer,
    });

    return card;
}

/**
 * Preenche o modal com um cartão por forno.
 */
function buildFurnaceList() {
    const list = document.querySelector(SELECTORS.FURNACE_LIST);

    FURNACE_SLOTS.forEach(function (slot) {
        smeltStates.set(slot.id, createEmptySmeltState());
        list.appendChild(createFurnaceCard(slot));
    });
}

/**
 * Atualiza custos, disponibilidade e estado de um forno.
 * @param {{id: string, recipe: Object}} slot - Forno a atualizar.
 */
function refreshSlot(slot) {
    const view = slotViews.get(slot.id);
    const state = smeltStates.get(slot.id);
    const maxCraftable = getMaxCraftable(slot.recipe);
    const quantity = getInputAmount(slot.id);

    view.stock.textContent = maxCraftable;

    view.costChips.forEach(function (chip) {
        const needed = quantity * chip.perIngot;

        chip.amountElement.textContent = needed;
        chip.element.classList.toggle(
            'cost-chip--missing',
            materials[chip.materialKey] < needed
        );
    });

    if (state.isSmelting) {
        // No instante entre o último lingote sair e a fila fechar, o índice
        // passaria do total; o clamp evita mostrar "Lingote 4 de 3".
        const current = Math.min(
            state.totalIngots,
            state.totalIngots - state.remainingIngots + 1
        );

        view.badge.textContent = 'Fundindo';
        view.queue.textContent = 'Lingote ' + current + ' de ' + state.totalIngots;
    } else {
        view.badge.textContent = maxCraftable > 0 ? 'Pronta' : 'Parada';
        view.queue.textContent =
            maxCraftable > 0 ? 'Aguardando ordem' : 'Falta minério ou carvão';
        view.timer.textContent = '--';
        view.fill.style.width = '0%';
    }

    const canOrder = !state.isSmelting && maxCraftable > 0;

    view.card.classList.toggle('furnace-card--active', state.isSmelting);
    view.badge.classList.toggle('furnace-card__badge--busy', state.isSmelting);
    view.badge.classList.toggle('furnace-card__badge--ready', canOrder);
    setButtonAvailability(view.craftButton, canOrder);
    setButtonAvailability(view.craftAllButton, canOrder);
    view.input.disabled = !canOrder;
}

/**
 * Atualiza todos os fornos quando o modal está visível.
 */
export function refreshFurnaceModal() {
    if (!isModalVisible(document.querySelector(SELECTORS.FURNACE_MODAL))) {
        return;
    }

    FURNACE_SLOTS.forEach(refreshSlot);
}

/**
 * Avança a barra de progresso e o tempo restante do lingote atual.
 * @param {string} slotId - Identificador do forno.
 */
function tickSmelting(slotId) {
    const state = smeltStates.get(slotId);

    if (!state.isSmelting) {
        return;
    }

    const view = slotViews.get(slotId);
    const elapsed = Date.now() - state.smeltStartedAt;
    const remaining = Math.max(0, FURNACE_DURATION_MS - elapsed);

    view.fill.style.width = Math.min(100, (elapsed / FURNACE_DURATION_MS) * 100) + '%';
    view.timer.textContent = Math.ceil(remaining / 1000) + 's';
}

/**
 * Consome materiais e inicia a fundição de uma quantidade de lingotes.
 * @param {{id: string, recipe: Object}} slot - Forno acionado.
 * @param {number} amount - Quantidade pedida.
 */
function startSmelting(slot, amount) {
    const state = smeltStates.get(slot.id);

    if (state.isSmelting || !hasFurnace()) {
        return;
    }

    const requested = Math.floor(Number(amount));

    if (!Number.isFinite(requested) || requested <= 0) {
        return;
    }

    const quantity = Math.min(requested, getMaxCraftable(slot.recipe));

    if (quantity <= 0) {
        return;
    }

    const costs = getRecipeInputs(slot.recipe).map(function (input) {
        return { materialKey: input.materialKey, amount: quantity * input.perIngot };
    });

    if (!spendMaterials(costs)) {
        return;
    }

    refreshHud();

    state.isSmelting = true;
    state.remainingIngots = quantity;
    state.totalIngots = quantity;
    slotViews.get(slot.id).input.value = 1;
    refreshFurnaceModal();
    smeltNextIngot(slot);
}

/**
 * Inicia a contagem do próximo lingote da fila.
 * @param {{id: string, recipe: Object}} slot - Forno em operação.
 */
function smeltNextIngot(slot) {
    const state = smeltStates.get(slot.id);

    if (state.remainingIngots <= 0) {
        finishSmelting(slot);
        return;
    }

    state.smeltStartedAt = Date.now();
    refreshFurnaceModal();

    clearInterval(state.tickTimerId);
    state.tickTimerId = setInterval(function () {
        tickSmelting(slot.id);
    }, TICK_INTERVAL_MS);

    clearTimeout(state.smeltTimerId);
    state.smeltTimerId = setTimeout(function () {
        addMaterial(slot.recipe.outputKey, 1);
        state.remainingIngots -= 1;
        slotViews.get(slot.id).fill.style.width = '100%';
        refreshHud();

        if (state.remainingIngots > 0) {
            smeltNextIngot(slot);
        } else {
            finishSmelting(slot);
        }
    }, FURNACE_DURATION_MS);
}

/**
 * Finaliza a fundição e libera a interface do forno.
 * @param {{id: string, recipe: Object}} slot - Forno a liberar.
 */
function finishSmelting(slot) {
    const state = smeltStates.get(slot.id);

    clearTimeout(state.smeltTimerId);
    clearInterval(state.tickTimerId);
    smeltStates.set(slot.id, createEmptySmeltState());
    refreshFurnaceModal();
}

/**
 * Interrompe todas as fundições em andamento e limpa os timers.
 */
export function resetFurnace() {
    FURNACE_SLOTS.forEach(finishSmelting);
}

/**
 * Abre o modal da fornalha.
 */
export function openFurnace() {
    if (!hasFurnace()) {
        return;
    }

    openModal(document.querySelector(SELECTORS.FURNACE_MODAL));

    FURNACE_SLOTS.forEach(function (slot) {
        if (!smeltStates.get(slot.id).isSmelting) {
            slotViews.get(slot.id).input.value = 1;
        }
    });

    refreshFurnaceModal();
}

/**
 * Monta o modal da fornalha e registra seus controles.
 */
export function initFurnace() {
    buildFurnaceList();
    bindTrustedClick(document.querySelector(SELECTORS.FURNACE_TRIGGER), openFurnace);

    FURNACE_SLOTS.forEach(function (slot) {
        const view = slotViews.get(slot.id);

        view.input.addEventListener('input', function () {
            refreshSlot(slot);
        });

        bindTrustedClick(view.craftButton, function () {
            startSmelting(slot, getInputAmount(slot.id));
        });

        bindTrustedClick(view.craftAllButton, function () {
            startSmelting(slot, getMaxCraftable(slot.recipe));
        });
    });

    onGameStateChanged(refreshFurnaceModal);
}
