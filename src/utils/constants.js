import { deepFreeze } from './freeze.js';

/** Valores de exibição CSS reutilizados pelo gerenciador de modais. */
export const DISPLAY = deepFreeze({
    BLOCK: 'block',
    NONE: 'none',
    FLEX: 'flex',
});

/** Classe que deixa um modal visível. */
export const MODAL_OPEN_CLASS = 'modal--open';

/** Classe no body enquanto qualquer modal está aberto. */
export const BODY_MODAL_OPEN_CLASS = 'is-modal-open';

/** Seletores de elementos do DOM usados pelo jogo. */
export const SELECTORS = deepFreeze({
    MATERIALS_PANEL: '#materials-panel',
    COIN_COUNT: '#coin-count',
    WOOD_COUNT: '#wood-count',
    STONE_COUNT: '#stone-count',
    IRON_COUNT: '#iron-count',
    COAL_COUNT: '#coal-count',
    GOLD_COUNT: '#gold-count',
    DIAMOND_COUNT: '#diamond-count',
    IRON_INGOT_COUNT: '#iron-ingot-count',
    GOLD_INGOT_COUNT: '#gold-ingot-count',
    IRON_COUNTER: '#iron-counter',
    COAL_COUNTER: '#coal-counter',
    GOLD_COUNTER: '#gold-counter',
    DIAMOND_COUNTER: '#diamond-counter',
    IRON_INGOT_COUNTER: '#iron-ingot-counter',
    GOLD_INGOT_COUNTER: '#gold-ingot-counter',
    MODAL_CLOSE: '.modal__close',
    CRAFTER_TRIGGER: '#crafter-trigger',
    CRAFTER_MODAL: '#crafter-modal',
    SHOP_TRIGGER: '#shop-trigger',
    SHOP_MODAL: '#shop-modal',
    SHOP_ITEM_LIST: '#shop-item-list',
    SHOP_EMPTY_MESSAGE: '#shop-empty-message',
    CRAFT_ITEM_LIST: '#craft-item-list',
    CRAFT_EMPTY_MESSAGE: '#craft-empty-message',
    INVENTORY_TRIGGER: '#inventory-trigger',
    SETTINGS_TRIGGER: '#settings-trigger',
    SETTINGS_MODAL: '#settings-modal',
    INVENTORY_MODAL: '#inventory-modal',
    AXE_GRID: '#axe-grid',
    PICKAXE_GRID: '#pickaxe-grid',
    EQUIPPED_AXE_SLOT: '#equipped-axe-slot',
    EQUIPPED_PICKAXE_SLOT: '#equipped-pickaxe-slot',
    SETTINGS_PRICE_TABLE: '#settings-price-table',
    SETTINGS_POPUP_TOGGLE: '#settings-popup-toggle',
    SETTINGS_RESET_BUTTON: '#settings-reset-button',
    TREE_RESOURCE: '.tree-resource',
    STONE_RESOURCE: '.stone-resource',
    IRON_RESOURCE: '.iron-resource',
    COAL_RESOURCE: '.coal-resource',
    GOLD_RESOURCE: '.gold-resource',
    DIAMOND_RESOURCE: '.diamond-resource',
    SELL_TRIGGER: '#sell-trigger',
    FURNACE_TRIGGER: '#furnace-trigger',
    FURNACE_MODAL: '#furnace-modal',
    FURNACE_LIST: '#furnace-list',
    AUTOMATION_TRIGGER: '#automation-trigger',
    AUTOMATION_MODAL: '#automation-modal',
    AUTOMATION_ITEM_LIST: '#automation-item-list',
    AUTOMATION_EMPTY_MESSAGE: '#automation-empty-message',
    ISLAND_MAP: '#island-map',
    SELL_MODAL: '#sell-modal',
    SELL_ITEM_LIST: '#sell-item-list',
    SELL_TOTAL_VALUE: '#sell-total-value',
    SELL_ALL_BUTTON: '#sell-all-button',
    SELL_IRON_ROW: '#sell-item-iron',
    SELL_COAL_ROW: '#sell-item-coal',
    SELL_GOLD_ROW: '#sell-item-gold',
    SELL_DIAMOND_ROW: '#sell-item-diamond',
    ISLAND_SECOND: '#island-second',
    ISLAND_SECOND_LOCK: '#island-second-lock',
    ISLAND_SECOND_RESOURCES: '#island-second-resources',
    ISLAND_SECOND_PRICE: '#island-second-price',
    UNLOCK_ISLAND_SECOND: '#unlock-island-second',
    ISLAND_THIRD: '#island-third',
    ISLAND_THIRD_LOCK: '#island-third-lock',
    ISLAND_THIRD_RESOURCES: '#island-third-resources',
    ISLAND_THIRD_PRICE: '#island-third-price',
    UNLOCK_ISLAND_THIRD: '#unlock-island-third',
    PLAYER_LEVEL: '#player-level',
    XP_BAR_FILL: '#xp-bar-fill',
    XP_BAR_LABEL: '#xp-bar-label',
    XP_BAR: '#xp-bar',
});

/** Chaves de materiais no estado global. */
export const MATERIAL_KEYS = deepFreeze({
    WOOD: 'wood',
    STONE: 'stone',
    IRON: 'iron',
    COAL: 'coal',
    GOLD: 'gold',
    DIAMOND: 'diamond',
    IRON_INGOT: 'ironIngot',
    GOLD_INGOT: 'goldIngot',
    COIN: 'coin',
});

/** Materiais de coleta que geram XP. */
export const HARVEST_XP_KEYS = deepFreeze({
    [MATERIAL_KEYS.WOOD]: true,
    [MATERIAL_KEYS.STONE]: true,
    [MATERIAL_KEYS.IRON]: true,
    [MATERIAL_KEYS.COAL]: true,
    [MATERIAL_KEYS.GOLD]: true,
    [MATERIAL_KEYS.DIAMOND]: true,
});

/** XP por unidade coletada. */
export const XP_PER_MATERIAL = 1;

/** XP necessário para o próximo nível: base × nível atual. */
export const XP_BASE_PER_LEVEL = 40;

/** Nível máximo do jogador. */
export const PLAYER_MAX_LEVEL = 99;

/**
 * XP necessário para sair do nível informado.
 * @param {number} level - Nível atual.
 * @returns {number}
 */
export function getXpRequiredForLevel(level) {
    return XP_BASE_PER_LEVEL * level;
}

/** Chaves das ilhas no estado global. */
export const ISLAND_KEYS = deepFreeze({
    SECOND: 'second',
    THIRD: 'third',
});

/** Chaves de itens no inventário do jogador. */
export const INVENTORY_KEYS = deepFreeze({
    AXE_BLUEPRINT: 'axeBlueprint',
    PICKAXE_BLUEPRINT: 'pickaxeBlueprint',
    AXE_STONE_BLUEPRINT: 'axeStoneBlueprint',
    PICKAXE_STONE_BLUEPRINT: 'pickaxeStoneBlueprint',
    AXE_IRON_BLUEPRINT: 'axeIronBlueprint',
    PICKAXE_IRON_BLUEPRINT: 'pickaxeIronBlueprint',
    AXE_GOLD_BLUEPRINT: 'axeGoldBlueprint',
    PICKAXE_GOLD_BLUEPRINT: 'pickaxeGoldBlueprint',
    AXE_DIAMOND_BLUEPRINT: 'axeDiamondBlueprint',
    PICKAXE_DIAMOND_BLUEPRINT: 'pickaxeDiamondBlueprint',
    FURNACE_BLUEPRINT: 'furnaceBlueprint',
    AXE: 'axe',
    PICKAXE: 'pickaxe',
    FURNACE: 'furnace',
    EQUIPPED_AXE: 'equippedAxe',
    EQUIPPED_PICKAXE: 'equippedPickaxe',
});

/** Níveis de ferramentas. */
export const ITEM_LEVEL_NONE = 0;
export const ITEM_LEVEL_WOOD = 1;
export const ITEM_LEVEL_STONE = 2;
export const ITEM_LEVEL_IRON = 3;
export const ITEM_LEVEL_GOLD = 4;
export const ITEM_LEVEL_DIAMOND = 5;

/**
 * Economia de teste: zera preços, custos e tempo da fornalha.
 * Os números reais ficam em LIVE_* abaixo.
 */
export const TEST_ECONOMY = false;

/**
 * Zera todos os valores numéricos de uma tabela de economia.
 * @param {Object} values - Tabela original.
 * @returns {Object}
 */
function applyEconomy(values) {
    if (!TEST_ECONOMY) {
        return values;
    }

    const zeroed = {};

    Object.keys(values).forEach(function (key) {
        zeroed[key] = 0;
    });

    return zeroed;
}

/** Preços de compra na loja (médio/difícil). */
const LIVE_SHOP_PRICES = {
    AXE_BLUEPRINT: 200,
    PICKAXE_BLUEPRINT: 280,
    AXE_STONE_BLUEPRINT: 500,
    PICKAXE_STONE_BLUEPRINT: 600,
    AXE_IRON_BLUEPRINT: 900,
    PICKAXE_IRON_BLUEPRINT: 1100,
    AXE_GOLD_BLUEPRINT: 1800,
    PICKAXE_GOLD_BLUEPRINT: 2200,
    AXE_DIAMOND_BLUEPRINT: 5200,
    PICKAXE_DIAMOND_BLUEPRINT: 6800,
    FURNACE_BLUEPRINT: 450,
};

export const SHOP_PRICES = deepFreeze(applyEconomy(LIVE_SHOP_PRICES));

/** Custos de craft (médio/difícil). */
const LIVE_CRAFT_COSTS = {
    AXE_WOOD: 80,
    PICKAXE_WOOD: 150,
    AXE_STONE_WOOD: 220,
    AXE_STONE_STONE: 160,
    PICKAXE_STONE_WOOD: 280,
    PICKAXE_STONE_STONE: 180,
    AXE_IRON_WOOD: 300,
    AXE_IRON_INGOT: 75,
    PICKAXE_IRON_WOOD: 350,
    PICKAXE_IRON_INGOT: 100,
    AXE_GOLD_WOOD: 400,
    AXE_GOLD_INGOT: 60,
    PICKAXE_GOLD_WOOD: 450,
    PICKAXE_GOLD_INGOT: 80,
    AXE_DIAMOND_WOOD: 500,
    AXE_DIAMOND: 70,
    PICKAXE_DIAMOND_WOOD: 550,
    PICKAXE_DIAMOND: 90,
    FURNACE_STONE: 300,
};

export const CRAFT_COSTS = deepFreeze(applyEconomy(LIVE_CRAFT_COSTS));

/** Quantidade de blueprint possuída após a compra. */
export const BLUEPRINT_OWNED = 1;

/** Preços unitários de venda de materiais (em moedas). */
const LIVE_SELL_PRICES = {
    WOOD: 1,
    STONE: 1,
    IRON: 2,
    COAL: 1,
    GOLD: 4,
    DIAMOND: 6,
};

export const SELL_PRICES = deepFreeze(applyEconomy(LIVE_SELL_PRICES));

/** Preços para desbloquear ilhas (em moedas). */
const LIVE_ISLAND_PRICES = {
    SECOND: 2500,
    THIRD: 30000,
};

export const ISLAND_PRICES = deepFreeze(applyEconomy(LIVE_ISLAND_PRICES));

/** Preço-base do primeiro nível de cada autômato (o próximo custa base × nível). */
const LIVE_AUTOMATION_PRICES = {
    WOOD: 2000,
    STONE: 2500,
    IRON: 4000,
    COAL: 3500,
    GOLD: 7000,
    DIAMOND: 11000,
};

export const AUTOMATION_PRICES = deepFreeze(applyEconomy(LIVE_AUTOMATION_PRICES));

/** Nível máximo de cada autômato. */
export const AUTOMATION_MAX_LEVEL = 10;

/** Intervalo entre coletas automáticas (1 por segundo no nível 1). */
export const AUTOMATION_TICK_MS = 1000;

/** Tempo padrão de fundição por lingote (ms). */
const LIVE_FURNACE_DURATION_MS = 8000;

export const FURNACE_DURATION_MS = TEST_ECONOMY ? 0 : LIVE_FURNACE_DURATION_MS;

/** Receitas de fundição da fornalha. */
const LIVE_FURNACE_RECIPES = {
    IRON: {
        oreKey: 'iron',
        orePerIngot: 1,
        coalPerIngot: 1,
        outputKey: 'ironIngot',
    },
    GOLD: {
        oreKey: 'gold',
        orePerIngot: 2,
        coalPerIngot: 4,
        outputKey: 'goldIngot',
    },
};

export const FURNACE_RECIPES = deepFreeze(
    TEST_ECONOMY
        ? {
            IRON: { ...LIVE_FURNACE_RECIPES.IRON, orePerIngot: 0, coalPerIngot: 0 },
            GOLD: { ...LIVE_FURNACE_RECIPES.GOLD, orePerIngot: 0, coalPerIngot: 0 },
        }
        : LIVE_FURNACE_RECIPES
);
