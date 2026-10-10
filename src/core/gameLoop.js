import { AUTOMATION_TICK_MS } from '../utils/constants.js';
import { tickAutomations } from '../systems/automation.js';

/** Identificador do intervalo de automações. */
let automationTimerId = null;

/**
 * Inicia o ciclo contínuo das coletas automáticas.
 */
export function startGameLoop() {
    if (automationTimerId !== null) {
        return;
    }

    automationTimerId = setInterval(tickAutomations, AUTOMATION_TICK_MS);
}
