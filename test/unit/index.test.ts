import {
    describe,
    expect,
    it,
} from 'vitest';
import * as PixiReact from '../../src/index.ts';

describe('exports', () =>
{
    it('exports the `<Application>` component', () =>
    {
        expect(PixiReact).to.have.property('Application');
    });

    it('exports the `createRoot()` function', () =>
    {
        expect(PixiReact).to.have.property('createRoot');
    });

    it('exports the `extend()` function', () =>
    {
        expect(PixiReact).to.have.property('extend');
    });

    it('exports the `useApp()` hook', () =>
    {
        expect(PixiReact).to.have.property('useApp');
    });

    it('exports the `useAsset()` hook', () =>
    {
        expect(PixiReact).to.have.property('useAsset');
    });

    it('exports the `useExtend()` hook', () =>
    {
        expect(PixiReact).to.have.property('useExtend');
    });

    it('exports the `useTick()` hook', () =>
    {
        expect(PixiReact).to.have.property('useTick');
    });

    it('doesn\'t export extraneous keys', () =>
    {
        expect(PixiReact).to.have.all.keys(
            'Application',
            'createRoot',
            'extend',
            'useApp',
            'useAsset',
            'useExtend',
            'useTick',
        );
    });
});
