import { addMaterial } from '../../core/state.js';
import { MATERIAL_KEYS } from '../../utils/constants.js';
import { getWoodHarvestAmount } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';
import { showClickPopup } from '../../ui/clickPopup.js';

/**
 * Coleta madeira ao clicar na árvore, aplicando o nível do machado.
 * @param {MouseEvent} event - Evento de clique na árvore.
 */
export function harvestTree(event) {
    const amount = getWoodHarvestAmount();

    if (!addMaterial(MATERIAL_KEYS.WOOD, amount)) {
        return;
    }

    refreshHud();
    showClickPopup(amount, event.currentTarget);
}
