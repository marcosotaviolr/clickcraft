import {
    INVENTORY_KEYS,
    MATERIAL_KEYS,
    CRAFT_COSTS,
    ITEM_LEVEL_NONE,
    ITEM_LEVEL_WOOD,
    ITEM_LEVEL_STONE,
    ITEM_LEVEL_IRON,
} from '../../utils/constants.js';

/** Definições das receitas de craft disponíveis. */
export const craftRecipes = [
    {
        itemKey: INVENTORY_KEYS.AXE,
        costs: [{ materialKey: MATERIAL_KEYS.WOOD, amount: CRAFT_COSTS.AXE_WOOD }],
        requiredLevel: ITEM_LEVEL_NONE,
        rowSelector: '#craft-item-axe-wood',
        buttonSelector: '#craft-axe-wood',
        blueprintKey: INVENTORY_KEYS.AXE_BLUEPRINT,
    },
    {
        itemKey: INVENTORY_KEYS.PICKAXE,
        costs: [{ materialKey: MATERIAL_KEYS.WOOD, amount: CRAFT_COSTS.PICKAXE_WOOD }],
        requiredLevel: ITEM_LEVEL_NONE,
        rowSelector: '#craft-item-pickaxe-wood',
        buttonSelector: '#craft-pickaxe-wood',
        blueprintKey: INVENTORY_KEYS.PICKAXE_BLUEPRINT,
    },
    {
        itemKey: INVENTORY_KEYS.FURNACE,
        costs: [{ materialKey: MATERIAL_KEYS.STONE, amount: CRAFT_COSTS.FURNACE_STONE }],
        requiredLevel: ITEM_LEVEL_NONE,
        rowSelector: '#craft-item-furnace',
        buttonSelector: '#craft-furnace',
        blueprintKey: INVENTORY_KEYS.FURNACE_BLUEPRINT,
    },
    {
        itemKey: INVENTORY_KEYS.AXE,
        costs: [
            { materialKey: MATERIAL_KEYS.WOOD, amount: CRAFT_COSTS.AXE_STONE_WOOD },
            { materialKey: MATERIAL_KEYS.STONE, amount: CRAFT_COSTS.AXE_STONE_STONE },
        ],
        requiredLevel: ITEM_LEVEL_WOOD,
        rowSelector: '#craft-item-axe-stone',
        buttonSelector: '#craft-axe-stone',
        blueprintKey: INVENTORY_KEYS.AXE_STONE_BLUEPRINT,
    },
    {
        itemKey: INVENTORY_KEYS.PICKAXE,
        costs: [
            { materialKey: MATERIAL_KEYS.WOOD, amount: CRAFT_COSTS.PICKAXE_STONE_WOOD },
            { materialKey: MATERIAL_KEYS.STONE, amount: CRAFT_COSTS.PICKAXE_STONE_STONE },
        ],
        requiredLevel: ITEM_LEVEL_WOOD,
        rowSelector: '#craft-item-pickaxe-stone',
        buttonSelector: '#craft-pickaxe-stone',
        blueprintKey: INVENTORY_KEYS.PICKAXE_STONE_BLUEPRINT,
    },
    {
        itemKey: INVENTORY_KEYS.AXE,
        costs: [
            { materialKey: MATERIAL_KEYS.WOOD, amount: CRAFT_COSTS.AXE_IRON_WOOD },
            { materialKey: MATERIAL_KEYS.IRON_INGOT, amount: CRAFT_COSTS.AXE_IRON_INGOT },
        ],
        requiredLevel: ITEM_LEVEL_STONE,
        rowSelector: '#craft-item-axe-iron',
        buttonSelector: '#craft-axe-iron',
        blueprintKey: INVENTORY_KEYS.AXE_IRON_BLUEPRINT,
    },
    {
        itemKey: INVENTORY_KEYS.PICKAXE,
        costs: [
            { materialKey: MATERIAL_KEYS.WOOD, amount: CRAFT_COSTS.PICKAXE_IRON_WOOD },
            { materialKey: MATERIAL_KEYS.IRON_INGOT, amount: CRAFT_COSTS.PICKAXE_IRON_INGOT },
        ],
        requiredLevel: ITEM_LEVEL_STONE,
        rowSelector: '#craft-item-pickaxe-iron',
        buttonSelector: '#craft-pickaxe-iron',
        blueprintKey: INVENTORY_KEYS.PICKAXE_IRON_BLUEPRINT,
    },
    {
        itemKey: INVENTORY_KEYS.AXE,
        costs: [
            { materialKey: MATERIAL_KEYS.WOOD, amount: CRAFT_COSTS.AXE_GOLD_WOOD },
            { materialKey: MATERIAL_KEYS.GOLD_INGOT, amount: CRAFT_COSTS.AXE_GOLD_INGOT },
        ],
        requiredLevel: ITEM_LEVEL_IRON,
        rowSelector: '#craft-item-axe-gold',
        buttonSelector: '#craft-axe-gold',
        blueprintKey: INVENTORY_KEYS.AXE_GOLD_BLUEPRINT,
    },
    {
        itemKey: INVENTORY_KEYS.PICKAXE,
        costs: [
            { materialKey: MATERIAL_KEYS.WOOD, amount: CRAFT_COSTS.PICKAXE_GOLD_WOOD },
            { materialKey: MATERIAL_KEYS.GOLD_INGOT, amount: CRAFT_COSTS.PICKAXE_GOLD_INGOT },
        ],
        requiredLevel: ITEM_LEVEL_IRON,
        rowSelector: '#craft-item-pickaxe-gold',
        buttonSelector: '#craft-pickaxe-gold',
        blueprintKey: INVENTORY_KEYS.PICKAXE_GOLD_BLUEPRINT,
    },
];
