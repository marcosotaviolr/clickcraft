/**
 * Mostra um popup "+N" subindo a partir do recurso clicado.
 * @param {number} amount - Quantidade coletada no clique.
 * @param {HTMLElement} targetElement - Elemento clicado (árvore, pedra, etc.).
 */
/** Prazo máximo até remover o popup, caso a animação não dispare. */
const POPUP_FALLBACK_REMOVAL_MS = 2000;

let popupEnabled = true;

/**
 * Liga ou desliga os popups de coleta.
 * @param {boolean} enabled - Novo estado da preferência.
 */
export function setClickPopupEnabled(enabled) {
    popupEnabled = Boolean(enabled);
}

/**
 * Indica se os popups de coleta estão ativos.
 * @returns {boolean}
 */
export function isClickPopupEnabled() {
    return popupEnabled;
}

export function showClickPopup(amount, targetElement) {
    if (!popupEnabled || !targetElement || !Number.isFinite(amount) || amount <= 0) {
        return;
    }

    const popup = document.createElement('span');
    popup.className = 'click-popup';
    popup.textContent = '+' + amount;

    const rect = targetElement.getBoundingClientRect();
    popup.style.left = rect.left + rect.width / 2 + 'px';
    popup.style.top = rect.top + 'px';

    document.body.appendChild(popup);

    popup.addEventListener('animationend', function () {
        popup.remove();
    });

    setTimeout(function () {
        popup.remove();
    }, POPUP_FALLBACK_REMOVAL_MS);
}
