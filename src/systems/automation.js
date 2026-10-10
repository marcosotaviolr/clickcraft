import {
    automations,
    inventory,
    islands,
    canAfford,
    spendMaterials,
    addMaterial,
    upgradeAutomation,
} from '../core/state.js';
import {
    DISPLAY,
    SELECTORS,
    MATERIAL_KEYS,
    INVENTORY_KEYS,
    AUTOMATION_MAX_LEVEL,
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
import { showClickPopup } from '../ui/clickPopup.js';
import { getMaterialInfo } from '../entities/materials.js';
import { automationProducts } from '../entities/automation/catalog.js';

/** Cartões montados, indexados pela chave do autômato. */
const automationViews = new Map();

/**
 * Custo em moedas do próximo nível do autômato.
 * @param {Object} product - Definição do autômato.
 * @returns {Array<{materialKey: string, amount: number}>}
 */
function getNextLevelCost(product) {
    const level = automations[product.automationKey];
    return [{ materialKey: MATERIAL_KEYS.COIN, amount: product.price * (level + 1) }];
}

/**
 * Indica se o jogador já tem as ferramentas para aquele autômato.
 * @param {Object} product - Definição do autômato.
 * @returns {boolean}
 */
function hasRequiredTools(product) {
    if (inventory[INVENTORY_KEYS.AXE] < product.requiredAxeLevel) {
        return false;
    }

    if (inventory[INVENTORY_KEYS.PICKAXE] < product.requiredPickaxeLevel) {
        return false;
    }

    return true;
}

/**
 * Indica se o autômato deve aparecer na loja.
 * @param {Object} product - Definição do autômato.
 * @returns {boolean}
 */
function isProductUnlocked(product) {
    if (!islands.third) {
        return false;
    }

    if (product.requiresIslandSecond && !islands.second) {
        return false;
    }

    return hasRequiredTools(product);
}

/**
 * Quantidade coletada por um ciclo, no nível atual.
 * @param {Object} product - Definição do autômato.
 * @returns {number}
 */
function getTickAmount(product) {
    const level = automations[product.automationKey];

    if (level <= 0 || !hasRequiredTools(product)) {
        return 0;
    }

    return level;
}

/**
 * Compra o próximo nível do autômato.
 * @param {Object} product - Definição do autômato.
 */
export function purchaseAutomation(product) {
    if (!isProductUnlocked(product)) {
        return;
    }

    if (automations[product.automationKey] >= AUTOMATION_MAX_LEVEL) {
        return;
    }

    const cost = getNextLevelCost(product);

    if (!canAfford(cost) || !spendMaterials(cost)) {
        return;
    }

    if (!upgradeAutomation(product.automationKey)) {
        return;
    }

    refreshHud();
    refreshAutomationShop();
    refreshWorldAutomators();
}

/**
 * Monta o cartão de um autômato.
 * @param {Object} product - Definição do autômato.
 * @returns {Object}
 */
function createAutomationCard(product) {
    const info = getMaterialInfo(product.automationKey);
    const card = createElement('article', 'market-card');
    card.id = 'automation-item-' + product.automationKey;

    const frame = createElement('div', 'market-card__frame');
    frame.appendChild(createImage(product.image, product.title, 'market-card__image'));

    const body = createElement('div', 'market-card__body');
    body.appendChild(createElement('h2', 'market-card__title', product.title));

    const levelLabel = createElement('p', 'market-card__tag', 'Nível 0');
    const description = createElement('p', 'market-card__description', '');
    body.append(levelLabel, description);

    const costList = createCostList(getNextLevelCost(product));
    const button = createElement('button', 'btn btn--action', 'Comprar');
    button.type = 'button';
    button.id = 'buy-automation-' + product.automationKey;

    const footer = createElement('div', 'market-card__footer');
    footer.append(costList.element, button);
    card.append(frame, body, footer);

    bindTrustedClick(button, function () {
        purchaseAutomation(product);
    });

    return {
        card,
        button,
        chips: costList.chips,
        levelLabel,
        description,
        materialName: info.name,
    };
}

/**
 * Atualiza um cartão com nível, coleta e preço atuais.
 * @param {Object} product - Definição do autômato.
 * @param {Object} view - Referências do cartão.
 */
function refreshAutomationCard(product, view) {
    const level = automations[product.automationKey];
    const atMax = level >= AUTOMATION_MAX_LEVEL;
    const cost = getNextLevelCost(product);
    const perTick = Math.max(level, 1);

    view.levelLabel.textContent = level > 0 ? 'Nível ' + level : 'Desligado';
    view.description.textContent =
        'Coleta ' + perTick + ' ' + view.materialName.toLowerCase() + ' por segundo';

    view.chips.forEach(function (chip, index) {
        chip.amount = cost[index].amount;
        chip.element.querySelector('.cost-chip__amount').textContent = String(cost[index].amount);
    });

    const affordable = refreshCostList(view.chips);

    if (atMax) {
        view.button.textContent = 'Máximo';
        setButtonAvailability(view.button, false);
        return;
    }

    view.button.textContent = level > 0 ? 'Melhorar' : 'Comprar';
    setButtonAvailability(view.button, affordable);
}

/**
 * Atualiza visibilidade e preços da loja de automações.
 */
export function refreshAutomationShop() {
    if (!isModalVisible(document.querySelector(SELECTORS.AUTOMATION_MODAL))) {
        return;
    }

    let visibleCount = 0;

    automationProducts.forEach(function (product) {
        const view = automationViews.get(product.automationKey);

        if (!view) {
            return;
        }

        const unlocked = isProductUnlocked(product);
        view.card.style.display = unlocked ? DISPLAY.FLEX : DISPLAY.NONE;

        if (unlocked) {
            refreshAutomationCard(product, view);
            visibleCount += 1;
        }
    });

    const emptyMessage = document.querySelector(SELECTORS.AUTOMATION_EMPTY_MESSAGE);
    const list = document.querySelector(SELECTORS.AUTOMATION_ITEM_LIST);
    const isEmpty = visibleCount === 0;

    list.style.display = isEmpty ? DISPLAY.NONE : '';
    emptyMessage.hidden = !isEmpty;
    emptyMessage.style.display = isEmpty ? DISPLAY.FLEX : DISPLAY.NONE;
}

/**
 * Abre o modal se a Ilha 3 estiver liberada.
 */
export function openAutomationShop() {
    if (!islands.third) {
        return;
    }

    openModal(document.querySelector(SELECTORS.AUTOMATION_MODAL));
    refreshAutomationShop();
}

/**
 * Aplica um ciclo de coleta de todos os autômatos ativos.
 */
export function tickAutomations() {
    let collected = false;

    automationProducts.forEach(function (product) {
        if (product.requiresIslandSecond && !islands.second) {
            return;
        }

        const amount = getTickAmount(product);

        if (amount <= 0) {
            return;
        }

        if (addMaterial(product.automationKey, amount)) {
            collected = true;
            playAutomatorCollect(product.automationKey, amount);
        }
    });

    if (collected) {
        refreshHud();
    }
}

/**
 * Mostra ou esconde o robô de cada recurso conforme a compra.
 */
export function refreshWorldAutomators() {
    automationProducts.forEach(function (product) {
        const robot = getAutomatorElement(product.automationKey);

        if (!robot) {
            return;
        }

        const active = automations[product.automationKey] > 0;
        robot.hidden = !active;
        robot.classList.toggle('automator--active', active);
        robot.alt = active ? 'Autômato de ' + getMaterialInfo(product.automationKey).name : '';
    });
}

/**
 * Retorna o sprite do autômato na ilha.
 * @param {string} automationKey - Chave do recurso.
 * @returns {HTMLElement|null}
 */
function getAutomatorElement(automationKey) {
    return document.querySelector('.automator--' + automationKey);
}

/**
 * Dá um golpe no robô e mostra o "+N" da coleta automática.
 * @param {string} automationKey - Chave do recurso.
 * @param {number} amount - Quantidade coletada neste ciclo.
 */
function playAutomatorCollect(automationKey, amount) {
    const robot = getAutomatorElement(automationKey);

    if (!robot || robot.hidden) {
        return;
    }

    robot.classList.remove('automator--strike');
    void robot.offsetWidth;
    robot.classList.add('automator--strike');
    showClickPopup(amount, robot);
}

/**
 * Monta a loja e registra o prédio da Ilha 3.
 */
export function initAutomation() {
    const list = document.querySelector(SELECTORS.AUTOMATION_ITEM_LIST);

    automationProducts.forEach(function (product) {
        const view = createAutomationCard(product);
        automationViews.set(product.automationKey, view);
        list.appendChild(view.card);

        const robot = getAutomatorElement(product.automationKey);

        if (robot) {
            robot.addEventListener('animationend', function (event) {
                if (event.animationName === 'automator-strike') {
                    robot.classList.remove('automator--strike');
                }
            });
        }
    });

    bindTrustedClick(document.querySelector(SELECTORS.AUTOMATION_TRIGGER), openAutomationShop);
    onGameStateChanged(refreshAutomationShop);
    refreshWorldAutomators();
}
