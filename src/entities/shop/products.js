import {
    INVENTORY_KEYS,
    SHOP_PRICES,
    ITEM_LEVEL_NONE,
} from '../../utils/constants.js';

/** Definições dos produtos disponíveis na loja. */
export const shopProducts = [
    {
        itemKey: INVENTORY_KEYS.AXE_BLUEPRINT,
        price: SHOP_PRICES.AXE_BLUEPRINT,
        requiredLevel: ITEM_LEVEL_NONE,
        rowSelector: '#shop-item-axe-wood',
        buttonSelector: '#buy-axe-wood',
    },
    {
        itemKey: INVENTORY_KEYS.PICKAXE_BLUEPRINT,
        price: SHOP_PRICES.PICKAXE_BLUEPRINT,
        requiredLevel: ITEM_LEVEL_NONE,
        rowSelector: '#shop-item-pickaxe-wood',
        buttonSelector: '#buy-pickaxe-wood',
    },
];
