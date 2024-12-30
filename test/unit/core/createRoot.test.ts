import { Application } from 'pixi.js';
import {
    describe,
    expect,
    it,
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
        expect(root).toHaveProperty('render');
        expect(root).toHaveProperty('applicationState');
        expect(root).toHaveProperty('internalState');
        expect(root.render).toBeTypeOf('function');
        expect(root.internalState).toHaveProperty('rootContainer');
        expect(root.applicationState.app).toBeInstanceOf(Application);
        expect(root.internalState.rootContainer).toEqual(root.applicationState.app.stage);
    });
});
