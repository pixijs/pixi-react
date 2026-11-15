import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';
import { chromium } from 'playwright';

fs.mkdirSync('artifacts', { recursive: true });
const variants = (process.env.VARIANTS || 'baseline,clear,fixed').split(',');
const scenarios = (process.env.SCENARIOS || 'mounted,cycles,nested,nested-shared').split(',');
const count = Number(process.env.COUNT || 200);
const rounds = Number(process.env.ROUNDS || 20);
const batches = Number(process.env.BATCHES || 4);
const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--js-flags=--expose-gc'] });
const results = [];

try
{
    for (const variant of variants)
    {
        for (const scenario of scenarios)
        {
            const page = await browser.newPage();
            const errors = [];

            page.on('pageerror', (error) => errors.push(String(error)));
            // Shared contexts use explicit clear to isolate lifecycle from intentional appends.
            await page.goto(`http://127.0.0.1:5648/?variant=${variant}&scenario=${scenario}&count=${count}${scenario.includes('shared') ? '&clear' : ''}`);
            await page.waitForFunction(() => !!window.setup);
            const metadata = { ...await page.evaluate(() => window.setup()), browser: browser.version(), rounds, batches };
            const cdp = await page.context().newCDPSession(page);

            await cdp.send('HeapProfiler.enable');
            const samples = [];

            async function sample(batch)
            {
                await cdp.send('HeapProfiler.collectGarbage');
                await cdp.send('HeapProfiler.collectGarbage');
                samples.push({ batch, ...await page.evaluate(() => window.measure()), ...await cdp.send('Runtime.getHeapUsage') });
            }
            async function snapshot(batch)
            {
                const file = createGzip(); const done = pipeline(file, fs.createWriteStream(`artifacts/${variant}-${scenario}-${batch}.heapsnapshot.gz`));
                const listener = (event) => file.write(event.chunk);

                cdp.on('HeapProfiler.addHeapSnapshotChunk', listener);
                await cdp.send('HeapProfiler.takeHeapSnapshot', { reportProgress: false });
                cdp.off('HeapProfiler.addHeapSnapshotChunk', listener);
                file.end(); await done;
            }
            for (let batch = 0; batch <= batches; batch++)
            {
                if (batch) await page.evaluate(({ start, rounds }) => window.advance(start, rounds), { start: 2 + ((batch - 1) * rounds), rounds });
                await sample(batch);
                if (batch === 0 || batch === batches) await snapshot(batch);
            }
            await page.evaluate(() => window.empty());
            await sample('unmounted');
            await snapshot('unmounted');
            if (errors.length) throw Error(errors.join('\n'));
            results.push({ metadata, samples });
            fs.writeFileSync('artifacts/results.json', JSON.stringify(results, null, 2));
            process.stdout.write(`${JSON.stringify(results.at(-1))}\n`);
            await page.close();
        }
    }
}
finally
{
    await browser.close();
}
