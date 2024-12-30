import {
    describe,
    expect,
    it,
} from 'vitest';
import { Application } from '../../src/components/Application';
import { UseAssetsStatus } from '../../src/constants/UseAssetsStatus';
import { createRoot } from '../../src/core/createRoot';
import { extend } from '../../src/helpers/extend';
import { useApp } from '../../src/hooks/useApp';
import { useApplication } from '../../src/hooks/useApplication';
import { useAsset } from '../../src/hooks/useAsset';
import { useAssets } from '../../src/hooks/useAssets';
import { useExtend } from '../../src/hooks/useExtend';
import { useSuspenseAssets } from '../../src/hooks/useSuspenseAssets';
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

    it('exports the `useApp()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useApp');
        expect(PixiReact.useApp).toEqual(useApp);
    });

    it('exports the `useApplication()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useApplication');
        expect(PixiReact.useApplication).toEqual(useApplication);
    });

    it('exports the `useAsset()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useAsset');
        expect(PixiReact.useAsset).toEqual(useAsset);
    });

    it('exports the `useAssets()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useAssets');
        expect(PixiReact.useAssets).toEqual(useAssets);
    });

    it('exports the `UseAssetsStatus()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('UseAssetsStatus');
        expect(PixiReact.UseAssetsStatus).toEqual(UseAssetsStatus);
    });

    it('exports the `useExtend()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useExtend');
        expect(PixiReact.useExtend).toEqual(useExtend);
    });

    it('exports the `useSuspenseAssets()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useSuspenseAssets');
        expect(PixiReact.useSuspenseAssets).toEqual(useSuspenseAssets);
    });

    it('exports the `useTick()` hook', () =>
    {
        expect(PixiReact).toHaveProperty('useTick');
        expect(PixiReact.useTick).toEqual(useTick);
    });

    it('doesn\'t export extraneous keys', () =>
    {
        expect(PixiReact).toHaveProperty('Application');
        expect(PixiReact).toHaveProperty('createRoot');
        expect(PixiReact).toHaveProperty('extend');
        expect(PixiReact).toHaveProperty('useApp');
        expect(PixiReact).toHaveProperty('useApplication');
        expect(PixiReact).toHaveProperty('useAsset');
        expect(PixiReact).toHaveProperty('useAssets');
        expect(PixiReact).toHaveProperty('UseAssetsStatus');
        expect(PixiReact).toHaveProperty('useExtend');
        expect(PixiReact).toHaveProperty('useTick');
        expect(PixiReact).toHaveProperty('useSuspenseAssets');
    });
});
