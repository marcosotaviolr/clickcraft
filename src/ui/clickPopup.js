/**
 * Mostra um popup "+N" subindo a partir do recurso clicado.
 * @param {number} amount - Quantidade coletada no clique.
 * @param {HTMLElement} targetElement - Elemento clicado (árvore, pedra, etc.).
 */
export function showClickPopup(amount, targetElement) {
    if (!targetElement || amount <= 0) {
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
}
