import { Application } from 'pixi.js';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { createRoot } from '../../../src/core/createRoot';

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

    it('creates a new root with onDestroy callback', () =>
    {
        const onDestroySpy = vi.fn();

        const target = document.createElement('canvas');
        const root = createRoot(target, {
            onDestroy: onDestroySpy,
        });

        expect(root.applicationState.onDestroy).toBe(onDestroySpy);
    });
});
