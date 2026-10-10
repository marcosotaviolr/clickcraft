# ClickCraft — documentação do jogo

ClickCraft é um idle/clicker de fazenda em ilhas. O jogador clica em recursos, vende materiais, compra plantas (blueprints), fabrica ferramentas e libera ilhas novas até chegar na coleta automática.

O projeto é **HTML + CSS + JavaScript puro**, sem framework e sem etapa de build. O ponto de entrada é `index.html`, que carrega `src/core/main.js` como módulo ES.

O progresso **não é salvo**. Recarregar a página recomeça do zero.

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Como se joga](#2-como-se-joga)
3. [O mundo: as três ilhas](#3-o-mundo-as-três-ilhas)
4. [Recursos e coleta](#4-recursos-e-coleta)
5. [Ferramentas](#5-ferramentas)
6. [HUD, XP e nível](#6-hud-xp-e-nível)
7. [Shop](#7-shop)
8. [Crafter](#8-crafter)
9. [Loja de venda](#9-loja-de-venda)
10. [Fornalha](#10-fornalha)
11. [Mochila](#11-mochila)
12. [Automações](#12-automações)
13. [Configurações](#13-configurações)
14. [Economia e dificuldade](#14-economia-e-dificuldade)
15. [Arquitetura do código](#15-arquitetura-do-código)
16. [Estado global](#16-estado-global)
17. [Núcleo (`src/core`)](#17-núcleo-srccore)
18. [Entidades (`src/entities`)](#18-entidades-srcentities)
19. [Sistemas (`src/systems`)](#19-sistemas-srcsystems)
20. [Interface (`src/ui`)](#20-interface-srcui)
21. [Utilitários (`src/utils`)](#21-utilitários-srcutils)
22. [HTML, CSS e assets](#22-html-css-e-assets)
23. [Segurança no cliente](#23-segurança-no-cliente)
24. [Ferramentas de desenvolvimento](#24-ferramentas-de-desenvolvimento)
25. [Como rodar e publicar](#25-como-rodar-e-publicar)

---

## 1. Visão geral

O loop principal é:

**clicar → acumular material → vender por moedas → comprar blueprint → craftar ferramenta → coletar mais → liberar a próxima ilha.**

Há cinco níveis de ferramenta (madeira, pedra, ferro, ouro, diamante). A picareta não só aumenta o ganho: ela **libera** minérios novos. A Ilha 2 é a mina. A Ilha 3 é o idle, com robôs que coletam sozinhos.

A dificuldade visada é **média/difícil**: preços altos, fornalha lenta, ilhas caras e automações que só valem depois de um investimento grande.

---

## 2. Como se joga

Ordem típica de progressão (também listada nas Configurações):

1. Coletar madeira na árvore (1 por clique, sem ferramenta).
2. Vender madeira, comprar as blueprints de **machado e picareta de madeira** no Shop e fabricá-las no Crafter.
3. Minerar pedra. Subir para ferramentas de **pedra**.
4. Liberar a **Ilha 2** com moedas.
5. Comprar e construir a **fornalha**.
6. Minerar ferro e carvão (picareta de pedra), fundir lingotes, craftar **ferro**.
7. Minerar ouro (picareta de ferro), fundir lingotes de ouro, craftar **ouro**.
8. Minerar diamante na Ilha 2 (picareta de ouro) e craftar **diamante** (sem fornalha).
9. Liberar a **Ilha 3** e comprar autômatos.

Regras que o jogador precisa internalizar:

- No Shop, o próximo nível só aparece quando **machado e picareta** do nível anterior já foram fabricados.
- Ferro e carvão exigem picareta de pedra. Ouro exige picareta de ferro. Diamante exige picareta de ouro.
- Diamante não vira lingote: o craft usa diamante cru + madeira.
- Autômatos só aparecem na loja da Ilha 3 se a ferramenta correspondente já existir.

---

## 3. O mundo: as três ilhas

O mapa fica em `#island-map`. A Ilha 1 é o centro. A Ilha 2 fica à direita (`left: 130%`). A Ilha 3 fica à esquerda (`right: 130%`). O jogador “viaja” visualmente; não há câmera livre.

### Ilha 1 — inicial

Sempre desbloqueada. Contém:

- Árvore (madeira)
- Pedra
- Shop, Crafter e Loja de Venda
- Fornalha (só depois de fabricada; o prédio de venda desloca um pouco para o lado)

Chão: `assets/img/grama.png`.

### Ilha 2 — mina

Custa **2500 moedas**. Contém ferro, carvão, ouro e diamante. Enquanto estiver trancada, um overlay cobre os recursos.

Chão: `assets/img/ilha2.png`. Os minérios têm um brilho colorido leve para se destacarem do terreno.

O HUD só mostra ferro, carvão, ouro, diamante (e as linhas de venda desses minérios) depois que esta ilha é liberada.

### Ilha 3 — automações

Custa **30 000 moedas** e **exige a Ilha 2**. Contém a loja de automações (`lojaautomacao.png`) e efeitos visuais (fumaça, pad escuro atrás do prédio).

Chão: `assets/img/ilha3.png`.

A trava da Ilha 3 só fica clicável depois da Ilha 2 (`src/systems/map.js`).

---

## 4. Recursos e coleta

Cada recurso no mapa é uma `<img>` clicável. O clique passa por `bindTrustedClick` (só evento real do usuário) e tem cooldown de **40 ms** (~25 cliques/s no máximo teórico).

Arquivos: `src/entities/farm/*.js`. A quantidade vem de `src/entities/player.js`, com base na ferramenta **equipada**.

### Madeira (árvore)

Sempre coletável. Quantidade = nível do machado + 1:

| Machado   | Por clique |
|-----------|------------|
| Nenhum    | 1          |
| Madeira   | 2          |
| Pedra     | 3          |
| Ferro     | 4          |
| Ouro      | 5          |
| Diamante  | 6          |

### Minérios (picareta)

Fórmula: `nível da picareta − nível que libera o minério + 1`. Se a picareta for inferior ao nível de desbloqueio, o clique não dá nada.

| Minério  | Libera com     | Pedra | Ferro | Ouro | Diamante |
|----------|----------------|-------|-------|------|----------|
| Pedra    | Picareta madeira | 2   | 3     | 4    | 5        |
| Ferro    | Picareta pedra   | 1   | 2     | 3    | 4        |
| Carvão   | Picareta pedra   | 1   | 2     | 3    | 4        |
| Ouro     | Picareta ferro   | —   | 1     | 2    | 3        |
| Diamante | Picareta ouro    | —   | —     | 1    | 2        |

Ferro, carvão, ouro e diamante também exigem a **Ilha 2** liberada. Essa checagem está na função de harvest de cada minério, não só no CSS.

Cada unidade coletada desses materiais (não lingotes, não moedas) gera **1 XP**.

Ao coletar, o HUD atualiza e um `+N` sobe no sprite (desligável nas configurações).

---

## 5. Ferramentas

Dois tipos: **machado** e **picareta**. Cinco níveis cada.

Há dois números no estado:

- `inventory.axe` / `inventory.pickaxe` — o **melhor nível já fabricado** (nunca desce).
- `inventory.equippedAxe` / `inventory.equippedPickaxe` — o que está **em uso** na coleta e no cursor.

Ao craftar um nível novo, ele é equipado na hora. Na mochila o jogador pode voltar para uma ferramenta mais fraca (o progresso da loja continua no nível fabricado).

Cursores: cada nível troca o ponteiro do mouse no recurso (`farm.css`, classes `has-axe-*` e `has-pickaxe-*`).

Catálogo visual (nome, imagem, texto de efeito): `src/entities/tools.js`.

Blueprints são itens separados (`axeBlueprint`, `axeStoneBlueprint`, etc.). Comprar no Shop só dá a planta; o item de verdade nasce no Crafter.

---

## 6. HUD, XP e nível

O cabeçalho (`#hud`) tem:

- Engrenagem (configurações) e mochila
- Contador de moedas
- Painel de materiais (madeira e pedra sempre; o resto conforme a Ilha 2 / fornalha)
- Nível do jogador e barra de XP embaixo

Se o painel de materiais encostar no topo da Ilha 1, ele abre para o lado (`.hud__materials-panel--wide`).

### XP

- 1 material coletado (madeira, pedra, ferro, carvão, ouro, diamante) = 1 XP
- Lingotes e moedas **não** dão XP
- XP para o próximo nível = `40 × nível atual` (nível 1 precisa de 40, nível 2 precisa de 80, …)
- Nível máximo: **99**

O nível hoje é **cosmética de progressão**: não trava Shop, craft nem ilhas. A barra existe para o jogador ver o quanto já coletou.

---

## 7. Shop

Prédio `shop.png` na Ilha 1. Modal `#shop-modal`.

Vende **blueprints** por moedas. Os cartões são montados em JavaScript a partir de `src/entities/shop/products.js` — o HTML do modal só tem a lista vazia.

Um produto só aparece se:

1. O jogador ainda não tem aquela blueprint (`inventory[itemKey] === requiredLevel`, em geral 0).
2. Machado **e** picareta do `requiredToolsLevel` já foram craftados.
3. A fornalha (blueprint) só aparece com a Ilha 2 liberada.

Ao comprar, `upgradeInventoryItem` sobe a blueprint de 0 para 1. A receita correspondente passa a aparecer no Crafter.

---

## 8. Crafter

Prédio `craft.png`. Modal `#crafter-modal`. Receitas em `src/entities/shop/recipes.js`.

Uma receita só aparece se a blueprint foi comprada **e** o item está no nível exigido (você não fabrica ferro sem já ter pedra).

O craft:

1. Confere blueprint, nível e materiais.
2. Debita tudo de uma vez (`spendMaterials` é atômico: ou desconta tudo, ou nada).
3. Sobe o item em exatamente um nível.
4. Se for a fornalha, o prédio aparece na ilha.
5. Se for ferramenta, atualiza cursores e a vitrine do Shop.

Custos atuais (médio/difícil):

| Item                    | Custo                                      |
|-------------------------|--------------------------------------------|
| Machado madeira         | 80 madeira                                 |
| Picareta madeira        | 150 madeira                                |
| Fornalha                | 300 pedra                                  |
| Machado pedra           | 220 madeira + 160 pedra                    |
| Picareta pedra          | 280 madeira + 180 pedra                    |
| Machado ferro           | 300 madeira + 75 lingotes de ferro         |
| Picareta ferro          | 350 madeira + 100 lingotes de ferro        |
| Machado ouro            | 400 madeira + 60 lingotes de ouro          |
| Picareta ouro           | 450 madeira + 80 lingotes de ouro          |
| Machado diamante        | 500 madeira + 70 diamante                  |
| Picareta diamante       | 550 madeira + 90 diamante                  |

---

## 9. Loja de venda

Prédio `sell.png`. Modal `#sell-modal`. Lógica em `src/systems/sell.js`.

Materiais vendáveis e preço unitário:

| Material | Moedas |
|----------|--------|
| Madeira  | 1      |
| Pedra    | 1      |
| Carvão   | 1      |
| Ferro    | 2      |
| Ouro     | 4      |
| Diamante | 6      |

Lingotes **não** se vendem: existem para craft.

O jogador escolhe a quantidade por linha ou usa **Vender Tudo**. Ferro/carvão/ouro/diamante só entram na lista depois da Ilha 2.

A quantidade é validada (inteiro finito, estoque suficiente) para não corromper o saldo com `NaN`.

---

## 10. Fornalha

Blueprint no Shop (450 moedas, Ilha 2). Craft: 300 pedra. Depois o prédio `fornalha.png` aparece na Ilha 1.

Dois fornos em paralelo no mesmo modal:

| Lingote | Receita              | Tempo   |
|---------|----------------------|---------|
| Ferro   | 1 ferro + 1 carvão   | 8 s     |
| Ouro    | 2 ouro + 4 carvão    | 8 s     |

O jogador escolhe o tamanho do lote. Os materiais saem do estoque **na hora**. Os lingotes entram um a um, em fila, com barra de progresso.

Não dá para fundir sem ter construído a fornalha (`inventory.furnace`). Há teto de lote (99) para evitar valores absurdos.

---

## 11. Mochila

Ícone da bolsa no HUD. Modal `#inventory-modal`. Sistema: `src/systems/inventory.js`.

No topo, dois cartões grandes (machado e picareta equipados). Abaixo, duas grades com os cinco níveis.

- Equipado: borda destacada, não clicável de novo
- Fabricado: dá para clicar e equipar
- Ainda não existe: cinza, desabilitado

No desktop cabem 4 quadrados; o quinto (diamante) fica atrás das **setas laterais**. Em tela estreita cabem 2.

---

## 12. Automações

Ilha 3. Loja montada a partir de `src/entities/automation/catalog.js`. Lógica em `src/systems/automation.js`.

Cada recurso tem um autômato (madeira, pedra, ferro, carvão, ouro, diamante). Condições:

- Ilha 3 liberada
- Ferramenta correspondente já fabricada (ex.: diamante exige picareta de ouro)
- Minérios da Ilha 2 também exigem a Ilha 2

Comportamento:

- Nível 1 coleta **1 por segundo**
- Cada melhoria soma **+1/s**
- Máximo: nível **10**
- Preço do próximo nível = `preço-base × (nível atual + 1)`

Preços-base:

| Autômato | Base   |
|----------|--------|
| Madeira  | 2000   |
| Pedra    | 2500   |
| Ferro    | 4000   |
| Carvão   | 3500   |
| Ouro     | 7000   |
| Diamante | 11000  |

O robô (`roboautomato.png`) aparece ao lado do recurso quando o autômato está ligado. A cada tick ele “bate” e mostra `+N`.

O loop de 1 segundo vive em `src/core/gameLoop.js` (`setInterval` → `tickAutomations`). Os autômatos **não** usam o bônus da ferramenta: a taxa é só o nível do robô.

---

## 13. Configurações

Ícone `config.png`. Modal `#settings-modal`. Sistema: `src/systems/settings.js`.

- Ligar/desligar o `+N` da coleta
- Reiniciar o jogo (confirmação de 4 segundos no botão)
- Texto de “como jogar” e ordem de progressão
- Tabela de preços de venda gerada a partir de `SELL_PRICES`

O reset zera materiais, inventário, ilhas, automações e XP, esconde a fornalha no mapa e redesenha todas as telas.

---

## 14. Economia e dificuldade

Todos os números de preço/custo/tempo ficam em `src/utils/constants.js`, nas tabelas `LIVE_*`.

`TEST_ECONOMY` (hoje `false`) zera preços, custos e tempo da fornalha para testes. Os valores reais continuam no arquivo.

Intenção da curva:

- **Início:** grind de madeira/pedra, sem ser impossível
- **Ilha 2 (2500):** primeiro muro de moedas
- **Ferro/ouro:** dificuldade de **recurso** (muitos lingotes, receita pesada de ouro) e um pouco de espera (8 s por lingote)
- **Diamante:** muro de moedas nas blueprints (5200 / 6800) e craft em diamante cru
- **Ilha 3 (30 000):** muro grande antes do idle
- **Automações:** caras o bastante para não virarem reflexo no instante em que a ilha abre

Blueprints do Shop (moedas):

| Blueprint              | Preço |
|------------------------|-------|
| Machado madeira        | 200   |
| Picareta madeira       | 280   |
| Fornalha               | 450   |
| Machado pedra          | 500   |
| Picareta pedra         | 600   |
| Machado ferro          | 900   |
| Picareta ferro         | 1100  |
| Machado ouro           | 1800  |
| Picareta ouro          | 2200  |
| Machado diamante       | 5200  |
| Picareta diamante      | 6800  |

---

## 15. Arquitetura do código

O jogo segue uma divisão clássica de **camadas**, sem classes de framework:

```
index.html          → DOM estático (mapa, HUD, cascas dos modais)
assets/             → CSS e imagens
src/core/           → arranque, estado, loop
src/entities/       → “o que existe no mundo” (recursos, catálogos)
src/systems/        → “o que o jogador faz” (craft, venda, mapa…)
src/ui/             → DOM, modais, HUD, eventos de tela
src/utils/          → constantes, segurança, helpers
tools/              → scripts Node de checagem
```

Regras de desenho:

1. **Dados no JS, não no HTML.** Listas do Shop, Crafter, venda, fornalha e automações nascem vazias e são preenchidas pelos catálogos.
2. **Uma fonte de verdade para preços.** `constants.js` alimenta Shop, craft, venda, ilhas e settings.
3. **Estado fechado.** Nada escreve `materials.wood = 999` direto; só os mutadores de `state.js`.
4. **Telas se atualizam por evento.** `refreshHud()` dispara `emitGameStateChanged()`; loja, mapa, fornalha etc. se inscrevem sem se conhecer.
5. **Catálogos congelados.** `deepFreeze` impede alterar preços/receitas em runtime.

Fluxo ao abrir a página:

```
index.html
  → src/core/main.js (initGame)
      → initHud, initModals, initFarm, initShop, initCrafting,
        initInventory, initMap, initFurnace, initAutomation,
        initSettings
      → startGameLoop()   // ticks dos autômatos
```

`initFarm` também chama `initSell`, porque a venda está ligada ao prédio da fazenda.

---

## 16. Estado global

Arquivo: `src/core/state.js`.

Objetos internos (`materialsState`, `inventoryState`, …) são mutáveis só dentro do módulo. O que o resto do jogo importa (`materials`, `inventory`, `islands`, `automations`, `progress`) é um **Proxy somente leitura**: `set` / `delete` são recusados, inclusive se alguém fizer `import()` no console.

Mutadores:

| Função                 | Papel                                              |
|------------------------|----------------------------------------------------|
| `addMaterial`          | Soma material com teto; pode gerar XP              |
| `canAfford`            | Confere uma lista de custos                        |
| `spendMaterials`       | Debita a lista inteira ou não debita nada          |
| `upgradeInventoryItem` | Sobe um item em 1 nível, se o nível atual bater    |
| `equipTool`            | Equipa um nível já fabricado                       |
| `unlockIsland`         | Marca ilha como liberada                           |
| `upgradeAutomation`    | Sobe autômato em 1, até o nível 10                 |
| `resetGameState`       | Zera tudo                                          |

Quantidades precisam ser inteiros seguros, positivos, e não passar de 1 000 000 000. Blueprints e fornalha têm teto 1. Ferramentas têm teto 5.

XP é aplicado dentro de `addMaterial` quando a chave está em `HARVEST_XP_KEYS`.

---

## 17. Núcleo (`src/core`)

### `main.js`

Único bootstrap. Só importa `init*` e o loop. Não contém regra de jogo.

### `gameLoop.js`

Um `setInterval` de `AUTOMATION_TICK_MS` (1000 ms) chamando `tickAutomations`. Não há loop de render: a tela só muda quando o jogador age ou quando um autômato coleta.

### `state.js`

Documentado na seção anterior. É o coração da lógica.

---

## 18. Entidades (`src/entities`)

Entidade = dado + comportamento de um objeto do mundo, **sem** montar modal completo.

### `player.js`

Lê só o nível **equipado** e responde: quanto rende o clique, e se aquele minério pode ser minerado. Também tem `getOwnedHarvestAmount` (nível **fabricado**), pensado para autômatos; o tick atual usa só o nível do robô.

### `farm/`

`farm.js` registra os cliques e atualiza as classes de cursor. Cada recurso tem um arquivo (`tree.js`, `stone.js`, `iron.js`, …) que valida ilha/ferramenta, chama `addMaterial` e mostra o popup.

### `shop/products.js` e `shop/recipes.js`

Tabelas declarativas: preço, seletor, título, imagem, custos. O HTML não duplica esses números.

### `shop/shop.js`

Monta cartões, decide visibilidade, compra blueprint. É a fronteira entidade/sistema da loja.

### `automation/catalog.js`

Lista os seis autômatos (preço-base, ferramenta exigida, ícone).

### `tools.js` e `materials.js`

Catálogos de apresentação (nome, ícone, texto de efeito) usados pela mochila, custos e venda.

---

## 19. Sistemas (`src/systems`)

Sistema = fluxo de jogo que atravessa estado + UI.

| Arquivo          | Função                                                                 |
|------------------|------------------------------------------------------------------------|
| `map.js`         | Preço das ilhas, ordem Ilha 2 → 3, overlay de trava, HUD de minérios   |
| `crafting.js`    | Crafter, posicionar/esconder fornalha no mapa                          |
| `sell.js`        | Venda unitária e “vender tudo”                                         |
| `furnace.js`     | Dois fornos, fila, timers, barra de progresso                          |
| `inventory.js`   | Mochila, setas da grade, `equipTool`                                   |
| `automation.js`  | Loja da Ilha 3, robôs no mundo, coleta por tick                        |
| `settings.js`    | Preferências, reset, textos e tabela de preços                         |

Padrão comum nos modais de mercado (Shop, Crafter, automações):

1. No `init`, criar um cartão por item do catálogo e guardar referências num `Map`.
2. Num `refresh*`, mostrar/esconder, atualizar custos, pintar o botão.
3. Só refrescar de verdade se o modal estiver aberto (`isModalVisible`), para não trabalhar à toa.
4. Inscrever o `refresh` em `onGameStateChanged`.

---

## 20. Interface (`src/ui`)

### `hudManager.js`

Guarda referências aos `<span>` de contagem. `refreshHud()` escreve os números, atualiza a barra de XP e **emite** a mudança de estado para o resto da UI.

### `modalManager.js`

Um modal por vez. Abrir adiciona `modal--open` no diálogo e `is-modal-open` no `body` (blur no mapa, sem rolagem da página).

### `uiEvents.js`

Lista de listeners. `emitGameStateChanged` ignora reentrada para não entrar em loop (A atualiza B que atualiza A).

### `dom.js`

Helpers de cartão: `createElement`, `createImage`, `createCostList`, `refreshCostList` (marca custo em vermelho se faltar material), `setButtonAvailability`.

### `clickPopup.js`

Cria um `<span class="click-popup">` na posição do sprite. Preferência ligada/desligada pelas configurações.

---

## 21. Utilitários (`src/utils`)

### `constants.js`

Seletores CSS, chaves de material/ilha/inventário, níveis de ferramenta, XP, **e toda a economia**. Qualquer balanceamento novo deve entrar aqui, não espalhado nos sistemas.

### `security.js`

- Recusa `click()` sintético (`event.isTrusted`)
- Cooldown por elemento na coleta

Não substitui um servidor: quem editar os arquivos ainda trapaceia. Serve para barrar autoclicker bobo e console raso.

### `freeze.js`

`deepFreeze`: `Object.freeze` recursivo em preços e receitas.

### `helpers.js`

Hoje só `isModalVisible`.

---

## 22. HTML, CSS e assets

### `index.html`

Estrutura visível: mar, HUD, três ilhas, casca de cada modal, script módulo. Listas de itens (`#shop-item-list`, `#craft-item-list`, etc.) começam vazias.

### CSS

`assets/styles/`

- `base.css` / `layout.css` — página, mar, blur com modal aberto
- `components/` — um arquivo por superfície (farm, hud, shop, sell, furnace, inventory, settings, automation, buttons, cards)
- `animations.css` — popups, golpes do robô, etc.

`farm.css` define o `.modal` base; os outros só especializam. O mapa usa `overflow: hidden` no `html`/`body` para as ilhas deslocadas não gerarem barra de rolagem.

Imagens em `assets/img/`. No Linux (HostGator) os caminhos são **case-sensitive**; o código aponta para nomes em minúsculas (`ferro.png`, `lojaautomacao.png`, …).

---

## 23. Segurança no cliente

Camadas, da mais útil para a mais fraca:

1. **Mutadores validados** em `state.js` (tipo, teto, nível esperado).
2. **Regras revalidadas na ação**, não só na UI: harvest checa ilha e picareta; Shop checa pré-requisito de ferramentas; craft checa blueprint; Ilha 3 checa Ilha 2; venda rejeita quantidade inválida.
3. **Catálogos congelados** (`deepFreeze`).
4. **Cliques confiáveis** + cooldown.

O jogo é 100% no navegador. Isso é defesa contra atalho, não contra quem modifica o JS.

---

## 24. Ferramentas de desenvolvimento

Pasta `tools/`, scripts Node:

| Script                 | Uso                                              |
|------------------------|--------------------------------------------------|
| `antiCheatCheck.mjs`   | Sobe um DOM mínimo e tenta exploits conhecidos   |
| `checkAssets.mjs`      | Confere se as imagens referenciadas existem      |
| `makePreview.mjs`      | Gera previews de tela                            |

Exemplo: `node tools/antiCheatCheck.mjs`.

---

## 25. Como rodar e publicar

Módulos ES não abrem bem via `file://`. Use um servidor local:

```bash
python -m http.server 5500
```

Acesse `http://localhost:5500`.

Deploy (Apache / HostGator):

- Enviar em **binary** no FTP (PNG corrompida é o erro mais comum)
- Manter `index.html`, `assets/`, `src/`, `.htaccess`
- `.htaccess` força HTTPS, MIME de `.js` (necessário para `type="module"`), esconde listagem de pasta e reforça headers
- Depois de atualizar, hard refresh ou aba anônima (cache de CSS/imagem)

---

## Mapa rápido de arquivos

```
clickcraft/
├── index.html                 Página e cascas da UI
├── JOGO.md                    Este documento
├── README.md                  Como rodar e publicar
├── .htaccess                  Apache / HostGator
├── assets/img/                Sprites e ícones
├── assets/styles/             CSS
├── src/core/main.js           Bootstrap
├── src/core/state.js          Estado e mutadores
├── src/core/gameLoop.js       Tick dos autômatos
├── src/entities/player.js     Ganho por clique
├── src/entities/farm/         Coleta no mapa
├── src/entities/shop/         Catálogo e compra de blueprints
├── src/entities/automation/   Catálogo dos robôs
├── src/systems/               Craft, venda, mapa, fornalha, mochila, idle, settings
├── src/ui/                    HUD, modais, DOM, popups
├── src/utils/constants.js     Economia e seletores
└── tools/                     Checagens em Node
```

Para mudar **dificuldade**, o primeiro arquivo é `src/utils/constants.js`. Para mudar **o que uma ferramenta faz no clique**, `src/entities/player.js`. Para mudar **o que aparece numa loja**, o catálogo correspondente em `src/entities/`.
