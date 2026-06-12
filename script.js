// variáveis
let materiais = {
    wood: 0,
    stone: 0,
    coin: 0
}

// Inventario player
let inventario = {
    machadoBlue: 0,
    picaretaBlue: 0,
    machado: 0,
    picareta: 0
}

let niveis = [
    'Nenhum',
    'Madeira', 
    'Pedra'
]

// HTML:
let panel = document.querySelector('#painel')
let qntWood = document.querySelector('#qntMadeira')
let qntCoin = document.querySelector('#qntMoeda')
let qntStone = document.querySelector('#qntPedra')
let close = document.querySelectorAll('.fechar')
let crafter = document.querySelector('#crafter')
let crafterInterface = document.querySelector('#crafterIntaface')
let shop = document.querySelector('#shop')
let shopInterface = document.querySelector('#shopIntaface')
let shopPickaxeWood = document.querySelector('#shopPicaretaMadeira')
let shopAxeWood = document.querySelector('#shopMachadoMadeira')
let buyAxeWood = document.querySelector('#comprarMachadoMadeira')
let buyPickaxeWood = document.querySelector('#comprarPicaretaMadeira')
let craftAxeWood = document.querySelector('#craftMachadoMadeira')
let craftPickaxeWood = document.querySelector('#craftPicaretaMadeira')
let craftarAxeWood = document.querySelector('#fabricarMachadoMadeira')
let craftarPickWood = document.querySelector('#fabricarPicaretaMadeira')
let bag = document.querySelector('#mochila')
let config = document.querySelector('#configuracoes')
let configInterface = document.querySelector('#interfaceConfig')
let bagInterface = document.querySelector('#interfaceBag')
let axeLevel = document.querySelector('#nivelMachado')
let pickaxeLevel = document.querySelector('#nivelPicareta')

// Imagens:
let tree = document.querySelector('.arvores')
let rock = document.querySelector('.pedras')
let sell = document.querySelector('#sell')

tree.addEventListener('click', treeAdd)
rock.addEventListener('click', stoneAdd)
sell.addEventListener('click', coinAdd)
shop.addEventListener('click', openShop)
crafter.addEventListener('click', openCrafter)
config.addEventListener('click', openConfig)
bag.addEventListener('click', openBag)

buyAxeWood.addEventListener('click', function() {
    comprar('machadoBlue', 10, shopAxeWood, 0)
})
buyPickaxeWood.addEventListener('click', function() {
    comprar('picaretaBlue', 10, shopPickaxeWood, 0)
})
craftarAxeWood.addEventListener('click', function(){
    fabricar('machado', 10, 'wood', craftAxeWood, 0)
})
craftarPickWood.addEventListener('click', function(){
    fabricar('picareta', 10, 'wood', craftPickaxeWood, 0)
})

close.forEach(function(botao) {
    botao.addEventListener('click', closeWindow)
})

function atualizarMat() {
    qntWood.innerHTML = materiais.wood
    qntCoin.innerHTML = materiais.coin
    qntStone.innerHTML = materiais.stone
}

function treeAdd() {
    materiais.wood += 1 + inventario.machado
    atualizarMat()
}

function stoneAdd() {
    if (inventario.picareta >= 1) {
        materiais.stone += inventario.picareta
        atualizarMat()
    }
}

function coinAdd(event) {
    if (materiais.wood > 0) {
        if (event.ctrlKey) {
            materiais.coin += materiais.wood
            materiais.wood = materiais.wood - materiais.wood
        } else {
            materiais.wood-- 
            materiais.coin++
        }
    }
    atualizarMat()
}

function closeWindow() {
    if (shopInterface.style.display === 'block') {
        shopInterface.style.display = 'none'
    } else if (crafterInterface.style.display === 'block') {
        crafterInterface.style.display = 'none'
    } else if (configInterface.style.display === 'block') {
        configInterface.style.display = 'none'
    } else if (bagInterface.style.display === 'block') {
        bagInterface.style.display = 'none'
    }
}

function openConfig() {
    configInterface.style.display = 'block'
}

function openBag() {
    bagInterface.style.display = 'block'
    axeLevel.innerHTML = niveis[inventario.machado]
    pickaxeLevel.innerHTML = niveis[inventario.picareta]
}

function openShop () {
    shopInterface.style.display = 'block'
}

function openCrafter () {
    crafterInterface.style.display = 'block'
    if (inventario.machadoBlue === 1 && inventario.machado === 0) {
        craftAxeWood.style.display = 'flex'
    }
    if (inventario.picaretaBlue === 1 && inventario.picareta === 0) {
        craftPickaxeWood.style.display = 'flex'
    }
}

function comprar(item, preco, esconder, nivel) {
    if (materiais.coin >= preco && inventario[item] === nivel) {
        materiais.coin = materiais.coin - preco
        esconder.style.display = 'none'
        atualizarMat()
        inventario[item]++
    }
}

function fabricar(item, custo, material, esconder, nivel) {
    if (materiais[material] >= custo && inventario[item] === nivel) {
        materiais[material] -= custo
        esconder.style.display = 'none'
        atualizarMat()
        inventario[item]++
    }
}