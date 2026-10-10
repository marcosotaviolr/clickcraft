/**
 * Canal simples de "o estado mudou".
 *
 * Cada tela (loja, crafter, venda, mapa, fornalha) se inscreve aqui para
 * recalcular o que está disponível sempre que materiais ou moedas mudam,
 * sem que os sistemas precisem conhecer uns aos outros.
 */

const listeners = [];

let isEmitting = false;

/**
 * Inscreve uma função para rodar a cada mudança de estado.
 * @param {Function} listener - Função de atualização de tela.
 */
export function onGameStateChanged(listener) {
    listeners.push(listener);
}

/**
 * Avisa todas as telas inscritas que o estado mudou.
 * Reentradas são ignoradas para evitar laço infinito de atualização.
 */
export function emitGameStateChanged() {
    if (isEmitting) {
        return;
    }

    isEmitting = true;

    try {
        listeners.forEach(function (listener) {
            listener();
        });
    } finally {
        isEmitting = false;
    }
}
