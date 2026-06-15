import { SELECTORS } from '../utils/constants.js';

/**
 * Retorna o elemento container do mapa de ilhas.
 * @returns {HTMLElement|null}
 */
export function getIslandMapElement() {
    return document.querySelector(SELECTORS.ISLAND_MAP);
}
