# Graphics lifecycle reproduction for #648

This isolated browser test uses `@pixi/react` **8.0.5**, `pixi.js` **8.17.1**, and React/ReactDOM **19.0.0**. The issue specifies only React 19, so 19.0.0 is the explicit reproducible choice here. It does not change the repository's PixiJS 8.2.6 test dependencies or publishing workflows.

Run from this directory with Node 20+ and desktop Google Chrome installed:

```powershell
npm ci
node serve.mjs
```

In a second terminal, in the same directory:

```powershell
node run.mjs
node analyze.mjs
```

The server bundles the published 8.0.5 implementation. `baseline` uses its removal helper unchanged; `clear` adds the original PR's `clear()` immediately before changed draw callbacks; `fixed` substitutes the current repository's `src/helpers/removeChild.ts`. The draw-prop-removal part of the old patch is not exercised by these scenarios. The source fix is read when the server starts, so restart the server after editing it.

Playwright launches visible desktop Chrome with hardware acceleration available, without GPU-disabling or software-renderer flags. Setup requires a non-lost WebGL context and records WebGL version, unmasked GPU vendor/renderer, and Chrome version. Inspect those fields before treating any run as hardware-WebGL verification.

Each variant runs in a fresh page/Application with 200 Graphics objects. Four batches of 20 updates compare:

- `mounted`: same React keys, changing draw callbacks that append one rectangle.
- `cycles`: direct Graphics mount/unmount cycles.
- `nested`: removing a Container containing the Graphics subtree.
- `nested-shared`: subtree cycles with one supplied GraphicsContext. The callback explicitly clears it in every variant to isolate lifecycle retention from intentional appends.

Every sample follows two CDP garbage collections. Measurements include observed GraphicsContext identities (WeakRefs), live renderer-managed contexts, GPU context objects, null registry slots, instructions on unique visible contexts, all renderer-retained instructions, geometry array lengths, V8 heap and backing storage. Cumulative UID/WeakRef bookkeeping itself consumes memory. Registry slots left as null by PixiJS are counted separately from live resources.

Compressed Chrome heap snapshots are written at initialization, batch four, and final unmount. `analyze.mjs` counts actual Graphics, GraphicsContext, GpuGraphicsContext, and WebGL context objects and shallow sizes; it does not interpret shallow size as retained size or VRAM usage. For retainer inspection, decompress a `.heapsnapshot.gz` and load it in Chrome DevTools Memory. `artifacts/results.json` and `artifacts/heap-counts.json` contain raw measurements. Generated bundles, logs, dependencies, and snapshots are ignored by Git.

Optional PowerShell settings (defaults shown):

```powershell
$env:VARIANTS = 'baseline,clear,fixed'
$env:SCENARIOS = 'mounted,cycles,nested,nested-shared'
$env:COUNT = '200'
$env:ROUNDS = '20'
$env:BATCHES = '4'
node run.mjs
```

The issue's callback-only trigger and its reference to `_gpuContextHash` remain distinct from the reproduced subtree-removal bug: PixiJS 8.17.1 uses `_managedContexts.items`. This harness handles both registries, but does not claim to reproduce the reporter's application or measure driver VRAM.
