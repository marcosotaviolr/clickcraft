# ClickCraft

Jogo de farm/clicker baseado em ilhas, feito com HTML, CSS e JavaScript puro (sem build e sem framework).

## Sobre

Você começa na ilha inicial coletando recursos, vende materiais, compra blueprints, fabrica ferramentas e libera novas ilhas. Há fornalha para fundir lingotes e progressão de madeira → pedra → ferro → ouro.

## Como jogar

- Clique nos recursos do mapa para coletar
- Use a **Loja de Venda** para vender materiais e ganhar moedas
- Use o **Shop** para comprar blueprints
- Use o **Crafter** para fabricar ferramentas e a fornalha
- Melhore machado/picareta para aumentar o ganho por clique e liberar minérios
- Desbloqueie a **Ilha 2** para ferro, carvão e ouro
- Use a **Fornalha** para transformar minérios + carvão em lingotes

## Como rodar localmente

Como o projeto usa módulos ES (`type="module"`), abra com um servidor local (abrir o HTML direto pelo `file://` pode falhar).

Exemplos:

```bash
# Python
python -m http.server 5500

# VS Code / Cursor: extensão Live Server
```

Depois acesse `http://localhost:5500`.

## Deploy (HostGator / FTP)

1. Envie os arquivos em modo **Binary** no FTP (importante para `.png`)
2. Mantenha a estrutura de pastas (`index.html`, `assets/`, `src/`, `.htaccess`)
3. Os nomes das imagens estão em **minúsculas** (necessário no Linux)
4. Após atualizar, faça hard refresh ou teste em aba anônima (cache de CSS/imagens)

## Estrutura

```
clickcraft/
├── index.html
├── .htaccess
├── assets/
│   ├── img/
│   └── styles/
└── src/
    ├── core/
    ├── entities/
    ├── systems/
    ├── ui/
    └── utils/
```

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla, ES modules)

## Status

Em desenvolvimento.

## Créditos

Desenvolvido por **Marcos** ([@marcosotaviolr](https://github.com/marcosotaviolr))
