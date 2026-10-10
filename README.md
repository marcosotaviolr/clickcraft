# 🏝️ ClickCraft

Jogo idle/clicker de fazenda em ilhas, feito com HTML, CSS e JavaScript puro (sem build e sem framework).

## 🎮 Sobre

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

## ⚙️ Como rodar localmente

O projeto usa módulos ES (`type="module"`). Abra com um servidor local — `file://` pode falhar.

```bash
python -m http.server 5500
```

Acesse `http://localhost:5500`. No Cursor/VS Code, a extensão Live Server também funciona.

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

## 🤖 Uso de Inteligência Artificial

Este projeto foi desenvolvido como um experimento de aprendizado com uso intensivo de IA. Ferramentas utilizadas:

- **Claude (Anthropic)** — suporte no aprendizado de HTML, CSS e JavaScript, revisão de lógica e guia de desenvolvimento ao longo de todo o projeto
- **Google Gemini** — geração de todos os assets visuais do jogo (sprites, ícones, cursores e texturas) via prompts de pixel art
- **Cursor (AI IDE)** — editor de código com IA integrada, utilizado como ambiente principal de desenvolvimento ao longo de todo o projeto

> O objetivo foi aprender programação web na prática, usando IA como ferramenta de ensino e não como substituta do raciocínio — todo o código foi escrito e entendido pelo desenvolvedor.

## 📌 Status

✅ Versão inicial concluída — possível retorno ao desenvolvimento no futuro.

🎮 [Jogar agora no GitHub Pages](https://marcosotaviolr.github.io/clickcraft)

## 📄 Licença

MIT — veja [LICENSE](LICENSE).

## 👤 Créditos

Desenvolvido por **Marcos** ([@marcosotaviolr](https://github.com/marcosotaviolr)).
