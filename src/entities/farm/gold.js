import { islands, addMaterial } from '../../core/state.js';
import { MATERIAL_KEYS } from '../../utils/constants.js';
import { canMineGold, getGoldHarvestAmount } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';
import { showClickPopup } from '../../ui/clickPopup.js';

/**
 * Coleta ouro ao clicar no minério, se a Ilha 2 estiver liberada
 * e o jogador tiver picareta de ferro.
 * @param {MouseEvent} event - Evento de clique no minério.
 */
export function harvestGold(event) {
    if (!islands.second || !canMineGold()) {
        return;
    }

    const amount = getGoldHarvestAmount();

    if (!addMaterial(MATERIAL_KEYS.GOLD, amount)) {
        return;
    }

    refreshHud();
    showClickPopup(amount, event.currentTarget);
}
