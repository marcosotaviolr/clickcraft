/**
 * Verificação anti-trapaça.
 *
 * Sobe um DOM mínimo em memória, inicializa o jogo e tenta reproduzir os
 * exploits conhecidos. Rodar com: node tools/antiCheatCheck.mjs
 */

const elements = new Map();
const listeners = new Map();

function createElement() {
    const classes = new Set();
    const children = [];

    const element = {
        style: {},
        value: '1',
        disabled: false,
        children,
        classList: {
            add: (name) => classes.add(name),
            remove: (name) => classes.delete(name),
            contains: (name) => classes.has(name),
            toggle(name, force) {
                const shouldAdd = force === undefined ? !classes.has(name) : force;
                return shouldAdd ? Boolean(classes.add(name)) || true : classes.delete(name) && false;
            },
        },
        get className() {
            return Array.from(classes).join(' ');
        },
        set className(value) {
            classes.clear();
            String(value)
                .split(' ')
                .filter(Boolean)
                .forEach((name) => classes.add(name));
        },
        get id() {
            return element._id || '';
        },
        // Elementos montados em runtime entram no índice de seletores para
        // que o teste consiga clicar neles por id, como no navegador.
        set id(value) {
            element._id = String(value);
            elements.set('#' + element._id, element);
        },
        get textContent() {
            return element._text || '';
        },
        set textContent(value) {
            element._text = String(value);
            children.length = 0;
        },
        getBoundingClientRect() {
            return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
        },
        addEventListener(type, handler) {
            if (type === 'click') {
                listeners.set(element, handler);
            }
        },
        setAttribute() {},
        removeAttribute() {},
        appendChild(child) {
            children.push(child);
            return child;
        },
        append(...nodes) {
            children.push(...nodes);
        },
        querySelector(selector) {
            if (!element._sub) {
                element._sub = new Map();
            }

            if (!element._sub.has(selector)) {
                element._sub.set(selector, createElement());
            }

            return element._sub.get(selector);
        },
        remove() {},
    };

    return element;
}

function getElement(selector) {
    if (!elements.has(selector)) {
        elements.set(selector, createElement());
    }

    return elements.get(selector);
}

globalThis.document = {
    querySelector: getElement,
    querySelectorAll: () => [],
    createElement: createElement,
    body: createElement(),
};

globalThis.window = { addEventListener() {} };
globalThis.requestAnimationFrame = () => 0;

/**
 * Dispara o handler registrado num seletor.
 * @param {string} selector - Seletor do elemento.
 * @param {boolean} trusted - Se o evento deve parecer real.
 */
function clickElement(element, trusted) {
    const handler = listeners.get(element);

    if (!handler) {
        throw new Error('Elemento sem listener de clique');
    }

    handler({
        isTrusted: trusted,
        currentTarget: element,
        stopImmediatePropagation() {},
    });
}

function click(selector, trusted) {
    clickElement(getElement(selector), trusted);
}

const results = [];

/**
 * Registra o resultado de um cenário de teste.
 * @param {string} name - Nome do cenário.
 * @param {boolean} passed - Se o exploit foi bloqueado.
 */
function check(name, passed) {
    results.push({ name, passed });
}

await import('../src/core/main.js');

const { materials, inventory, islands } = await import('../src/core/state.js');

// 1. Escrita direta no estado via import no console.
try {
    materials.coin = 999999;
} catch (error) {
    // Em modo estrito o proxy lança; o importante é o valor não mudar.
}
check('Estado bloqueia escrita direta de moedas', materials.coin === 0);

try {
    inventory.pickaxe = 4;
} catch (error) {
    // idem
}
check('Estado bloqueia escrita direta no inventário', inventory.pickaxe === 0);

try {
    islands.second = true;
} catch (error) {
    // idem
}
check('Estado bloqueia desbloqueio direto de ilha', islands.second === false);

// 2. Clique sintético (element.click() pelo console).
click('.tree-resource', false);
check('Clique sintético não coleta madeira', materials.wood === 0);

// 3. Coleta legítima funciona.
click('.tree-resource', true);
check('Clique real coleta madeira', materials.wood === 1);

// 4. Compra de blueprint sem moedas.
click('#buy-axe-wood', true);
check('Compra sem moedas é recusada', inventory.axeBlueprint === 0);

// 5. Craft sem blueprint (botão escondido, mas clicável).
const { craftItem } = await import('../src/systems/crafting.js');
const { craftRecipes } = await import('../src/entities/shop/recipes.js');
const woodAxeRecipe = craftRecipes.find((r) => r.buttonSelector === '#craft-axe-wood');

const { addMaterial } = await import('../src/core/state.js');
addMaterial('wood', 100000);
craftItem(woodAxeRecipe);
check('Craft sem blueprint é recusado', inventory.axe === 0);

// 6. Minerar minério da Ilha 2 sem ter desbloqueado.
const { harvestIron } = await import('../src/entities/farm/iron.js');
harvestIron({ isTrusted: true, currentTarget: getElement('.iron-resource') });
check('Minerar ferro sem Ilha 2 é recusado', materials.iron === 0);

// 7. Usar a fornalha sem tê-la construído.
const { openFurnace } = await import('../src/systems/furnace.js');
openFurnace();
check(
    'Fornalha não abre sem estar construída',
    getElement('#furnace-modal').classList.contains('modal--open') === false
);

// 8. Ilha 3 antes da Ilha 2.
const { unlockIslandThird } = await import('../src/systems/map.js');
addMaterial('coin', 100000);
unlockIslandThird();
check('Ilha 3 exige Ilha 2 desbloqueada', islands.third === false);

// 9. Venda com valor inválido corrompendo o estado.
const { sellMaterial } = await import('../src/systems/sell.js');
const coinsBefore = materials.coin;
sellMaterial('wood', 'abc');
sellMaterial('wood', NaN);
sellMaterial('wood', Infinity);
sellMaterial('wood', -50);
check(
    'Venda com valor inválido não corrompe moedas',
    Number.isSafeInteger(materials.coin) && materials.coin === coinsBefore
);

// 10. Venda acima do estoque disponível.
const woodBefore = materials.wood;
sellMaterial('wood', 99999999);
check('Venda limitada ao estoque', materials.wood === 0 && materials.coin === coinsBefore + woodBefore);

// 11. Tabelas de preço imutáveis.
const { SHOP_PRICES } = await import('../src/utils/constants.js');
const originalPrice = SHOP_PRICES.AXE_BLUEPRINT;
try {
    SHOP_PRICES.AXE_BLUEPRINT = 0;
} catch (error) {
    // objeto congelado
}
check('Tabela de preços é imutável', SHOP_PRICES.AXE_BLUEPRINT === originalPrice);

// 12. Progressão legítima: comprar, craftar, evoluir e desbloquear a ilha.
addMaterial('coin', 100000);
addMaterial('wood', 100000);
addMaterial('stone', 100000);

click('#buy-axe-wood', true);
click('#buy-pickaxe-wood', true);
check(
    'Compra legítima entrega as blueprints',
    inventory.axeBlueprint === 1 && inventory.pickaxeBlueprint === 1
);

click('#craft-axe-wood', true);
click('#craft-pickaxe-wood', true);
check(
    'Craft legítimo entrega as ferramentas',
    inventory.axe === 1 && inventory.pickaxe === 1
);

click('#buy-axe-stone', true);
click('#craft-axe-stone', true);
check('Progressão para o nível de pedra funciona', inventory.axe === 2);

click('#unlock-island-second', true);
check('Desbloqueio legítimo da Ilha 2 funciona', islands.second === true);

click('#buy-furnace', true);
click('#craft-furnace', true);
check('Fornalha é comprada e construída', inventory.furnace === 1);

openFurnace();
check(
    'Fornalha abre depois de construída',
    getElement('#furnace-modal').classList.contains('modal--open') === true
);

click('#buy-pickaxe-stone', true);
click('#craft-pickaxe-stone', true);
harvestIron({ isTrusted: true, currentTarget: getElement('.iron-resource') });
check('Minerar ferro funciona com Ilha 2 e picareta de pedra', materials.iron > 0);

click('#unlock-island-third', true);
check('Ilha 3 desbloqueia após a Ilha 2', islands.third === true);

// 13. Mochila: equipar níveis anteriores e bloquear níveis não fabricados.
const { openInventory } = await import('../src/systems/inventory.js');
const { getWoodHarvestAmount } = await import('../src/entities/player.js');
const { equipTool } = await import('../src/core/state.js');

openInventory();
const axeSlots = getElement('#axe-grid').children;
check('Grade da mochila mostra os 5 níveis de machado', axeSlots.length === 5);
check(
    'Níveis não fabricados ficam desabilitados',
    axeSlots[0].disabled === false && axeSlots[2].disabled === true
);
check('Machado de pedra aparece equipado', axeSlots[1].classList.contains('tool-slot--equipped'));

clickElement(axeSlots[0], true);
check('Equipar nível anterior funciona', inventory.equippedAxe === 1);
check('Nível equipado define a coleta', getWoodHarvestAmount() === 2);
check('Nível fabricado é preservado', inventory.axe === 2);

check('Não dá para equipar nível não fabricado', equipTool('axe', 4) === false);
check('Não dá para equipar nível inválido', equipTool('axe', 0) === false);

clickElement(getElement('#axe-grid').children[1], true);
check('Voltar ao nível maior funciona', inventory.equippedAxe === 2);

// 14. Configurações: preferências e reinício com confirmação.
const { openSettings } = await import('../src/systems/settings.js');
const { isClickPopupEnabled } = await import('../src/ui/clickPopup.js');

openSettings();
check(
    'Tabela de preços de venda é montada',
    getElement('#settings-price-table').children.length === 6
);

click('#settings-popup-toggle', true);
check('Preferência de popup desliga', isClickPopupEnabled() === false);
click('#settings-popup-toggle', true);
check('Preferência de popup religa', isClickPopupEnabled() === true);

click('#settings-reset-button', true);
check('Primeiro clique só arma o reinício', inventory.axe === 2);

click('#settings-reset-button', true);
check(
    'Segundo clique reinicia o jogo',
    inventory.axe === 0 &&
        inventory.equippedAxe === 0 &&
        materials.coin === 0 &&
        islands.second === false
);

// 15. Botões indicam disponibilidade: verde libera, cinza bloqueia.
const { refreshHud } = await import('../src/ui/hudManager.js');
const { ISLAND_PRICES } = await import('../src/utils/constants.js');
const { openShop } = await import('../src/entities/shop/shop.js');
const { openCrafter } = await import('../src/systems/crafting.js');
const buyAxeButton = getElement('#buy-axe-wood');
const unlockSecondButton = getElement('#unlock-island-second');

openShop();
check(
    'Botão de compra fica cinza e travado sem moedas',
    buyAxeButton.classList.contains('btn--blocked') &&
        buyAxeButton.disabled === true &&
        buyAxeButton.textContent === 'Sem moedas'
);
check(
    'Botão de liberar ilha fica cinza sem moedas',
    unlockSecondButton.classList.contains('btn--blocked')
);

addMaterial('coin', SHOP_PRICES.AXE_BLUEPRINT);
refreshHud();
check(
    'Botão de compra fica verde ao juntar moedas',
    buyAxeButton.classList.contains('btn--ready') &&
        buyAxeButton.disabled === false &&
        buyAxeButton.textContent === 'Comprar'
);
check(
    'Ilha continua cinza com moedas insuficientes',
    unlockSecondButton.classList.contains('btn--blocked')
);

addMaterial('coin', ISLAND_PRICES.SECOND);
refreshHud();
check(
    'Botão de liberar ilha fica verde ao juntar moedas',
    unlockSecondButton.classList.contains('btn--ready') &&
        unlockSecondButton.disabled === false
);

const craftAxeButton = getElement('#craft-axe-wood');
click('#buy-axe-wood', true);
openCrafter();
check(
    'Botão de craft fica cinza sem material',
    craftAxeButton.classList.contains('btn--blocked') &&
        craftAxeButton.textContent === 'Falta material'
);

const { CRAFT_COSTS } = await import('../src/utils/constants.js');
addMaterial('wood', CRAFT_COSTS.AXE_WOOD);
refreshHud();
check(
    'Botão de craft fica verde com material',
    craftAxeButton.classList.contains('btn--ready') &&
        craftAxeButton.textContent === 'Fabricar'
);

const failed = results.filter((result) => !result.passed);

results.forEach(function (result) {
    console.log((result.passed ? 'OK   ' : 'FALHA') + ' | ' + result.name);
});

console.log('\n' + (results.length - failed.length) + '/' + results.length + ' cenários verificados');

process.exit(failed.length === 0 ? 0 : 1);
