import { addMaterial } from '../../core/state.js';
import { MATERIAL_KEYS } from '../../utils/constants.js';
import { canMineStone, getStoneHarvestAmount } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';
import { showClickPopup } from '../../ui/clickPopup.js';

/**
 * Coleta pedra ao clicar na rocha, se o jogador possuir picareta.
 * @param {MouseEvent} event - Evento de clique na pedra.
 */
export function harvestStone(event) {
    if (!canMineStone()) {
        return;
    }

    const amount = getStoneHarvestAmount();

    if (!addMaterial(MATERIAL_KEYS.STONE, amount)) {
        return;
    }

    refreshHud();
    showClickPopup(amount, event.currentTarget);
}
