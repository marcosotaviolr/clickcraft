/**
 * Gera páginas de pré-visualização dos modais para conferência visual.
 * Reaproveita o index.html real, apenas abrindo o modal pedido já com um
 * estado de jogo montado. Rodar com: node tools/makePreview.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('..', import.meta.url);
const html = await readFile(new URL('index.html', ROOT), 'utf8');

const IMPORTS = `
    import { upgradeInventoryItem, equipTool, addMaterial, unlockIsland } from '/src/core/state.js';
    import { refreshHud } from '/src/ui/hudManager.js';
    import { openInventory } from '/src/systems/inventory.js';
    import { openSettings } from '/src/systems/settings.js';
    import { openShop } from '/src/entities/shop/shop.js';
    import { openCrafter } from '/src/systems/crafting.js';
    import { openSell } from '/src/systems/sell.js';
    import { openFurnace } from '/src/systems/furnace.js';
    import { refreshIslandMaterialsUi } from '/src/systems/map.js';

    const own = (...keys) => keys.forEach((key) => upgradeInventoryItem(key, 0));
`;

/** Ferramentas de madeira fabricadas e a Ilha 2 liberada. */
const BASE = `
    own('axeBlueprint', 'pickaxeBlueprint');
    upgradeInventoryItem('axe', 0);
    upgradeInventoryItem('pickaxe', 0);
    equipTool('axe', 1);
    addMaterial('wood', 260);
    addMaterial('stone', 90);
    addMaterial('iron', 18);
    addMaterial('coal', 5);
    addMaterial('gold', 3);
    unlockIsland('second');
`;

/** Fornalha construída com carvão só para o ferro: o forno de ouro fica travado. */
const FURNACE_SETUP = `
    own('axeBlueprint', 'pickaxeBlueprint', 'furnaceBlueprint', 'furnace');
    upgradeInventoryItem('axe', 0);
    upgradeInventoryItem('pickaxe', 0);
    equipTool('axe', 1);
    addMaterial('wood', 260);
    addMaterial('iron', 18);
    addMaterial('coal', 3);
    addMaterial('gold', 3);
    unlockIsland('second');
`;

/**
 * Cada cenário deixa alguns itens acessíveis e outros não, para que a
 * pré-visualização mostre botões verdes e cinzas lado a lado.
 */
const PREVIEWS = [
    {
        // Sem modal aberto: serve para conferir o HUD com todos os materiais.
        file: 'tools/preview-hud.html',
        setup:
            FURNACE_SETUP +
            "addMaterial('coin', 640);addMaterial('stone', 90);" +
            "addMaterial('ironIngot', 12);addMaterial('goldIngot', 4);",
        open: 'refreshIslandMaterialsUi();',
    },
    {
        file: 'tools/preview-shop.html',
        // Dá para pagar a fornalha e o machado de pedra, mas não a picareta.
        setup: BASE + "addMaterial('coin', 520);",
        open: 'openShop();',
    },
    {
        file: 'tools/preview-shop-empty.html',
        // Blueprints de madeira já compradas: a loja espera o Crafter.
        setup: "own('axeBlueprint', 'pickaxeBlueprint');addMaterial('coin', 100);",
        open: 'openShop();',
    },
    {
        file: 'tools/preview-crafter.html',
        // Dá para fabricar fornalha e machado; falta madeira para a picareta.
        setup:
            BASE +
            "own('axeStoneBlueprint', 'pickaxeStoneBlueprint', 'furnaceBlueprint');" +
            "addMaterial('stone', 230);addMaterial('coin', 120);",
        open: 'openCrafter();',
    },
    {
        file: 'tools/preview-sell.html',
        setup: BASE + "addMaterial('coin', 640);",
        open: 'openSell();',
    },
    {
        file: 'tools/preview-furnace.html',
        setup: FURNACE_SETUP + "addMaterial('coin', 640);",
        open: 'openFurnace();',
    },
    {
        file: 'tools/preview-inventory.html',
        setup: BASE + "addMaterial('coin', 640);",
        open: 'openInventory();',
    },
    {
        file: 'tools/preview-settings.html',
        setup: BASE + "addMaterial('coin', 640);",
        open: 'openSettings();',
    },
];

for (const preview of PREVIEWS) {
    const script =
        '<script type="module">' +
        IMPORTS +
        preview.setup +
        'refreshHud();' +
        preview.open +
        '</script>';

    const output = html
        .replace('<head>', '<head>\n    <base href="/">')
        .replace('</body>', script + '\n</body>');

    await writeFile(new URL(preview.file, ROOT), output, 'utf8');
    console.log('gerado: ' + preview.file);
}
