import { materials } from '../../core/state.js';
import { canMineGold } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';
import { showClickPopup } from '../../ui/clickPopup.js';

/**
 * Coleta ouro ao clicar no minério, se o jogador tiver picareta de ferro.
 * @param {MouseEvent} event - Evento de clique no minério.
 */
export function harvestGold(event) {
    if (canMineGold()) {
        materials.gold += 1;
        refreshHud();
        showClickPopup(1, event.currentTarget);
    }
}
