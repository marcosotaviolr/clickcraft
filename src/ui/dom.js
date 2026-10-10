import { materials } from '../core/state.js';
import { getMaterialInfo } from '../entities/materials.js';

/**
 * Cria um elemento já com classe e texto.
 * @param {string} tag - Tag HTML.
 * @param {string} className - Classe CSS.
 * @param {string} [text] - Conteúdo textual.
 * @returns {HTMLElement}
 */
export function createElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

/**
 * Cria uma imagem de asset do jogo.
 * @param {string} source - Caminho da imagem.
 * @param {string} alt - Texto alternativo.
 * @param {string} className - Classe CSS.
 * @returns {HTMLImageElement}
 */
export function createImage(source, alt, className) {
    const image = document.createElement('img');
    image.className = className;
    image.src = source;
    image.alt = alt;
    image.draggable = false;

    return image;
}

/**
 * Monta a lista de custos de um item (ex.: 400 madeira + 60 lingotes).
 * @param {Array<{materialKey: string, amount: number}>} costs - Custos do item.
 * @returns {{element: HTMLElement, chips: Array<Object>}}
 */
export function createCostList(costs) {
    const element = createElement('div', 'cost-list');

    const chips = costs.map(function (cost) {
        const info = getMaterialInfo(cost.materialKey);
        const chip = createElement('span', 'cost-chip');

        chip.appendChild(createElement('span', 'cost-chip__amount', String(cost.amount)));
        chip.appendChild(createImage(info.icon, info.name, 'cost-chip__icon'));
        chip.title = info.name;
        element.appendChild(chip);

        return { materialKey: cost.materialKey, amount: cost.amount, element: chip };
    });

    return { element, chips };
}

/**
 * Marca em vermelho os custos que o jogador ainda não consegue pagar.
 * @param {Array<Object>} chips - Chips devolvidos por `createCostList`.
 * @returns {boolean} `true` se todos os custos estão cobertos.
 */
export function refreshCostList(chips) {
    let affordable = true;

    chips.forEach(function (chip) {
        const missing = materials[chip.materialKey] < chip.amount;

        chip.element.classList.toggle('cost-chip--missing', missing);

        if (missing) {
            affordable = false;
        }
    });

    return affordable;
}

/**
 * Pinta o botão de verde (liberado) ou cinza (bloqueado) e trava o clique.
 * @param {HTMLButtonElement} button - Botão a atualizar.
 * @param {boolean} isAvailable - Se a ação está disponível.
 */
export function setButtonAvailability(button, isAvailable) {
    button.classList.toggle('btn--ready', isAvailable);
    button.classList.toggle('btn--blocked', !isAvailable);
    button.disabled = !isAvailable;
}
