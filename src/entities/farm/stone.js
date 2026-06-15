import { materials } from '../../core/state.js';
import { canMineStone, getPickaxeStoneBonus } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';

/**
 * Coleta pedra ao clicar na rocha, se o jogador possuir picareta.
 */
export function harvestStone() {
    if (canMineStone()) {
        materials.stone += getPickaxeStoneBonus();
        refreshHud();
    }
}
