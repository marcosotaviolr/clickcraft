import {
    INVENTORY_KEYS,
    MATERIAL_KEYS,
    CRAFT_COSTS,
    ITEM_LEVEL_NONE,
} from '../../utils/constants.js';

/** Definições das receitas de craft disponíveis. */
export const craftRecipes = [
    {
        itemKey: INVENTORY_KEYS.AXE,
        materialKey: MATERIAL_KEYS.WOOD,
        cost: CRAFT_COSTS.AXE_WOOD,
        requiredLevel: ITEM_LEVEL_NONE,
        rowSelector: '#craft-item-axe-wood',
        buttonSelector: '#craft-axe-wood',
        blueprintKey: INVENTORY_KEYS.AXE_BLUEPRINT,
    },
    {
        itemKey: INVENTORY_KEYS.PICKAXE,
        materialKey: MATERIAL_KEYS.WOOD,
        cost: CRAFT_COSTS.PICKAXE_WOOD,
        requiredLevel: ITEM_LEVEL_NONE,
        rowSelector: '#craft-item-pickaxe-wood',
        buttonSelector: '#craft-pickaxe-wood',
        blueprintKey: INVENTORY_KEYS.PICKAXE_BLUEPRINT,
    },
];
