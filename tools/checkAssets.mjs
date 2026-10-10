/**
 * Confere se toda imagem referenciada no HTML, CSS e JS existe no disco com o
 * nome exato. O servidor da Hostgator roda Linux e diferencia maiúsculas de
 * minúsculas, então um "Foo.png" referenciado como "foo.png" quebra só em
 * produção. Rodar com: node tools/checkAssets.mjs
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, posix } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SOURCE_EXTENSIONS = ['.html', '.css', '.js'];
const IMAGE_PATTERN = /[\w./-]+\.(?:png|jpe?g|webp|gif|ico|svg)(?![\w])/gi;
const IGNORED_DIRS = new Set(['.git', 'node_modules', 'tools']);

/**
 * Lista recursivamente os arquivos de um diretório.
 * @param {string} directory - Caminho absoluto.
 * @returns {Promise<string[]>}
 */
async function listFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (IGNORED_DIRS.has(entry.name)) {
                continue;
            }

            files.push(...(await listFiles(join(directory, entry.name))));
            continue;
        }

        files.push(join(directory, entry.name));
    }

    return files;
}

const allFiles = await listFiles(ROOT);

const existingImages = new Set(
    allFiles
        .map((file) => file.slice(ROOT.length).split('\\').join('/'))
        .filter((file) => /\.(png|jpe?g|webp|gif|ico|svg)$/i.test(file))
);

const problems = [];

for (const file of allFiles) {
    const relative = file.slice(ROOT.length).split('\\').join('/');

    if (!SOURCE_EXTENSIONS.some((extension) => relative.endsWith(extension))) {
        continue;
    }

    const content = await readFile(file, 'utf8');
    const matches = content.match(IMAGE_PATTERN) || [];

    // Só o CSS resolve caminhos a partir da própria pasta. HTML e JS montam
    // caminhos relativos à página, que fica na raiz.
    const directory = relative.endsWith('.css') ? posix.dirname(relative) : '.';

    for (const match of new Set(matches)) {
        if (match.startsWith('http')) {
            continue;
        }

        const resolved = posix.normalize(posix.join(directory, match));

        if (!existingImages.has(resolved)) {
            problems.push(relative + ' → ' + match);
        }
    }
}

if (problems.length === 0) {
    console.log('Todas as ' + existingImages.size + ' imagens referenciadas existem com o nome exato.');
    process.exit(0);
}

console.log('Referências quebradas:');
problems.forEach((problem) => console.log('  ' + problem));
process.exit(1);
