import { Container, Graphics, GraphicsContext, VERSION } from 'pixi.js';
import React from 'react';
import { flushSync } from 'react-dom';
import { createRoot as createDOMRoot } from 'react-dom/client';
import { Application, extend } from '@pixi/react';

extend({ Container, Graphics });
const params = new URLSearchParams(location.search);
const variant = params.get('variant') || 'baseline';
const scenario = params.get('scenario') || 'mounted';
const isShared = scenario === 'shared' || scenario === 'nested-shared';
const count = Number(params.get('count') || 200);
let app;
let committed = 0;
let shared;
const root = createDOMRoot(document.body.appendChild(document.createElement('div')));
const refs = new Map();
const created = new Set();
const contextRefs = [];
const originalContexts = new WeakSet();

function draw(target, step)
{
    if (!originalContexts.has(target.context))
    {
        originalContexts.add(target.context);
        contextRefs.push(new WeakRef(target.context));
        created.add(target.context.uid);
    }
    if (params.has('clear')) target.clear();
    target.rect(step % 30, 0, 10, 10).fill(0xff0000);
}
function Scene({ step, visible })
{
    React.useLayoutEffect(() => { committed = step; });
    const children = visible ? Array.from({ length: count }, (_, index) => React.createElement('pixiGraphics', {
        key: index,
        x: index % 20 * 12,
        y: Math.floor(index / 20) * 12,
        ref: (node) => { if (node) refs.set(index, node); else refs.delete(index); },
        ...(isShared ? { context: shared } : {}),
        draw: (node) => draw(node, step),
    })) : null;

    return (scenario === 'nested' || scenario === 'nested-shared') && visible ? React.createElement('pixiContainer', null, children) : children;
}
async function render(step, visible)
{
    flushSync(() => root.render(React.createElement(Application, {
        preference: 'webgl', width: 300, height: 300, autoStart: false,
        onInit: (value) => { app = value; },
    }, React.createElement(Scene, { step, visible }))));
    for (let tries = 0; tries <= 1000; tries++)
    {
        if (app && committed === step) break;
        if (tries === 1000) throw Error('React commit timed out');
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
    app.render();
    await new Promise((resolve) => requestAnimationFrame(resolve));
}
window.setup = async () =>
{
    if (isShared) shared = new GraphicsContext();
    await render(1, true);
    const gl = app.renderer.gl;

    if (!gl || gl.isContextLost()) throw Error('Actual WebGL unavailable');
    const ext = gl.getExtension('WEBGL_debug_renderer_info');

    return {
        version: VERSION, variant, scenario, count, webgl: gl.getParameter(gl.VERSION),
        vendor: ext && gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
        renderer: ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
    };
};
window.advance = async (start, rounds) =>
{
    for (let step = start; step < start + rounds; step++)
    {
        if (scenario !== 'mounted')
        {
            await render(step * 2, false);
            await render((step * 2) + 1, true);
        }
        else await render(step, true);
    }
};
window.measure = () =>
{
    const system = app.renderer.graphicsContext; const hash = system._gpuContextHash ?? system._managedContexts.items;
    const contexts = Object.values(hash).filter(Boolean); const entries = system._gpuContextHash ? contexts : contexts.map((context) => context._gpuData[app.renderer.uid]).filter(Boolean);

    return {
        createdContexts: created.size, liveObservedContexts: contextRefs.filter((ref) => ref.deref()).length,
        graphics: refs.size, gpuHashSlots: Object.keys(hash).length, gpuContexts: entries.length,
        instructions: [...new Set([...refs.values()].map((g) => g.context))].reduce((sum, context) => sum + context.instructions.length, 0),
        retainedInstructions: contexts.reduce((sum, entry) => sum + (entry.instructions ?? entry.context?.instructions ?? []).length, 0),
        geometryNumbers: entries.reduce((sum, entry) => sum + Object.values(entry.geometryData).reduce((n, values) => n + values.length, 0), 0),
        sharedDestroyed: shared?.destroyed,
        managedContexts: contexts.length,
        gpuKeys: entries[0] && Object.keys(entries[0]),
        systemKeys: Object.keys(app.renderer.graphicsContext)
    };
};
window.empty = async () => { await render(100000, false); };
