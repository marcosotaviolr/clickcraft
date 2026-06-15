import { materials } from '../core/state.js';
import { SELECTORS } from '../utils/constants.js';
import { refreshHud } from '../ui/hudManager.js';

/**
 * Vende madeira por moedas; Ctrl+clique vende toda a madeira de uma vez.
 * @param {MouseEvent} event - Evento de clique no botão de venda.
 */
export function sellWood(event) {
    if (materials.wood > 0) {
        if (event.ctrlKey) {
            materials.coin += materials.wood;
            materials.wood = materials.wood - materials.wood;
        } else {
            materials.wood--;
            materials.coin++;
        }
    }
    refreshHud();
}

/**
 * Registra o listener de venda de madeira.
 */
export function initSell() {
    const sellTrigger = document.querySelector(SELECTORS.SELL_TRIGGER);

    sellTrigger.addEventListener('click', sellWood);
}
