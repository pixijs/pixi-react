# Browser investigation of issue #648

Verified on 2026-11-15 with published @pixi/react 8.0.5, PixiJS 8.17.1, React/ReactDOM 19.0.0, Playwright 1.58.2, and desktop Chrome 155.0.8059.80. The issue gives only the React major version. WebGL 2.0 was active on ANGLE / Intel Iris Xe / Direct3D11, without a software-renderer override. See [reproduction instructions](README.md), [raw measurements](measurements.json), and [heap object counts](heap-counts.json).

The callback-only trigger described in [issue #648](https://github.com/pixijs/pixi-react/issues/648) was **not reproduced**. A related renderer-retention bug was reproduced when removing a Container subtree. The PR remains a draft and does not close the issue.

## Comparison

Each fresh page used one Application and 200 visible Graphics objects, followed by 80 updates or mount/unmount cycles. Measurements and snapshots followed two explicit garbage collections. MB below means decimal V8 used heap bytes divided by 1,000,000; it is not GPU VRAM.

| Scenario | Implementation | GPU contexts: initial → 80 cycles → final unmount | Heap MB: initial → 80 cycles → final unmount | Visible instructions after 80 cycles |
| --- | --- | --- | --- | --- |
| Mounted, changed callbacks | Baseline | 200 → 200 → 0 | 7.54 → 24.19 → 11.10 | 16,200 |
| Mounted, changed callbacks | Original clear patch | 200 → 200 → 0 | 7.57 → 8.84 → 7.92 | 200 |
| Mounted, changed callbacks | Final subtree fix | 200 → 200 → 0 | 7.54 → 24.20 → 11.10 | 16,200 |
| Direct Graphics cycles | Baseline | 200 → 200 → 0 | 7.53 → 10.71 → 9.76 | 200 |
| Direct Graphics cycles | Original clear patch | 200 → 200 → 0 | 7.54 → 10.72 → 9.76 | 200 |
| Direct Graphics cycles | Final subtree fix | 200 → 200 → 0 | 7.54 → 10.71 → 9.76 | 200 |
| Container subtree cycles | Baseline | 200 → 16,200 → 16,200 | 7.62 → 61.58 → 62.43 | 200 |
| Container subtree cycles | Original clear patch | 200 → 16,200 → 16,200 | 7.63 → 61.55 → 62.43 | 200 |
| Container subtree cycles | Final subtree fix | 200 → 200 → 0 | 7.62 → 10.77 → 9.73 | 200 |
| Shared-context subtree cycles | Baseline | 1 → 1 → 1 | 7.15 → 27.09 → 26.93 | 1 |
| Shared-context subtree cycles | Original clear patch | 1 → 1 → 1 | 7.15 → 27.10 → 26.91 | 1 |
| Shared-context subtree cycles | Final subtree fix | 1 → 1 → 1 | 7.15 → 21.50 → 21.14 | 1 |

For nested private contexts, the baseline registry progressed 200 → 4,200 → 8,200 → 12,200 → 16,200; the fix stayed at 200 at every checkpoint and reached zero after final unmount. Post-GC snapshots independently counted 16,200 GraphicsContext and 16,200 GpuGraphicsContext objects for baseline/original patch, versus 200 of each for the fix and none after final unmount. Geometry array elements fell from 356,400 to 4,400 at cycle 80, then zero after unmount. Renderer-retained instructions fell from 16,200 to 200, then zero. These results establish actual renderer retention and release beyond JavaScript heap totals.

## Cause and final change

React removes the top host node of a deleted subtree. The existing `removeChild` called only that node's `destroy()`. PixiJS Container.destroy() defaults to leaving descendants undestroyed, so descendant GraphicsContexts stayed registered with the renderer.

The final helper destroys descendants before destroying the removed node, using default destroy options for every node. This matters: passing `{ children: true }` recursively would prevent Graphics.destroy()'s default owned-context cleanup, while `destroy(true)` would also destroy supplied shared contexts and textures. The chosen traversal preserves Pixi's default ownership behavior. A regression verifies that a supplied context remains usable by a Graphics outside the removed subtree.

Automatic draw clearing was removed. Updating a callback already uses the same Graphics and GraphicsContext. Clearing only bounds intentionally appended drawing instructions; it neither fixes subtree context retention nor preserves existing append/shared drawing semantics. Applications that want replacement drawing can continue calling `graphics.clear()` in their callbacks.

## Remaining limits

- The reported mounted-callback-only leak still needs the reporter's application-level reproduction. The report names `_gpuContextHash`, whereas installed PixiJS 8.17.1 uses `_managedContexts.items`; repository PixiJS 8.2.6 uses the former.
- Shared contexts remain alive intentionally. In the exact-version shared test, heap snapshots also retain 16,201 `_Graphics` entries after final unmount (16,200 instances plus the prototype). PixiJS 8.17.1 Graphics.destroy() does not detach its context update/unload listeners when the supplied context survives. This dependency-level retention remains; this PR does not destroy a shared context to hide it or modify Pixi internals.
- Pixi's registry retains null slots after cleanup: 16,200 slots may contain only 200 live contexts, or zero after unmount. The harness also keeps cumulative UIDs and WeakRefs. These explain some residual heap growth and are not counted as live GPU contexts.
- Snapshot constructor counts include prototypes when their heap node type is `object`. Shallow object sizes exclude retained arrays, native memory, and driver allocations. WebGL1 support-probe and WebGL2 renderer wrapper counts stayed constant; GpuGraphicsContext is a Pixi resource object, not a new browser WebGLRenderingContext.
- Driver VRAM and the reporter's 5,000-object application were not measured. No success claim rests on heap stability alone.

## Checks

- `npm ci`: passed.
- `npm run test:unit`: 23 passed. Both new lifecycle regressions failed before the fix.
- `npm run test:types`: passed.
- `npm run test:lint`: exit 0, no errors; 4,403 existing checkout/style warnings, predominantly CRLF. Changed source/test files pass targeted lint without warnings.
- `npm run test:e2e -- --workspace .verification/e2e.workspace.ts`: 15 passed using Playwright with `launch.channel = 'chrome'` in a temporary workspace copied from the repository config. The new Graphics lifecycle test also failed against the unmodified upstream removal helper (14 passed, 1 failed), and passed with the fix. Existing React act warnings remain.
- `npm run build` and `npm run build:docs`: passed. Docs reports stale Browserslist data.
- `git diff --check`: passed. Publishing workflows and the separate CI branch were unchanged.

Compressed heap snapshots remain in the local ignored `artifacts/` directory. The initial expanded snapshot run exhausted disk space; its incomplete snapshot was discarded and the final full comparison completed with streamed gzip snapshots.
