import { materials } from '../../core/state.js';
import { getAxeWoodBonus } from '../player.js';
import { refreshHud } from '../../ui/hudManager.js';

/**
 * Coleta madeira ao clicar na árvore, aplicando bônus do machado.
 */
export function harvestTree() {
    materials.wood += 1 + getAxeWoodBonus();
    refreshHud();
}
