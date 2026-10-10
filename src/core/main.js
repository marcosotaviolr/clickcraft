import { startGameLoop } from './gameLoop.js';
import { initHud } from '../ui/hudManager.js';
import { initModals } from '../ui/modalManager.js';
import { initFarm } from '../entities/farm/farm.js';
import { initShop } from '../entities/shop/shop.js';
import { initCrafting } from '../systems/crafting.js';
import { initInventory } from '../systems/inventory.js';
import { initMap } from '../systems/map.js';
import { initFurnace } from '../systems/furnace.js';
import { initSettings } from '../systems/settings.js';
import { initAutomation } from '../systems/automation.js';

/**
 * Inicializa todos os módulos do jogo.
 */
function initGame() {
    initHud();
    initModals();
    initFarm();
    initShop();
    initCrafting();
    initInventory();
    initMap();
    initFurnace();
    initAutomation();
    initSettings();
    startGameLoop();
}

initGame();
