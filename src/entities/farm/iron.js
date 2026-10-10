import { islands, addMaterial } from '../../core/state.js';
import { MATERIAL_KEYS } from '../../utils/constants.js';
import { canMineOre, getIronHarvestAmount } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';
import { showClickPopup } from '../../ui/clickPopup.js';

/**
 * Coleta ferro ao clicar no minério, se a Ilha 2 estiver liberada
 * e o jogador tiver picareta de pedra.
 * @param {MouseEvent} event - Evento de clique no minério.
 */
export function harvestIron(event) {
    if (!islands.second || !canMineOre()) {
        return;
    }

    const amount = getIronHarvestAmount();

    if (!addMaterial(MATERIAL_KEYS.IRON, amount)) {
        return;
    }

    refreshHud();
    showClickPopup(amount, event.currentTarget);
}
