/**
 * Proteções contra automação e disparos artificiais de eventos.
 *
 * Em um jogo 100% client-side não existe autoridade confiável: quem editar os
 * arquivos ou usar o depurador sempre consegue alterar o próprio save. O que dá
 * para fazer é impedir os atalhos fáceis — `elemento.click()` no console,
 * extensões de autoclique e scripts que disparam eventos sintéticos.
 */

/** Intervalo mínimo entre coletas do mesmo recurso (~25 cliques por segundo). */
export const HARVEST_COOLDOWN_MS = 40;

/** Último instante de clique aceito por elemento. */
const lastAcceptedClick = new WeakMap();

/**
 * Indica se o evento veio de uma ação real do usuário.
 * Eventos criados por script têm `isTrusted === false`.
 * @param {Event} event - Evento recebido pelo listener.
 * @returns {boolean}
 */
export function isTrustedInteraction(event) {
    return Boolean(event) && event.isTrusted === true;
}

/**
 * Verifica se o elemento respeitou o intervalo mínimo entre cliques.
 * @param {HTMLElement} element - Elemento clicado.
 * @param {number} cooldownMs - Intervalo mínimo em milissegundos.
 * @returns {boolean}
 */
function respectsCooldown(element, cooldownMs) {
    const now = Date.now();
    const previous = lastAcceptedClick.get(element) || 0;

    if (now - previous < cooldownMs) {
        return false;
    }

    lastAcceptedClick.set(element, now);

    return true;
}

/**
 * Registra um clique que só roda para interações reais do usuário.
 * @param {HTMLElement} element - Elemento alvo.
 * @param {Function} handler - Função executada no clique válido.
 * @param {number} [cooldownMs] - Intervalo mínimo entre cliques aceitos.
 */
export function bindTrustedClick(element, handler, cooldownMs) {
    if (!element) {
        return;
    }

    element.addEventListener('click', function (event) {
        if (!isTrustedInteraction(event)) {
            event.stopImmediatePropagation();
            return;
        }

        if (cooldownMs && !respectsCooldown(element, cooldownMs)) {
            return;
        }

        handler(event);
    });
}
