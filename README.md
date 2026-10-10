# 🏝️ ClickCraft

Jogo idle/clicker de fazenda em ilhas, feito com HTML, CSS e JavaScript puro (sem build e sem framework).

Você coleta recursos, vende materiais, compra blueprints, fabrica ferramentas, libera ilhas e, no fim, compra autômatos que coletam sozinhos.

Documentação completa do jogo e do código: [JOGO.md](JOGO.md).

## 🕹️ Como jogar

- Clique nos recursos do mapa para coletar
- Venda materiais na **Loja de Venda** para ganhar moedas
- Compre blueprints no **Shop** e fabrique no **Crafter**
- Suba machado e picareta (madeira → pedra → ferro → ouro → diamante)
- Liberte a **Ilha 2** para minérios (ferro, carvão, ouro e diamante) e a **fornalha**
- Liberte a **Ilha 3** para a loja de **automações**

O progresso **não é salvo**: recarregar a página recomeça o jogo.

## Como rodar localmente

O projeto usa módulos ES (`type="module"`). Abra com um servidor local — `file://` pode falhar.

```bash
python -m http.server 5500
```

Acesse `http://localhost:5500`. No Cursor/VS Code, a extensão Live Server também funciona.

## Publicar no GitHub

1. Confirme que `TEST_ECONOMY` em `src/utils/constants.js` está `false` (preços reais do jogo).
2. Não envie `.env`, chaves nem a pasta `.git` para a hospedagem.
3. Crie o repositório no GitHub e faça o push da branch principal.

O `.gitignore` já ignora artefatos de editor, `.env` e previews em `tools/shots/`.

## 🚀 Deploy (HostGator / FTP)

1. Envie os arquivos em modo **Binary** no FTP (importante para `.png`).
2. Mantenha a estrutura (`index.html`, `assets/`, `src/`, `.htaccess`).
3. Nomes de imagens em **minúsculas** (o Linux diferencia maiúsculas).
4. Depois de atualizar, use hard refresh ou aba anônima (cache de CSS/imagens).
5. O `.htaccess` força HTTPS — o SSL do domínio precisa estar ativo.

GitHub Pages **não** usa `.htaccess`. Para o site público, use a HostGator (ou outro Apache) com essa pasta.

## 📁 Estrutura

```
clickcraft/
├── index.html
├── JOGO.md
├── .htaccess
├── assets/
│   ├── fonts/
│   ├── img/
│   └── styles/
├── src/
│   ├── core/
│   ├── entities/
│   ├── systems/
│   ├── ui/
│   └── utils/
└── tools/
```

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla, ES Modules)

## Licença

MIT — veja [LICENSE](LICENSE).

- **Claude (Anthropic)** — suporte no aprendizado de HTML, CSS e JavaScript, revisão de lógica e guia de desenvolvimento ao longo de todo o projeto
- **Google Gemini** — geração de todos os assets visuais do jogo (sprites, ícones, cursores e texturas) via prompts de pixel art
- **Cursor (AI IDE)** — editor de código com IA integrada, utilizado como ambiente principal de desenvolvimento ao longo de todo o projeto

> O objetivo foi aprender programação web na prática, usando IA como ferramenta de ensino e não como substituta do raciocínio — todo o código foi escrito e entendido pelo desenvolvedor.

## 📌 Status

🚧 Em desenvolvimento.

## 👤 Créditos

Desenvolvido por **Marcos** ([@marcosotaviolr](https://github.com/marcosotaviolr)).
