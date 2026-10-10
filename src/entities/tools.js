import {
    INVENTORY_KEYS,
    ITEM_LEVEL_WOOD,
    ITEM_LEVEL_STONE,
    ITEM_LEVEL_IRON,
    ITEM_LEVEL_GOLD,
    ITEM_LEVEL_DIAMOND,
} from '../utils/constants.js';
import { deepFreeze } from '../utils/freeze.js';

/**
 * Catálogo das ferramentas por nível: imagem, nome e efeito.
 * Usado pela mochila para montar os quadrados de equipamento.
 */
export const TOOL_TIERS = deepFreeze({
    [INVENTORY_KEYS.AXE]: [
        {
            level: ITEM_LEVEL_WOOD,
            name: 'Madeira',
            image: 'assets/img/machadomadeira.png',
            effect: '2 madeiras por clique',
        },
        {
            level: ITEM_LEVEL_STONE,
            name: 'Pedra',
            image: 'assets/img/axe.png',
            effect: '3 madeiras por clique',
        },
        {
            level: ITEM_LEVEL_IRON,
            name: 'Ferro',
            image: 'assets/img/machadoferro.png',
            effect: '4 madeiras por clique',
        },
        {
            level: ITEM_LEVEL_GOLD,
            name: 'Ouro',
            image: 'assets/img/machadoouro.png',
            effect: '5 madeiras por clique',
        },
        {
            level: ITEM_LEVEL_DIAMOND,
            name: 'Diamante',
            image: 'assets/img/machadodiamante.png',
            effect: '6 madeiras por clique',
        },
    ],
    [INVENTORY_KEYS.PICKAXE]: [
        {
            level: ITEM_LEVEL_WOOD,
            name: 'Madeira',
            image: 'assets/img/picaretamadeira.png',
            effect: '1 pedra por clique',
        },
        {
            level: ITEM_LEVEL_STONE,
            name: 'Pedra',
            image: 'assets/img/picaxe.png',
            effect: '2 pedras · libera ferro e carvão',
        },
        {
            level: ITEM_LEVEL_IRON,
            name: 'Ferro',
            image: 'assets/img/picaretaferro.png',
            effect: '3 pedras · 2 ferros · 2 carvões · libera ouro',
        },
        {
            level: ITEM_LEVEL_GOLD,
            name: 'Ouro',
            image: 'assets/img/picaretaouro.png',
            effect: '4 pedras · 3 ferros · 3 carvões · 2 ouros · libera diamante',
        },
        {
            level: ITEM_LEVEL_DIAMOND,
            name: 'Diamante',
            image: 'assets/img/picaretadiamante.png',
            effect: '5 pedras · 4 ferros · 4 carvões · 3 ouros · 2 diamantes',
        },
    ],
});

/**
 * Retorna a definição de um nível específico de ferramenta.
 * @param {string} toolKey - `axe` ou `pickaxe`.
 * @param {number} level - Nível procurado.
 * @returns {Object|null}
 */
export function getToolTier(toolKey, level) {
    const tiers = TOOL_TIERS[toolKey];

    if (!tiers) {
        return null;
    }

    return tiers.find(function (tier) {
        return tier.level === level;
    }) || null;
}
