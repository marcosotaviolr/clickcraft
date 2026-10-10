/**
 * Congela um objeto e tudo que estiver dentro dele, recursivamente.
 * Usado nas tabelas de preço e receitas para que não possam ser reescritas
 * em tempo de execução.
 * @param {Object|Array} target - Estrutura a congelar.
 * @returns {Object|Array} A mesma estrutura, agora imutável.
 */
export function deepFreeze(target) {
    Object.getOwnPropertyNames(target).forEach(function (key) {
        const value = target[key];

        if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });

    return Object.freeze(target);
}
