import {
    describe,
    expect,
    it,
} from 'vitest';
import { Application } from '../../src/components/Application';
import { createApplication } from '../../src/core/createApplication';
import { createRoot } from '../../src/core/createRoot';
import { extend } from '../../src/helpers/extend';
import { useApplication } from '../../src/hooks/useApplication';
import { useExtend } from '../../src/hooks/useExtend';
import { useTick } from '../../src/hooks/useTick';
import * as PixiReact from '../../src/index';

describe('exports', () =>
{
    it('exports the `<Application>` component', () =>
    {
        expect(PixiReact).toHaveProperty('Application');
        expect(PixiReact.Application).toEqual(Application);
    });

    it('exports the `createRoot()` function', () =>
    {
        expect(PixiReact).toHaveProperty('createRoot');
        expect(PixiReact.createRoot).toEqual(createRoot);
    });

    it('exports the `extend()` function', () =>
    {
        expect(PixiReact).toHaveProperty('extend');
        expect(PixiReact.extend).toEqual(extend);
    });

    it('exports the `useApplication()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useApplication');
        expect(PixiReact.useApplication).toEqual(useApplication);
    });

    it('exports the `useExtend()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useExtend');
        expect(PixiReact.useExtend).toEqual(useExtend);
    });

    it('exports the `useTick()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useTick');
        expect(PixiReact.useTick).toEqual(useTick);
    });

    it('exports the `createApplication()` function', () =>
    {
        expect(PixiReact).toHaveProperty('createApplication');
        expect(PixiReact.createApplication).toEqual(createApplication);
    });

    it('doesn\'t export extraneous keys', () =>
    {
        expect(PixiReact).toHaveProperty('Application');
        expect(PixiReact).toHaveProperty('createRoot');
        expect(PixiReact).toHaveProperty('createApplication');
        expect(PixiReact).toHaveProperty('extend');
        expect(PixiReact).toHaveProperty('useApplication');
        expect(PixiReact).toHaveProperty('useExtend');
        expect(PixiReact).toHaveProperty('useTick');
    });
});
