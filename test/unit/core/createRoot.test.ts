import { Application } from 'pixi.js';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { createRoot } from '../../../src/core/createRoot';
import { reconciler } from '../../../src/core/reconciler';

describe('createRoot', () =>
{
    it('creates a new root', () =>
    {
        const target = document.createElement('canvas');
        const root = createRoot(target);

        expect(root).toHaveProperty('fiber');
        expect(root).toHaveProperty('render');
        expect(root).toHaveProperty('applicationState');
        expect(root).toHaveProperty('internalState');
        expect(root.render).toBeTypeOf('function');
        expect(root.internalState).toHaveProperty('rootContainer');
        expect(root.applicationState.app).toBeInstanceOf(Application);
        expect(root.applicationState.destroyOptions).toBeUndefined();
        expect(root.applicationState.rendererDestroyOptions).toBeUndefined();
        expect(root.internalState.rootContainer).toEqual(root.applicationState.app.stage);
    });

    describe('with destroy options', () =>
    {
        it('creates a new root with boolean destroy options', () =>
        {
            const target = document.createElement('canvas');
            const root = createRoot(target, {
                destroyOptions: true,
                rendererDestroyOptions: false,
            });

            expect(root.applicationState.destroyOptions).toBe(true);
            expect(root.applicationState.rendererDestroyOptions).toBe(false);
        });

        it('creates a new root with object destroy options', () =>
        {
            const target = document.createElement('canvas');
            const root = createRoot(target, {
                destroyOptions: { children: true },
            });

            expect(root.applicationState.destroyOptions).toEqual({ children: true });
            expect(root.applicationState.rendererDestroyOptions).toBeUndefined();
        });

        it('creates a new root with object renderer destroy options', () =>
        {
            const target = document.createElement('canvas');
            const root = createRoot(target, {
                rendererDestroyOptions: { removeView: true },
            });

            expect(root.applicationState.destroyOptions).toBeUndefined();
            expect(root.applicationState.rendererDestroyOptions).toEqual({ removeView: true });
        });
    });

    describe('async init race condition', () =>
    {
        it('commits the latest children and options when a second render arrives during init', async () =>
        {
            const target = document.createElement('canvas');

            // Control exactly when `app.init()` resolves so we can interleave a second
            // render() call while the first is still awaiting initialisation.
            let resolveInit!: () => void;
            const initGate = new Promise<void>((resolve) =>
            {
                resolveInit = resolve;
            });
            const initSpy = vi
                .spyOn(Application.prototype, 'init')
                .mockImplementation(async function mockInit(this: Application)
                {
                    await initGate;
                    // Emulate the renderer becoming available once init resolves.
                    (this as unknown as { renderer: object }).renderer = {};
                });

            // Capture what gets committed to the fiber without running the real reconciler.
            const updateSpy = vi
                .spyOn(reconciler, 'updateContainer')
                .mockReturnValue(true as never);

            const root = createRoot(target);

            // First render kicks off init and suspends on the await.
            const firstRender = root.render('A' as never, { __opt: 'A' } as never);
            // Second render arrives during the init window: it sees isInitialising===true,
            // skips init, and synchronously commits its newer children/options.
            const secondRender = root.render('B' as never, { __opt: 'B' } as never);

            // Now let the first init resolve and the first render resume.
            resolveInit();
            await Promise.all([firstRender, secondRender]);

            // The final committed tree must carry the latest children ('B'), not the
            // stale 'A' captured in the first render's closure.
            const lastCommit = updateSpy.mock.calls.at(-1)?.[0] as { props: { children: unknown } };

            expect(lastCommit.props.children).toBe('B');

            // The latest application options must also win — the resumed first render
            // must not revert app properties to its stale options.
            expect((root.applicationState.app as unknown as { __opt: string }).__opt).toBe('B');

            initSpy.mockRestore();
            updateSpy.mockRestore();
        });
    });
});
