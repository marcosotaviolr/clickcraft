import { AUTOMATION_MAX_LEVEL, HARVEST_XP_KEYS, XP_PER_MATERIAL, PLAYER_MAX_LEVEL, getXpRequiredForLevel } from '../utils/constants.js';

/**
 * Estado do jogo.
 *
 * Os objetos exportados são views somente leitura: qualquer escrita direta
 * (inclusive via `import()` no console) é recusada. Toda alteração precisa
 * passar pelos mutadores deste módulo, que validam chave, tipo e limites.
 */

/** Teto de qualquer material, evita estouro numérico e valores absurdos. */
const MAX_MATERIAL_AMOUNT = 1000000000;

const materialsState = {
    wood: 0,
    stone: 0,
    iron: 0,
    coal: 0,
    gold: 0,
    diamond: 0,
    ironIngot: 0,
    goldIngot: 0,
    coin: 0,
};

const inventoryState = {
    axeBlueprint: 0,
    pickaxeBlueprint: 0,
    axeStoneBlueprint: 0,
    pickaxeStoneBlueprint: 0,
    axeIronBlueprint: 0,
    pickaxeIronBlueprint: 0,
    axeGoldBlueprint: 0,
    pickaxeGoldBlueprint: 0,
    axeDiamondBlueprint: 0,
    pickaxeDiamondBlueprint: 0,
    furnaceBlueprint: 0,
    axe: 0,
    pickaxe: 0,
    furnace: 0,
    equippedAxe: 0,
    equippedPickaxe: 0,
};

/** Ferramentas que podem ser equipadas e onde o nível ativo é guardado. */
const EQUIPPED_KEYS = {
    axe: 'equippedAxe',
    pickaxe: 'equippedPickaxe',
};

/** Valor máximo aceito para cada item do inventário. */
const INVENTORY_LIMITS = {
    axeBlueprint: 1,
    pickaxeBlueprint: 1,
    axeStoneBlueprint: 1,
    pickaxeStoneBlueprint: 1,
    axeIronBlueprint: 1,
    pickaxeIronBlueprint: 1,
    axeGoldBlueprint: 1,
    pickaxeGoldBlueprint: 1,
    axeDiamondBlueprint: 1,
    pickaxeDiamondBlueprint: 1,
    furnaceBlueprint: 1,
    axe: 5,
    pickaxe: 5,
    furnace: 1,
    equippedAxe: 5,
    equippedPickaxe: 5,
};

const islandsState = {
    second: false,
    third: false,
};

const automationsState = {
    wood: 0,
    stone: 0,
    iron: 0,
    coal: 0,
    gold: 0,
    diamond: 0,
};

const progressState = {
    level: 1,
    xp: 0,
};


/**
 * Recusa a operação de escrita interceptada pelo proxy.
 * @returns {boolean}
 */
function denyWrite() {
    return false;
}

/**
 * Cria uma view somente leitura de um objeto de estado.
 * @param {Object} source - Objeto interno mutável.
 * @returns {Object} Proxy que permite leitura e recusa escrita.
 */
function createReadOnlyView(source) {
    return new Proxy(source, {
        set: denyWrite,
        defineProperty: denyWrite,
        deleteProperty: denyWrite,
        setPrototypeOf: denyWrite,
    });
}

/**
 * Verifica se a chave existe no objeto de estado informado.
 * @param {Object} source - Objeto interno.
 * @param {string} key - Chave consultada.
 * @returns {boolean}
 */
function hasKey(source, key) {
    return typeof key === 'string' && Object.prototype.hasOwnProperty.call(source, key);
}

/**
 * Valida uma quantidade usada em ganho ou gasto de material.
 * @param {number} amount - Quantidade informada.
 * @returns {boolean}
 */
function isValidAmount(amount) {
    return Number.isSafeInteger(amount) && amount > 0 && amount <= MAX_MATERIAL_AMOUNT;
}

/** Materiais coletados e moedas do jogador (somente leitura). */
export const materials = createReadOnlyView(materialsState);

/** Ferramentas e blueprints possuídos pelo jogador (somente leitura). */
export const inventory = createReadOnlyView(inventoryState);

/** Estado de desbloqueio das ilhas (somente leitura). */
export const islands = createReadOnlyView(islandsState);

/** Nível de cada autômato comprado na Ilha 3 (somente leitura). */
export const automations = createReadOnlyView(automationsState);

/** Nível e XP do jogador (somente leitura). */
export const progress = createReadOnlyView(progressState);

/**
 * Adiciona uma quantidade de material ao jogador.
 * @param {string} materialKey - Chave do material.
 * @param {number} amount - Quantidade positiva a adicionar.
 * @returns {boolean} `true` se a operação foi aplicada.
 */
export function addMaterial(materialKey, amount) {
    if (!hasKey(materialsState, materialKey) || !isValidAmount(amount)) {
        return false;
    }

    const before = materialsState[materialKey];

    materialsState[materialKey] = Math.min(
        MAX_MATERIAL_AMOUNT,
        materialsState[materialKey] + amount
    );

    const gained = materialsState[materialKey] - before;

    if (gained > 0 && HARVEST_XP_KEYS[materialKey]) {
        addXp(gained * XP_PER_MATERIAL);
    }

    return true;
}

/**
 * Adiciona XP e sobe de nível quando a barra enche.
 * @param {number} amount - Quantidade de XP.
 */
function addXp(amount) {
    if (!isValidAmount(amount) || progressState.level >= PLAYER_MAX_LEVEL) {
        return;
    }

    progressState.xp += amount;

    while (progressState.level < PLAYER_MAX_LEVEL) {
        const required = getXpRequiredForLevel(progressState.level);

        if (progressState.xp < required) {
            break;
        }

        progressState.xp -= required;
        progressState.level += 1;
    }

    if (progressState.level >= PLAYER_MAX_LEVEL) {
        progressState.xp = 0;
    }
}

/**
 * Verifica se o jogador possui todos os materiais de uma lista de custos.
 * @param {Array<{materialKey: string, amount: number}>} costs - Lista de custos.
 * @returns {boolean}
 */
export function canAfford(costs) {
    if (!Array.isArray(costs) || costs.length === 0) {
        return false;
    }

    return costs.every(function (cost) {
        if (!hasKey(materialsState, cost.materialKey) || !Number.isSafeInteger(cost.amount)) {
            return false;
        }

        if (cost.amount === 0) {
            return true;
        }

        return isValidAmount(cost.amount) && materialsState[cost.materialKey] >= cost.amount;
    });
}

/**
 * Debita uma lista de custos de forma atômica: ou desconta tudo, ou nada.
 * @param {Array<{materialKey: string, amount: number}>} costs - Lista de custos.
 * @returns {boolean} `true` se os materiais foram debitados.
 */
export function spendMaterials(costs) {
    if (!canAfford(costs)) {
        return false;
    }

    costs.forEach(function (cost) {
        materialsState[cost.materialKey] -= cost.amount;
    });

    return true;
}

/**
 * Sobe um item do inventário em exatamente um nível.
 * @param {string} itemKey - Chave do item no inventário.
 * @param {number} expectedLevel - Nível atual exigido antes da subida.
 * @returns {boolean} `true` se o item foi atualizado.
 */
export function upgradeInventoryItem(itemKey, expectedLevel) {
    if (!hasKey(inventoryState, itemKey)) {
        return false;
    }

    if (inventoryState[itemKey] !== expectedLevel) {
        return false;
    }

    if (inventoryState[itemKey] >= INVENTORY_LIMITS[itemKey]) {
        return false;
    }

    inventoryState[itemKey] += 1;

    // Ferramenta recém-fabricada entra equipada automaticamente.
    if (EQUIPPED_KEYS[itemKey]) {
        inventoryState[EQUIPPED_KEYS[itemKey]] = inventoryState[itemKey];
    }

    return true;
}

/**
 * Equipa um nível de ferramenta que o jogador já tenha fabricado.
 * @param {string} toolKey - `axe` ou `pickaxe`.
 * @param {number} level - Nível desejado, de 1 até o nível já fabricado.
 * @returns {boolean} `true` se a ferramenta foi equipada.
 */
export function equipTool(toolKey, level) {
    const equippedKey = EQUIPPED_KEYS[toolKey];

    if (!equippedKey || !Number.isSafeInteger(level) || level < 1) {
        return false;
    }

    if (level > inventoryState[toolKey]) {
        return false;
    }

    inventoryState[equippedKey] = level;

    return true;
}

/**
 * Marca uma ilha como desbloqueada.
 * @param {string} islandKey - Chave da ilha.
 * @returns {boolean} `true` se a ilha foi desbloqueada agora.
 */
export function unlockIsland(islandKey) {
    if (!hasKey(islandsState, islandKey) || islandsState[islandKey]) {
        return false;
    }

    islandsState[islandKey] = true;

    return true;
}

/**
 * Sobe um autômato em exatamente um nível, até o teto.
 * @param {string} automationKey - Chave do recurso automatizado.
 * @returns {boolean} `true` se o nível foi aumentado.
 */
export function upgradeAutomation(automationKey) {
    if (!hasKey(automationsState, automationKey)) {
        return false;
    }

    if (automationsState[automationKey] >= AUTOMATION_MAX_LEVEL) {
        return false;
    }

    automationsState[automationKey] += 1;

    return true;
}

/**
 * Zera materiais, inventário e ilhas, voltando ao início do jogo.
 */
export function resetGameState() {
    Object.keys(materialsState).forEach(function (key) {
        materialsState[key] = 0;
    });

    Object.keys(inventoryState).forEach(function (key) {
        inventoryState[key] = 0;
    });

    Object.keys(islandsState).forEach(function (key) {
        islandsState[key] = false;
    });

    Object.keys(automationsState).forEach(function (key) {
        automationsState[key] = 0;
    });

    progressState.level = 1;
    progressState.xp = 0;
}
