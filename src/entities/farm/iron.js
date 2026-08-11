import { materials } from '../../core/state.js';
import { canMineOre, getIronHarvestAmount } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';
import { showClickPopup } from '../../ui/clickPopup.js';

/**
 * Coleta ferro ao clicar no minério, se o jogador tiver picareta de pedra.
 * @param {MouseEvent} event - Evento de clique no minério.
 */
export function harvestIron(event) {
    if (!canMineOre()) {
        return;
    }

    const amount = getIronHarvestAmount();
    materials.iron += amount;
    refreshHud();
    showClickPopup(amount, event.currentTarget);
}
