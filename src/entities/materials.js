import { MATERIAL_KEYS } from '../utils/constants.js';
import { deepFreeze } from '../utils/freeze.js';

/** Nome e ícone de cada material, usados em custos, vendas e tabelas. */
export const MATERIAL_INFO = deepFreeze({
    [MATERIAL_KEYS.WOOD]: { name: 'Madeira', icon: 'assets/img/iconwood.png' },
    [MATERIAL_KEYS.STONE]: { name: 'Pedra', icon: 'assets/img/iconstone.png' },
    [MATERIAL_KEYS.COAL]: { name: 'Carvão', icon: 'assets/img/iconcarvao.png' },
    [MATERIAL_KEYS.IRON]: { name: 'Ferro', icon: 'assets/img/iconferro.png' },
    [MATERIAL_KEYS.GOLD]: { name: 'Ouro', icon: 'assets/img/iconouro.png' },
    [MATERIAL_KEYS.DIAMOND]: { name: 'Diamante', icon: 'assets/img/icondiamante.png' },
    [MATERIAL_KEYS.IRON_INGOT]: {
        name: 'Lingote de Ferro',
        icon: 'assets/img/metalrefinado.png',
    },
    [MATERIAL_KEYS.GOLD_INGOT]: {
        name: 'Lingote de Ouro',
        icon: 'assets/img/lingoteouro.png',
    },
    [MATERIAL_KEYS.COIN]: { name: 'Moedas', icon: 'assets/img/coin.png' },
});

/**
 * Retorna nome e ícone de um material.
 * @param {string} materialKey - Chave do material.
 * @returns {{name: string, icon: string}}
 */
export function getMaterialInfo(materialKey) {
    return MATERIAL_INFO[materialKey] || MATERIAL_INFO[MATERIAL_KEYS.COIN];
}
