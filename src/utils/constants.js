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
    MODAL_CLOSE: '.modal__close',
    CRAFTER_TRIGGER: '#crafter-trigger',
    CRAFTER_MODAL: '#crafter-modal',
    SHOP_TRIGGER: '#shop-trigger',
    SHOP_MODAL: '#shop-modal',
    SHOP_PICKAXE_ROW: '#shop-item-pickaxe-wood',
    SHOP_AXE_ROW: '#shop-item-axe-wood',
    BUY_AXE_BUTTON: '#buy-axe-wood',
    BUY_PICKAXE_BUTTON: '#buy-pickaxe-wood',
    CRAFT_AXE_ROW: '#craft-item-axe-wood',
    CRAFT_PICKAXE_ROW: '#craft-item-pickaxe-wood',
    CRAFT_AXE_BUTTON: '#craft-axe-wood',
    CRAFT_PICKAXE_BUTTON: '#craft-pickaxe-wood',
    INVENTORY_TRIGGER: '#inventory-trigger',
    SETTINGS_TRIGGER: '#settings-trigger',
    SETTINGS_MODAL: '#settings-modal',
    INVENTORY_MODAL: '#inventory-modal',
    AXE_LEVEL: '#axe-level',
    PICKAXE_LEVEL: '#pickaxe-level',
    TREE_RESOURCE: '.tree-resource',
    STONE_RESOURCE: '.stone-resource',
    SELL_TRIGGER: '#sell-trigger',
    ISLAND_MAP: '#island-map',
};

/** Chaves de materiais no estado global. */
export const MATERIAL_KEYS = {
    WOOD: 'wood',
    STONE: 'stone',
    COIN: 'coin',
};

/** Chaves de itens no inventário do jogador. */
export const INVENTORY_KEYS = {
    AXE_BLUEPRINT: 'axeBlueprint',
    PICKAXE_BLUEPRINT: 'pickaxeBlueprint',
    AXE: 'axe',
    PICKAXE: 'pickaxe',
};

/** Nível inicial de um item antes da compra ou craft. */
export const ITEM_LEVEL_NONE = 0;

/** Preços de compra na loja (valores reais da lógica do jogo). */
export const SHOP_PRICES = {
    AXE_BLUEPRINT: 10,
    PICKAXE_BLUEPRINT: 10,
};

/** Custos de craft em madeira (valores reais da lógica do jogo). */
export const CRAFT_COSTS = {
    AXE_WOOD: 10,
    PICKAXE_WOOD: 10,
};

/** Quantidade de blueprint possuída após a compra. */
export const BLUEPRINT_OWNED = 1;
