import {
    Application,
    Container,
} from 'pixi.js';
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
        expect(root.state).to.have.property('rootContainer');
        // expect(root.state.app).to.be.instanceOf(Application)
        expect(root.state.app).to.have.all.keys(Object.keys(new Application()));
        // expect(root.state.rootContainer).to.be.instanceOf(Container)
        expect(root.state.rootContainer).to.have.all.keys(Object.keys(new Container()).concat('__pixireact'));
    });
});
