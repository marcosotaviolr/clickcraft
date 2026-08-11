import { materials } from '../../core/state.js';
import { canMineStone, getStoneHarvestAmount } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';
import { showClickPopup } from '../../ui/clickPopup.js';

/**
 * Coleta pedra ao clicar na rocha, se o jogador possuir picareta.
 * @param {MouseEvent} event - Evento de clique na pedra.
 */
export function harvestStone(event) {
    if (canMineStone()) {
        const amount = getStoneHarvestAmount();
        materials.stone += amount;
        refreshHud();
        showClickPopup(amount, event.currentTarget);
    }
}
