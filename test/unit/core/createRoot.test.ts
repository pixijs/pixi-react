import { Application } from 'pixi.js';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { createRoot } from '../../../src/core/createRoot.ts';

describe('createRoot', () =>
{
    it('creates a new root', () =>
    {
        const target = document.createElement('canvas');
        const root = createRoot(target);

        expect(root).to.have.property('fiber');
        expect(root)
            .to.have.property('render')
            .and.to.be.a('function');
        expect(root).to.have.property('state');
        expect(root.internalState).to.have.property('rootContainer');
        expect(root.applicationState.app).to.be.instanceOf(Application);
        expect(root.internalState).to.equal(root.applicationState.app.stage);
    });
});
