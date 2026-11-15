import { build } from 'esbuild';
import fs from 'node:fs/promises';
import http from 'node:http';

const fix = await fs.readFile('../../src/helpers/removeChild.ts', 'utf8');

await build({
    entryPoints: ['main.js'], bundle: true, format: 'esm', outfile: 'bundle.js', plugins: [{
        name: 'compare-implementations', setup(api)
        {
            api.onLoad({ filter: /applyProps\.mjs$/ }, async ({ path }) =>
            {
                const code = await fs.readFile(path, 'utf8');

                if (!code.includes('        value(instance);')) throw Error('Unexpected published applyProps');

                return { contents: code.replace('        value(instance);', '        if (new URLSearchParams(location.search).get("variant") === "clear") instance.clear();\n        value(instance);'), loader: 'js' };
            });
            api.onLoad({ filter: /removeChild\.mjs$/ }, async ({ path }) =>
            {
                const baseline = await fs.readFile(path, 'utf8');
                const body = baseline.slice(baseline.indexOf('function removeChild('), baseline.indexOf('export { removeChild }'));
                const fixed = fix.replace('export function removeChild(', 'function removeChildFixed(');

                return { contents: `${fixed}\n${body.replace('function removeChild(', 'function removeChildBaseline(')}\nexport function removeChild(parent, child) { return new URLSearchParams(location.search).get("variant") === "fixed" ? removeChildFixed(parent, child) : removeChildBaseline(parent, child); }`, loader: 'ts' };
            });
        }
    }]
});
http.createServer(async (req, res) =>
{
    const file = req.url.startsWith('/bundle.js') ? 'bundle.js' : 'index.html';

    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : 'text/html');
    res.end(await fs.readFile(file));
}).listen(5648, '127.0.0.1', () => process.stdout.write('Repro listening on 5648\n'));
