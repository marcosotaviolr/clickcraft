/** Valores de exibição CSS reutilizados pelo gerenciador de modais. */
export const DISPLAY = {
    BLOCK: 'block',
    NONE: 'none',
    FLEX: 'flex',
};

/** Seletores de elementos do DOM usados pelo jogo. */
export const SELECTORS = {
    MATERIALS_PANEL: '#materials-panel',
    COIN_COUNT: '#coin-count',
    WOOD_COUNT: '#wood-count',
    STONE_COUNT: '#stone-count',
    IRON_COUNT: '#iron-count',
    COAL_COUNT: '#coal-count',
    GOLD_COUNT: '#gold-count',
    IRON_INGOT_COUNT: '#iron-ingot-count',
    GOLD_INGOT_COUNT: '#gold-ingot-count',
    IRON_COUNTER: '#iron-counter',
    COAL_COUNTER: '#coal-counter',
    GOLD_COUNTER: '#gold-counter',
    IRON_INGOT_COUNTER: '#iron-ingot-counter',
    GOLD_INGOT_COUNTER: '#gold-ingot-counter',
    MODAL_CLOSE: '.modal__close',
    CRAFTER_TRIGGER: '#crafter-trigger',
    CRAFTER_MODAL: '#crafter-modal',
    SHOP_TRIGGER: '#shop-trigger',
    SHOP_MODAL: '#shop-modal',
    SHOP_PICKAXE_ROW: '#shop-item-pickaxe-wood',
    SHOP_AXE_ROW: '#shop-item-axe-wood',
    SHOP_AXE_STONE_ROW: '#shop-item-axe-stone',
    SHOP_PICKAXE_STONE_ROW: '#shop-item-pickaxe-stone',
    SHOP_AXE_IRON_ROW: '#shop-item-axe-iron',
    SHOP_PICKAXE_IRON_ROW: '#shop-item-pickaxe-iron',
    SHOP_AXE_GOLD_ROW: '#shop-item-axe-gold',
    SHOP_PICKAXE_GOLD_ROW: '#shop-item-pickaxe-gold',
    SHOP_FURNACE_ROW: '#shop-item-furnace',
    BUY_AXE_BUTTON: '#buy-axe-wood',
    BUY_PICKAXE_BUTTON: '#buy-pickaxe-wood',
    BUY_AXE_STONE_BUTTON: '#buy-axe-stone',
    BUY_PICKAXE_STONE_BUTTON: '#buy-pickaxe-stone',
    BUY_AXE_IRON_BUTTON: '#buy-axe-iron',
    BUY_PICKAXE_IRON_BUTTON: '#buy-pickaxe-iron',
    BUY_AXE_GOLD_BUTTON: '#buy-axe-gold',
    BUY_PICKAXE_GOLD_BUTTON: '#buy-pickaxe-gold',
    BUY_FURNACE_BUTTON: '#buy-furnace',
    CRAFT_AXE_ROW: '#craft-item-axe-wood',
    CRAFT_PICKAXE_ROW: '#craft-item-pickaxe-wood',
    CRAFT_AXE_STONE_ROW: '#craft-item-axe-stone',
    CRAFT_PICKAXE_STONE_ROW: '#craft-item-pickaxe-stone',
    CRAFT_AXE_IRON_ROW: '#craft-item-axe-iron',
    CRAFT_PICKAXE_IRON_ROW: '#craft-item-pickaxe-iron',
    CRAFT_AXE_GOLD_ROW: '#craft-item-axe-gold',
    CRAFT_PICKAXE_GOLD_ROW: '#craft-item-pickaxe-gold',
    CRAFT_FURNACE_ROW: '#craft-item-furnace',
    CRAFT_AXE_BUTTON: '#craft-axe-wood',
    CRAFT_PICKAXE_BUTTON: '#craft-pickaxe-wood',
    CRAFT_AXE_STONE_BUTTON: '#craft-axe-stone',
    CRAFT_PICKAXE_STONE_BUTTON: '#craft-pickaxe-stone',
    CRAFT_AXE_IRON_BUTTON: '#craft-axe-iron',
    CRAFT_PICKAXE_IRON_BUTTON: '#craft-pickaxe-iron',
    CRAFT_AXE_GOLD_BUTTON: '#craft-axe-gold',
    CRAFT_PICKAXE_GOLD_BUTTON: '#craft-pickaxe-gold',
    CRAFT_FURNACE_BUTTON: '#craft-furnace',
    INVENTORY_TRIGGER: '#inventory-trigger',
    SETTINGS_TRIGGER: '#settings-trigger',
    SETTINGS_MODAL: '#settings-modal',
    INVENTORY_MODAL: '#inventory-modal',
    AXE_LEVEL: '#axe-level',
    PICKAXE_LEVEL: '#pickaxe-level',
    TREE_RESOURCE: '.tree-resource',
    STONE_RESOURCE: '.stone-resource',
    IRON_RESOURCE: '.iron-resource',
    COAL_RESOURCE: '.coal-resource',
    GOLD_RESOURCE: '.gold-resource',
    SELL_TRIGGER: '#sell-trigger',
    FURNACE_TRIGGER: '#furnace-trigger',
    FURNACE_MODAL: '#furnace-modal',
    ISLAND_MAP: '#island-map',
    SELL_MODAL: '#sell-modal',
    SELL_TOTAL_VALUE: '#sell-total-value',
    SELL_ALL_BUTTON: '#sell-all-button',
    SELL_WOOD_QUANTITY: '#sell-wood-quantity',
    SELL_WOOD_TOTAL: '#sell-wood-total',
    SELL_WOOD_INPUT: '#sell-wood-input',
    SELL_WOOD_BUTTON: '#sell-wood-button',
    SELL_WOOD_ALL_BUTTON: '#sell-wood-all-button',
    SELL_STONE_QUANTITY: '#sell-stone-quantity',
    SELL_STONE_TOTAL: '#sell-stone-total',
    SELL_STONE_INPUT: '#sell-stone-input',
    SELL_STONE_BUTTON: '#sell-stone-button',
    SELL_STONE_ALL_BUTTON: '#sell-stone-all-button',
    SELL_IRON_ROW: '#sell-item-iron',
    SELL_IRON_QUANTITY: '#sell-iron-quantity',
    SELL_IRON_TOTAL: '#sell-iron-total',
    SELL_IRON_INPUT: '#sell-iron-input',
    SELL_IRON_BUTTON: '#sell-iron-button',
    SELL_IRON_ALL_BUTTON: '#sell-iron-all-button',
    SELL_COAL_ROW: '#sell-item-coal',
    SELL_COAL_QUANTITY: '#sell-coal-quantity',
    SELL_COAL_TOTAL: '#sell-coal-total',
    SELL_COAL_INPUT: '#sell-coal-input',
    SELL_COAL_BUTTON: '#sell-coal-button',
    SELL_COAL_ALL_BUTTON: '#sell-coal-all-button',
    SELL_GOLD_ROW: '#sell-item-gold',
    SELL_GOLD_QUANTITY: '#sell-gold-quantity',
    SELL_GOLD_TOTAL: '#sell-gold-total',
    SELL_GOLD_INPUT: '#sell-gold-input',
    SELL_GOLD_BUTTON: '#sell-gold-button',
    SELL_GOLD_ALL_BUTTON: '#sell-gold-all-button',
    ISLAND_SECOND: '#island-second',
    ISLAND_SECOND_LOCK: '#island-second-lock',
    ISLAND_SECOND_RESOURCES: '#island-second-resources',
    UNLOCK_ISLAND_SECOND: '#unlock-island-second',
    ISLAND_THIRD: '#island-third',
    ISLAND_THIRD_LOCK: '#island-third-lock',
    UNLOCK_ISLAND_THIRD: '#unlock-island-third',
};

/** Chaves de materiais no estado global. */
export const MATERIAL_KEYS = {
    WOOD: 'wood',
    STONE: 'stone',
    IRON: 'iron',
    COAL: 'coal',
    GOLD: 'gold',
    IRON_INGOT: 'ironIngot',
    GOLD_INGOT: 'goldIngot',
    COIN: 'coin',
};

/** Chaves de itens no inventário do jogador. */
export const INVENTORY_KEYS = {
    AXE_BLUEPRINT: 'axeBlueprint',
    PICKAXE_BLUEPRINT: 'pickaxeBlueprint',
    AXE_STONE_BLUEPRINT: 'axeStoneBlueprint',
    PICKAXE_STONE_BLUEPRINT: 'pickaxeStoneBlueprint',
    AXE_IRON_BLUEPRINT: 'axeIronBlueprint',
    PICKAXE_IRON_BLUEPRINT: 'pickaxeIronBlueprint',
    AXE_GOLD_BLUEPRINT: 'axeGoldBlueprint',
    PICKAXE_GOLD_BLUEPRINT: 'pickaxeGoldBlueprint',
    FURNACE_BLUEPRINT: 'furnaceBlueprint',
    AXE: 'axe',
    PICKAXE: 'pickaxe',
    FURNACE: 'furnace',
};

/** Níveis de ferramentas. */
export const ITEM_LEVEL_NONE = 0;
export const ITEM_LEVEL_WOOD = 1;
export const ITEM_LEVEL_STONE = 2;
export const ITEM_LEVEL_IRON = 3;
export const ITEM_LEVEL_GOLD = 4;

/** Preços de compra na loja (médio/difícil). */
export const SHOP_PRICES = {
    AXE_BLUEPRINT: 200,
    PICKAXE_BLUEPRINT: 280,
    AXE_STONE_BLUEPRINT: 500,
    PICKAXE_STONE_BLUEPRINT: 600,
    AXE_IRON_BLUEPRINT: 900,
    PICKAXE_IRON_BLUEPRINT: 1100,
    AXE_GOLD_BLUEPRINT: 1800,
    PICKAXE_GOLD_BLUEPRINT: 2200,
    FURNACE_BLUEPRINT: 450,
};

/** Custos de craft (médio/difícil). */
export const CRAFT_COSTS = {
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
    FURNACE_STONE: 300,
};

/** Quantidade de blueprint possuída após a compra. */
export const BLUEPRINT_OWNED = 1;

/** Preços unitários de venda de materiais (em moedas). */
export const SELL_PRICES = {
    WOOD: 1,
    STONE: 1,
    IRON: 2,
    COAL: 1,
    GOLD: 4,
};

/** Preços para desbloquear ilhas (em moedas). */
export const ISLAND_PRICES = {
    SECOND: 2500,
    THIRD: 30000,
};

/** Tempo padrão de fundição por lingote (ms). */
export const FURNACE_DURATION_MS = 15000;

/** Receitas de fundição da fornalha. */
export const FURNACE_RECIPES = {
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
