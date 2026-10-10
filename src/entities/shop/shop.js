import {
    inventory,
    islands,
    canAfford,
    spendMaterials,
    upgradeInventoryItem,
} from '../../core/state.js';
import {
    DISPLAY,
    SELECTORS,
    ITEM_LEVEL_NONE,
    INVENTORY_KEYS,
    MATERIAL_KEYS,
} from '../../utils/constants.js';
import { isModalVisible } from '../../utils/helpers.js';
import { bindTrustedClick } from '../../utils/security.js';
import {
    createElement,
    createImage,
    createCostList,
    refreshCostList,
    setButtonAvailability,
} from '../../ui/dom.js';
import { onGameStateChanged } from '../../ui/uiEvents.js';
import { refreshHud } from '../../ui/hudManager.js';
import { openModal } from '../../ui/modalManager.js';
import { shopProducts } from './products.js';
import { refreshIslandMaterialsUi } from '../../systems/map.js';

/** Elementos montados para cada produto, indexados pela chave da linha. */
const productViews = new Map();

/**
 * Custo em moedas de um produto, no formato aceito pelo estado.
 * @param {Object} product - Definição do produto.
 * @returns {Array<{materialKey: string, amount: number}>}
 */
function getCoinCost(product) {
    return [{ materialKey: MATERIAL_KEYS.COIN, amount: product.price }];
}

/**
 * Verifica se machado e picareta do nível exigido já foram craftados.
 * @param {number} requiredToolsLevel - Nível mínimo das duas ferramentas.
 * @returns {boolean}
 */
function hasRequiredTools(requiredToolsLevel) {
    if (requiredToolsLevel <= ITEM_LEVEL_NONE) {
        return true;
    }

    return (
        inventory[INVENTORY_KEYS.AXE] >= requiredToolsLevel &&
        inventory[INVENTORY_KEYS.PICKAXE] >= requiredToolsLevel
    );
}

/**
 * Indica se o produto deve estar visível na loja.
 * @param {Object} product - Definição do produto.
 * @returns {boolean}
 */
function isProductUnlocked(product) {
    if (inventory[product.itemKey] !== product.requiredLevel) {
        return false;
    }

    if (product.requiresIslandSecond && !islands.second) {
        return false;
    }

    return hasRequiredTools(product.requiredToolsLevel);
}

/**
 * Compra um produto da loja revalidando todas as regras de liberação.
 * @param {Object} product - Definição do produto.
 */
export function purchaseItem(product) {
    const coinCost = getCoinCost(product);

    if (!isProductUnlocked(product) || !canAfford(coinCost)) {
        return;
    }

    if (!spendMaterials(coinCost)) {
        return;
    }

    upgradeInventoryItem(product.itemKey, product.requiredLevel);
    refreshHud();
    refreshShopItems();

    if (product.itemKey === INVENTORY_KEYS.FURNACE_BLUEPRINT) {
        refreshIslandMaterialsUi();
    }
}

/**
 * Monta o cartão de um produto da loja.
 * @param {Object} product - Definição do produto.
 * @returns {Object} Referências usadas na atualização.
 */
function createProductCard(product) {
    const card = createElement('article', 'market-card');
    card.id = product.rowSelector.slice(1);

    const frame = createElement('div', 'market-card__frame');
    frame.appendChild(createImage(product.image, product.title, 'market-card__image'));

    const body = createElement('div', 'market-card__body');
    body.appendChild(createElement('h2', 'market-card__title', product.title));
    body.appendChild(createElement('p', 'market-card__tag', 'Blueprint'));
    body.appendChild(createElement('p', 'market-card__description', product.description));

    const costList = createCostList(getCoinCost(product));

    const button = createElement('button', 'btn btn--action', 'Comprar');
    button.type = 'button';
    button.id = product.buttonSelector.slice(1);

    const footer = createElement('div', 'market-card__footer');
    footer.append(costList.element, button);

    card.append(frame, body, footer);

    bindTrustedClick(button, function () {
        purchaseItem(product);
    });

    return { card, button, chips: costList.chips };
}

/**
 * Atualiza visibilidade e estado de compra de todos os produtos.
 */
export function refreshShopItems() {
    if (!isModalVisible(document.querySelector(SELECTORS.SHOP_MODAL))) {
        return;
    }

    let visibleCount = 0;

    shopProducts.forEach(function (product) {
        const view = productViews.get(product.rowSelector);

        if (!view) {
            return;
        }

        const unlocked = isProductUnlocked(product);
        view.card.style.display = unlocked ? DISPLAY.FLEX : DISPLAY.NONE;

        const affordable = refreshCostList(view.chips);
        setButtonAvailability(view.button, unlocked && affordable);
        view.button.textContent = affordable ? 'Comprar' : 'Sem moedas';

        if (unlocked) {
            visibleCount += 1;
        }
    });

    const emptyMessage = document.querySelector(SELECTORS.SHOP_EMPTY_MESSAGE);
    const list = document.querySelector(SELECTORS.SHOP_ITEM_LIST);
    const isEmpty = visibleCount === 0;

    list.style.display = isEmpty ? DISPLAY.NONE : '';
    emptyMessage.hidden = !isEmpty;
    emptyMessage.style.display = isEmpty ? DISPLAY.FLEX : DISPLAY.NONE;
}

/**
 * Abre o modal da loja.
 */
export function openShop() {
    openModal(document.querySelector(SELECTORS.SHOP_MODAL));
    refreshShopItems();
}

/**
 * Monta a lista de produtos e registra os listeners da loja.
 */
export function initShop() {
    const list = document.querySelector(SELECTORS.SHOP_ITEM_LIST);

    shopProducts.forEach(function (product) {
        const view = createProductCard(product);
        productViews.set(product.rowSelector, view);
        list.appendChild(view.card);
    });

    bindTrustedClick(document.querySelector(SELECTORS.SHOP_TRIGGER), openShop);
    onGameStateChanged(refreshShopItems);
}
