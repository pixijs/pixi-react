import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';

const summary = [];

for (const name of fs.readdirSync('artifacts').filter((name) => name.endsWith('.heapsnapshot.gz')))
{
    const heap = JSON.parse(gunzipSync(fs.readFileSync(`artifacts/${name}`)).toString('utf8'));
    const fields = heap.snapshot.meta.node_fields;
    const width = fields.length;
    const nameIndex = fields.indexOf('name');
    const typeIndex = fields.indexOf('type');
    const sizeIndex = fields.indexOf('self_size');
    const objectType = heap.snapshot.meta.node_types[typeIndex].indexOf('object');
    const counts = {};

    for (let offset = 0; offset < heap.nodes.length; offset += width)
    {
        if (heap.nodes[offset + typeIndex] !== objectType) continue;
        const label = heap.strings[heap.nodes[offset + nameIndex]];

        if (!(/^(?:_?Graphics(?:Context)?\d*|GpuGraphicsContext\d*|WebGL2?RenderingContext)$/).test(label)) continue;
        const item = counts[label] ||= { count: 0, shallowBytes: 0 };

        item.count++;
        item.shallowBytes += heap.nodes[offset + sizeIndex];
    }
    summary.push({ snapshot: name, objects: counts });
}
fs.writeFileSync('artifacts/heap-counts.json', JSON.stringify(summary, null, 2));
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
