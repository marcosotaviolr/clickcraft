import { islands, addMaterial } from '../../core/state.js';
import { MATERIAL_KEYS } from '../../utils/constants.js';
import { canMineDiamond, getDiamondHarvestAmount } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';
import { showClickPopup } from '../../ui/clickPopup.js';

/**
 * Coleta diamante ao clicar no minério, se a Ilha 2 estiver liberada
 * e o jogador tiver picareta de ouro.
 * @param {MouseEvent} event - Evento de clique no minério.
 */
export function harvestDiamond(event) {
    if (!islands.second || !canMineDiamond()) {
        return;
    }

    const amount = getDiamondHarvestAmount();

    if (!addMaterial(MATERIAL_KEYS.DIAMOND, amount)) {
        return;
    }

    refreshHud();
    showClickPopup(amount, event.currentTarget);
}
