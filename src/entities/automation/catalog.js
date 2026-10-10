import {
    MATERIAL_KEYS,
    AUTOMATION_PRICES,
    ITEM_LEVEL_WOOD,
    ITEM_LEVEL_STONE,
    ITEM_LEVEL_IRON,
    ITEM_LEVEL_GOLD,
} from '../../utils/constants.js';
import { deepFreeze } from '../../utils/freeze.js';

/**
 * Autômatos à venda na Ilha 3. O primeiro nível coleta 1 por segundo;
 * cada melhoria soma +1.
 */
export const automationProducts = deepFreeze([
    {
        automationKey: MATERIAL_KEYS.WOOD,
        price: AUTOMATION_PRICES.WOOD,
        title: 'Autômato de Madeira',
        requiredAxeLevel: ITEM_LEVEL_WOOD,
        requiredPickaxeLevel: 0,
        requiresIslandSecond: false,
        image: 'assets/img/iconwood.png',
    },
    {
        automationKey: MATERIAL_KEYS.STONE,
        price: AUTOMATION_PRICES.STONE,
        title: 'Autômato de Pedra',
        requiredAxeLevel: 0,
        requiredPickaxeLevel: ITEM_LEVEL_WOOD,
        requiresIslandSecond: false,
        image: 'assets/img/iconstone.png',
    },
    {
        automationKey: MATERIAL_KEYS.IRON,
        price: AUTOMATION_PRICES.IRON,
        title: 'Autômato de Ferro',
        requiredAxeLevel: 0,
        requiredPickaxeLevel: ITEM_LEVEL_STONE,
        requiresIslandSecond: true,
        image: 'assets/img/iconferro.png',
    },
    {
        automationKey: MATERIAL_KEYS.COAL,
        price: AUTOMATION_PRICES.COAL,
        title: 'Autômato de Carvão',
        requiredAxeLevel: 0,
        requiredPickaxeLevel: ITEM_LEVEL_STONE,
        requiresIslandSecond: true,
        image: 'assets/img/iconcarvao.png',
    },
    {
        automationKey: MATERIAL_KEYS.GOLD,
        price: AUTOMATION_PRICES.GOLD,
        title: 'Autômato de Ouro',
        requiredAxeLevel: 0,
        requiredPickaxeLevel: ITEM_LEVEL_IRON,
        requiresIslandSecond: true,
        image: 'assets/img/iconouro.png',
    },
    {
        automationKey: MATERIAL_KEYS.DIAMOND,
        price: AUTOMATION_PRICES.DIAMOND,
        title: 'Autômato de Diamante',
        requiredAxeLevel: 0,
        requiredPickaxeLevel: ITEM_LEVEL_GOLD,
        requiresIslandSecond: true,
        image: 'assets/img/icondiamante.png',
    },
]);
