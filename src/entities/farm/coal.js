import { materials } from '../../core/state.js';
import { canMineOre, getCoalHarvestAmount } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';
import { showClickPopup } from '../../ui/clickPopup.js';

/**
 * Coleta carvão ao clicar no minério, se o jogador tiver picareta de pedra.
 * @param {MouseEvent} event - Evento de clique no minério.
 */
export function harvestCoal(event) {
    if (!canMineOre()) {
        return;
    }

    const amount = getCoalHarvestAmount();
    materials.coal += amount;
    refreshHud();
    showClickPopup(amount, event.currentTarget);
}
