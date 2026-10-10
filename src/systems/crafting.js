import {
    inventory,
    canAfford,
    spendMaterials,
    upgradeInventoryItem,
} from '../core/state.js';
import {
    DISPLAY,
    SELECTORS,
    BLUEPRINT_OWNED,
    ITEM_LEVEL_NONE,
    INVENTORY_KEYS,
} from '../utils/constants.js';
import { isModalVisible } from '../utils/helpers.js';
import { bindTrustedClick } from '../utils/security.js';
import {
    createElement,
    createImage,
    createCostList,
    refreshCostList,
    setButtonAvailability,
} from '../ui/dom.js';
import { onGameStateChanged } from '../ui/uiEvents.js';
import { refreshHud } from '../ui/hudManager.js';
import { openModal } from '../ui/modalManager.js';
import { craftRecipes } from '../entities/shop/recipes.js';
import { refreshResourceCursors } from '../entities/farm/farm.js';
import { refreshShopItems } from '../entities/shop/shop.js';

/** Elementos montados para cada receita, indexados pela chave da linha. */
const recipeViews = new Map();

/**
 * Coloca a fornalha na ilha e empurra o Sell para a direita.
 */
function placeFurnaceOnIsland() {
    const sellTrigger = document.querySelector(SELECTORS.SELL_TRIGGER);
    const furnaceTrigger = document.querySelector(SELECTORS.FURNACE_TRIGGER);

    sellTrigger.classList.add('farm-trigger--sell-shifted');
    furnaceTrigger.style.display = DISPLAY.BLOCK;
}

/**
 * Tira a fornalha da ilha e devolve o Sell à posição original.
 */
export function resetFurnacePlacement() {
    const sellTrigger = document.querySelector(SELECTORS.SELL_TRIGGER);
    const furnaceTrigger = document.querySelector(SELECTORS.FURNACE_TRIGGER);

    sellTrigger.classList.remove('farm-trigger--sell-shifted');
    furnaceTrigger.style.display = DISPLAY.NONE;
}

/**
 * Indica se a receita está liberada: blueprint comprada e nível atual correto.
 * @param {Object} recipe - Definição da receita.
 * @returns {boolean}
 */
function isRecipeUnlocked(recipe) {
    return (
        inventory[recipe.blueprintKey] >= BLUEPRINT_OWNED &&
        inventory[recipe.itemKey] === recipe.requiredLevel
    );
}

/**
 * Fabrica um item revalidando blueprint, nível e materiais.
 * @param {Object} recipe - Definição da receita.
 */
export function craftItem(recipe) {
    if (!isRecipeUnlocked(recipe) || !canAfford(recipe.costs)) {
        return;
    }

    if (!spendMaterials(recipe.costs)) {
        return;
    }

    upgradeInventoryItem(recipe.itemKey, recipe.requiredLevel);
    refreshHud();
    refreshCraftableItems();

    if (recipe.itemKey === INVENTORY_KEYS.FURNACE) {
        placeFurnaceOnIsland();
    }

    if (
        recipe.itemKey === INVENTORY_KEYS.AXE ||
        recipe.itemKey === INVENTORY_KEYS.PICKAXE
    ) {
        refreshResourceCursors();
        refreshShopItems();
    }
}

/**
 * Monta o cartão de uma receita do Crafter.
 * @param {Object} recipe - Definição da receita.
 * @returns {Object} Referências usadas na atualização.
 */
function createRecipeCard(recipe) {
    const card = createElement('article', 'market-card');
    card.id = recipe.rowSelector.slice(1);

    const frame = createElement('div', 'market-card__frame');
    frame.appendChild(createImage(recipe.image, recipe.title, 'market-card__image'));

    const body = createElement('div', 'market-card__body');
    body.appendChild(createElement('h2', 'market-card__title', recipe.title));
    body.appendChild(createElement('p', 'market-card__description', recipe.description));

    const costList = createCostList(recipe.costs);

    const button = createElement('button', 'btn btn--action', 'Fabricar');
    button.type = 'button';
    button.id = recipe.buttonSelector.slice(1);

    const footer = createElement('div', 'market-card__footer');
    footer.append(costList.element, button);

    card.append(frame, body, footer);

    bindTrustedClick(button, function () {
        craftItem(recipe);
    });

    return { card, button, chips: costList.chips };
}

/**
 * Atualiza visibilidade e estado de fabricação de todas as receitas.
 */
export function refreshCraftableItems() {
    if (!isModalVisible(document.querySelector(SELECTORS.CRAFTER_MODAL))) {
        return;
    }

    let visibleCount = 0;

    craftRecipes.forEach(function (recipe) {
        const view = recipeViews.get(recipe.rowSelector);

        if (!view) {
            return;
        }

        const unlocked = isRecipeUnlocked(recipe);
        view.card.style.display = unlocked ? DISPLAY.FLEX : DISPLAY.NONE;

        const affordable = refreshCostList(view.chips);
        setButtonAvailability(view.button, unlocked && affordable);
        view.button.textContent = affordable ? 'Fabricar' : 'Falta material';

        if (unlocked) {
            visibleCount += 1;
        }
    });

    const emptyMessage = document.querySelector(SELECTORS.CRAFT_EMPTY_MESSAGE);
    const list = document.querySelector(SELECTORS.CRAFT_ITEM_LIST);
    const isEmpty = visibleCount === 0;

    list.style.display = isEmpty ? DISPLAY.NONE : '';
    emptyMessage.hidden = !isEmpty;
    emptyMessage.style.display = isEmpty ? DISPLAY.FLEX : DISPLAY.NONE;
}

/**
 * Abre o modal do crafter e exibe itens fabricáveis.
 */
export function openCrafter() {
    openModal(document.querySelector(SELECTORS.CRAFTER_MODAL));
    refreshCraftableItems();
}

/**
 * Monta a lista de receitas e registra os listeners do crafter.
 */
export function initCrafting() {
    const list = document.querySelector(SELECTORS.CRAFT_ITEM_LIST);

    craftRecipes.forEach(function (recipe) {
        const view = createRecipeCard(recipe);
        recipeViews.set(recipe.rowSelector, view);
        list.appendChild(view.card);
    });

    bindTrustedClick(document.querySelector(SELECTORS.CRAFTER_TRIGGER), openCrafter);
    onGameStateChanged(refreshCraftableItems);

    if (inventory[INVENTORY_KEYS.FURNACE] > ITEM_LEVEL_NONE) {
        placeFurnaceOnIsland();
    }
}
