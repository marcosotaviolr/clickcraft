import { inventory, equipTool } from '../core/state.js';
import { SELECTORS, INVENTORY_KEYS } from '../utils/constants.js';
import { bindTrustedClick } from '../utils/security.js';
import { TOOL_TIERS, getToolTier } from '../entities/tools.js';
import { refreshResourceCursors } from '../entities/farm/farm.js';
import { openModal } from '../ui/modalManager.js';

/** Quantos quadrados cabem na grade sem precisar das setas. */
const RAIL_VISIBLE_DESKTOP = 4;
const RAIL_VISIBLE_NARROW = 2;
const RAIL_NARROW_QUERY = '(max-width: 900px)';
const RAIL_GAP_PX = 14;

/** Deslocamento atual de cada grade da mochila. */
const railOffsets = {
    [INVENTORY_KEYS.AXE]: 0,
    [INVENTORY_KEYS.PICKAXE]: 0,
};

/** Ferramentas exibidas na mochila, na ordem em que aparecem. */
const BACKPACK_SECTIONS = [
    {
        toolKey: INVENTORY_KEYS.AXE,
        equippedKey: INVENTORY_KEYS.EQUIPPED_AXE,
        gridSelector: SELECTORS.AXE_GRID,
        slotSelector: SELECTORS.EQUIPPED_AXE_SLOT,
        emptyLabel: 'Nenhum machado fabricado',
    },
    {
        toolKey: INVENTORY_KEYS.PICKAXE,
        equippedKey: INVENTORY_KEYS.EQUIPPED_PICKAXE,
        gridSelector: SELECTORS.PICKAXE_GRID,
        slotSelector: SELECTORS.EQUIPPED_PICKAXE_SLOT,
        emptyLabel: 'Nenhuma picareta fabricada',
    },
];

/**
 * Cria um elemento com classe e texto já definidos.
 * @param {string} tag - Tag HTML.
 * @param {string} className - Classe CSS.
 * @param {string} [text] - Conteúdo textual.
 * @returns {HTMLElement}
 */
function createElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

/**
 * Atualiza o cartão grande com a ferramenta equipada no momento.
 * @param {Object} section - Definição da seção da mochila.
 */
function renderEquippedCard(section) {
    const slot = document.querySelector(section.slotSelector);
    const equippedLevel = inventory[section.equippedKey];
    const tier = getToolTier(section.toolKey, equippedLevel);
    const image = slot.querySelector('.equipped-card__image');
    const name = slot.querySelector('.equipped-card__name');
    const effect = slot.querySelector('.equipped-card__effect');

    slot.classList.toggle('equipped-card--empty', !tier);

    if (!tier) {
        image.removeAttribute('src');
        image.alt = '';
        name.textContent = section.emptyLabel;
        effect.textContent = 'Fabrique uma no Crafter';
        return;
    }

    image.src = tier.image;
    image.alt = tier.name;
    name.textContent = tier.name;
    effect.textContent = tier.effect;
}

/**
 * Monta um quadrado de ferramenta da grade.
 * @param {Object} section - Definição da seção da mochila.
 * @param {Object} tier - Definição do nível da ferramenta.
 * @returns {HTMLElement}
 */
function createToolSlot(section, tier) {
    const ownedLevel = inventory[section.toolKey];
    const equippedLevel = inventory[section.equippedKey];
    const isOwned = tier.level <= ownedLevel;
    const isEquipped = tier.level === equippedLevel;

    const slot = createElement('button', 'tool-slot');
    slot.type = 'button';

    if (isEquipped) {
        slot.classList.add('tool-slot--equipped');
    } else if (!isOwned) {
        slot.classList.add('tool-slot--locked');
        slot.disabled = true;
    }

    const frame = createElement('span', 'tool-slot__frame');
    const image = document.createElement('img');
    image.className = 'tool-slot__image';
    image.src = tier.image;
    image.alt = tier.name;
    image.draggable = false;
    frame.appendChild(image);

    slot.appendChild(createElement('span', 'tool-slot__tier', 'Nv ' + tier.level));
    slot.appendChild(frame);
    slot.appendChild(createElement('span', 'tool-slot__name', tier.name));

    if (isEquipped) {
        slot.appendChild(createElement('span', 'tool-slot__status', 'Equipado'));
    } else if (isOwned) {
        slot.appendChild(createElement('span', 'tool-slot__status', 'Equipar'));
        slot.title = tier.effect;
    } else {
        slot.appendChild(createElement('span', 'tool-slot__status', 'Bloqueado'));
    }

    if (isOwned && !isEquipped) {
        bindTrustedClick(slot, function () {
            if (equipTool(section.toolKey, tier.level)) {
                refreshInventoryDisplay();
                refreshResourceCursors();
            }
        });
    }

    return slot;
}

/**
 * Quantos slots cabem na viewport da grade no momento.
 * @returns {number}
 */
function getVisibleSlotCount() {
    return window.matchMedia(RAIL_NARROW_QUERY).matches
        ? RAIL_VISIBLE_NARROW
        : RAIL_VISIBLE_DESKTOP;
}

/**
 * Ajusta largura, deslocamento e setas de uma grade da mochila.
 * @param {Object} section - Definição da seção da mochila.
 */
function syncToolRail(section) {
    const grid = document.querySelector(section.gridSelector);
    const rail = grid && typeof grid.closest === 'function' ? grid.closest('.tool-rail') : null;

    if (!rail) {
        return;
    }

    const viewport = rail.querySelector('.tool-rail__viewport');
    const prev = rail.querySelector('.tool-rail__arrow--prev');
    const next = rail.querySelector('.tool-rail__arrow--next');

    if (viewport.clientWidth <= 0) {
        return;
    }

    const slots = Array.from(grid.children);
    const visible = getVisibleSlotCount();
    const maxOffset = Math.max(0, slots.length - visible);
    let offset = railOffsets[section.toolKey] || 0;

    offset = Math.min(offset, maxOffset);
    railOffsets[section.toolKey] = offset;

    const slotWidth = (viewport.clientWidth - RAIL_GAP_PX * (visible - 1)) / visible;

    slots.forEach(function (slot) {
        slot.style.flex = '0 0 ' + slotWidth + 'px';
        slot.style.maxWidth = slotWidth + 'px';
    });

    grid.style.transform = 'translateX(-' + (offset * (slotWidth + RAIL_GAP_PX)) + 'px)';
    prev.disabled = offset <= 0;
    next.disabled = offset >= maxOffset;
}

/**
 * Redesenha a grade de níveis de uma ferramenta.
 * @param {Object} section - Definição da seção da mochila.
 */
function renderToolGrid(section) {
    const grid = document.querySelector(section.gridSelector);
    grid.textContent = '';

    TOOL_TIERS[section.toolKey].forEach(function (tier) {
        grid.appendChild(createToolSlot(section, tier));
    });

    syncToolRail(section);
}

/**
 * Atualiza toda a mochila: cartões equipados e grades de níveis.
 */
export function refreshInventoryDisplay() {
    BACKPACK_SECTIONS.forEach(function (section) {
        renderEquippedCard(section);
        renderToolGrid(section);
    });
}

/**
 * Abre o modal da mochila já atualizado.
 */
export function openInventory() {
    openModal(document.querySelector(SELECTORS.INVENTORY_MODAL));
    refreshInventoryDisplay();
    requestAnimationFrame(function () {
        BACKPACK_SECTIONS.forEach(syncToolRail);
    });
}

/**
 * Liga as setas laterais das grades da mochila.
 */
function initToolRails() {
    BACKPACK_SECTIONS.forEach(function (section) {
        const grid = document.querySelector(section.gridSelector);
        const rail = grid.closest('.tool-rail');

        if (!rail) {
            return;
        }

        bindTrustedClick(rail.querySelector('.tool-rail__arrow--prev'), function () {
            railOffsets[section.toolKey] = Math.max(0, (railOffsets[section.toolKey] || 0) - 1);
            syncToolRail(section);
        });

        bindTrustedClick(rail.querySelector('.tool-rail__arrow--next'), function () {
            railOffsets[section.toolKey] = (railOffsets[section.toolKey] || 0) + 1;
            syncToolRail(section);
        });
    });

    window.addEventListener('resize', function () {
        BACKPACK_SECTIONS.forEach(syncToolRail);
    });
}

/**
 * Registra o listener de abertura da mochila.
 */
export function initInventory() {
    bindTrustedClick(
        document.querySelector(SELECTORS.INVENTORY_TRIGGER),
        openInventory
    );

    initToolRails();
    refreshInventoryDisplay();
}
