import { materials } from '../core/state.js';
import {
    SELECTORS,
    FURNACE_DURATION_MS,
    FURNACE_RECIPES,
} from '../utils/constants.js';
import { refreshHud } from '../ui/hudManager.js';
import { openModal } from '../ui/modalManager.js';

/** Seletores da UI de cada receita da fornalha. */
const RECIPE_UI = {
    iron: {
        recipe: FURNACE_RECIPES.IRON,
        oreCost: '#furnace-iron-ore-cost',
        coalCost: '#furnace-iron-coal-cost',
        maxCraft: '#furnace-iron-max',
        input: '#furnace-iron-input',
        craftButton: '#furnace-iron-craft',
        craftAllButton: '#furnace-iron-craft-all',
        status: '#furnace-iron-status',
        progressFill: '#furnace-iron-progress',
    },
    gold: {
        recipe: FURNACE_RECIPES.GOLD,
        oreCost: '#furnace-gold-ore-cost',
        coalCost: '#furnace-gold-coal-cost',
        maxCraft: '#furnace-gold-max',
        input: '#furnace-gold-input',
        craftButton: '#furnace-gold-craft',
        craftAllButton: '#furnace-gold-craft-all',
        status: '#furnace-gold-status',
        progressFill: '#furnace-gold-progress',
    },
};

/** Estado interno da fundição por receita. */
const smeltState = {
    iron: createEmptySmeltState(),
    gold: createEmptySmeltState(),
};

/**
 * Cria o estado inicial de uma fila de fundição.
 * @returns {{isSmelting: boolean, remainingIngots: number, totalIngots: number, smeltTimerId: number|null, progressTimerId: number|null, smeltStartedAt: number}}
 */
function createEmptySmeltState() {
    return {
        isSmelting: false,
        remainingIngots: 0,
        totalIngots: 0,
        smeltTimerId: null,
        progressTimerId: null,
        smeltStartedAt: 0,
    };
}

/**
 * Retorna quantos lingotes o jogador consegue fabricar para uma receita.
 * @param {{oreKey: string, orePerIngot: number, coalPerIngot: number}} recipe
 * @returns {number}
 */
function getMaxCraftable(recipe) {
    const byOre = Math.floor(materials[recipe.oreKey] / recipe.orePerIngot);
    const byCoal = Math.floor(materials.coal / recipe.coalPerIngot);
    return Math.min(byOre, byCoal);
}

/**
 * Lê e valida a quantidade digitada no input de uma receita.
 * @param {string} recipeId
 * @returns {number}
 */
function getInputAmount(recipeId) {
    const input = document.querySelector(RECIPE_UI[recipeId].input);
    const amount = Math.floor(Number(input.value));

    if (!Number.isFinite(amount) || amount < 1) {
        return 1;
    }

    return amount;
}

/**
 * Atualiza o custo exibido conforme a quantidade do input.
 * @param {string} recipeId
 */
function updateCostDisplay(recipeId) {
    const ui = RECIPE_UI[recipeId];
    const amount = getInputAmount(recipeId);

    document.querySelector(ui.oreCost).textContent = amount * ui.recipe.orePerIngot;
    document.querySelector(ui.coalCost).textContent = amount * ui.recipe.coalPerIngot;
}

/**
 * Atualiza o máximo fabricável e o status visual de todas as receitas.
 */
export function refreshFurnaceModal() {
    Object.keys(RECIPE_UI).forEach(function (recipeId) {
        const ui = RECIPE_UI[recipeId];
        document.querySelector(ui.maxCraft).textContent = getMaxCraftable(ui.recipe);
        updateCostDisplay(recipeId);
        updateSmeltUi(recipeId);
    });
}

/**
 * Atualiza texto, barra e botões conforme o estado da fundição.
 * @param {string} recipeId
 */
function updateSmeltUi(recipeId) {
    const ui = RECIPE_UI[recipeId];
    const state = smeltState[recipeId];
    const statusElement = document.querySelector(ui.status);
    const progressFill = document.querySelector(ui.progressFill);
    const craftButton = document.querySelector(ui.craftButton);
    const craftAllButton = document.querySelector(ui.craftAllButton);
    const input = document.querySelector(ui.input);

    if (!state.isSmelting) {
        statusElement.textContent = 'Parada';
        progressFill.style.width = '0%';
        craftButton.disabled = false;
        craftAllButton.disabled = false;
        input.disabled = false;
        return;
    }

    const completed = state.totalIngots - state.remainingIngots;
    statusElement.textContent =
        'Fabricando ' + (completed + 1) + '/' + state.totalIngots;
    craftButton.disabled = true;
    craftAllButton.disabled = true;
    input.disabled = true;
}

/**
 * Atualiza a barra de progresso do lingote atual.
 * @param {string} recipeId
 */
function tickProgressBar(recipeId) {
    const state = smeltState[recipeId];

    if (!state.isSmelting) {
        return;
    }

    const elapsed = Date.now() - state.smeltStartedAt;
    const percent = Math.min(100, (elapsed / FURNACE_DURATION_MS) * 100);
    document.querySelector(RECIPE_UI[recipeId].progressFill).style.width = percent + '%';
}

/**
 * Consome materiais e inicia a fundição de uma quantidade de lingotes.
 * @param {string} recipeId
 * @param {number} amount
 */
function startSmelting(recipeId, amount) {
    const ui = RECIPE_UI[recipeId];
    const state = smeltState[recipeId];
    const recipe = ui.recipe;

    if (state.isSmelting) {
        return;
    }

    const quantity = Math.min(Math.max(0, Math.floor(amount)), getMaxCraftable(recipe));

    if (quantity <= 0) {
        return;
    }

    materials[recipe.oreKey] -= quantity * recipe.orePerIngot;
    materials.coal -= quantity * recipe.coalPerIngot;
    refreshHud();

    state.isSmelting = true;
    state.remainingIngots = quantity;
    state.totalIngots = quantity;
    document.querySelector(ui.input).value = 1;
    refreshFurnaceModal();
    smeltNextIngot(recipeId);
}

/**
 * Inicia o timer de 15s para o próximo lingote da fila.
 * @param {string} recipeId
 */
function smeltNextIngot(recipeId) {
    const ui = RECIPE_UI[recipeId];
    const state = smeltState[recipeId];
    const recipe = ui.recipe;

    if (state.remainingIngots <= 0) {
        finishSmelting(recipeId);
        return;
    }

    state.smeltStartedAt = Date.now();
    updateSmeltUi(recipeId);

    clearInterval(state.progressTimerId);
    state.progressTimerId = setInterval(function () {
        tickProgressBar(recipeId);
    }, 100);

    clearTimeout(state.smeltTimerId);
    state.smeltTimerId = setTimeout(function () {
        materials[recipe.outputKey] += 1;
        state.remainingIngots -= 1;
        refreshHud();
        document.querySelector(ui.maxCraft).textContent = getMaxCraftable(recipe);
        document.querySelector(ui.progressFill).style.width = '100%';

        if (state.remainingIngots > 0) {
            smeltNextIngot(recipeId);
        } else {
            finishSmelting(recipeId);
        }
    }, FURNACE_DURATION_MS);
}

/**
 * Finaliza a fundição e libera a interface.
 * @param {string} recipeId
 */
function finishSmelting(recipeId) {
    const state = smeltState[recipeId];

    state.isSmelting = false;
    state.remainingIngots = 0;
    state.totalIngots = 0;
    clearTimeout(state.smeltTimerId);
    clearInterval(state.progressTimerId);
    state.smeltTimerId = null;
    state.progressTimerId = null;
    refreshFurnaceModal();
}

/**
 * Abre o modal da fornalha.
 */
export function openFurnace() {
    openModal(document.querySelector(SELECTORS.FURNACE_MODAL));

    Object.keys(RECIPE_UI).forEach(function (recipeId) {
        document.querySelector(RECIPE_UI[recipeId].input).value = 1;
    });

    refreshFurnaceModal();
}

/**
 * Registra clique na fornalha e controles do modal.
 */
export function initFurnace() {
    const furnaceTrigger = document.querySelector(SELECTORS.FURNACE_TRIGGER);

    furnaceTrigger.addEventListener('click', openFurnace);

    Object.keys(RECIPE_UI).forEach(function (recipeId) {
        const ui = RECIPE_UI[recipeId];
        const input = document.querySelector(ui.input);
        const craftButton = document.querySelector(ui.craftButton);
        const craftAllButton = document.querySelector(ui.craftAllButton);

        input.addEventListener('input', function () {
            updateCostDisplay(recipeId);
        });

        craftButton.addEventListener('click', function () {
            startSmelting(recipeId, getInputAmount(recipeId));
        });

        craftAllButton.addEventListener('click', function () {
            startSmelting(recipeId, getMaxCraftable(ui.recipe));
        });
    });
}
