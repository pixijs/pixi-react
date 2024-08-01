import {
    describe,
    expect,
    it,
} from 'vitest';
import { Application } from '../../src/components/Application.ts';
import { UseAssetsStatus } from '../../src/constants/UseAssetsStatus.ts';
import { createRoot } from '../../src/core/createRoot.ts';
import { extend } from '../../src/helpers/extend.ts';
import { useApp } from '../../src/hooks/useApp.ts';
import { useApplication } from '../../src/hooks/useApplication.ts';
import { useAsset } from '../../src/hooks/useAsset.ts';
import { useAssets } from '../../src/hooks/useAssets.ts';
import { useExtend } from '../../src/hooks/useExtend.ts';
import { useSuspenseAssets } from '../../src/hooks/useSuspenseAssets.ts';
import { useTick } from '../../src/hooks/useTick.ts';
import * as PixiReact from '../../src/index.ts';

describe('exports', () =>
{
    it('exports the `<Application>` component', () =>
    {
        expect(PixiReact).to.have.property('Application')
            .and.to.equal(Application);
    });

    it('exports the `createRoot()` function', () =>
    {
        expect(PixiReact).to.have.property('createRoot')
            .and.to.equal(createRoot);
    });

    it('exports the `extend()` function', () =>
    {
        expect(PixiReact).to.have.property('extend')
            .and.to.equal(extend);
    });

    it('exports the `useApp()` hook', () =>
    {
        expect(PixiReact).to.have.property('useApp')
            .and.to.equal(useApp);
    });

    it('exports the `useApplication()` hook', () =>
    {
        expect(PixiReact).to.have.property('useApplication')
            .and.to.equal(useApplication);
    });

    it('exports the `useAsset()` hook', () =>
    {
        expect(PixiReact).to.have.property('useAsset')
            .and.to.equal(useAsset);
    });

    it('exports the `useAssets()` hook', () =>
    {
        expect(PixiReact).to.have.property('useAssets')
            .and.to.equal(useAssets);
    });

    it('exports the `UseAssetsStatus()` hook', () =>
    {
        expect(PixiReact).to.have.property('UseAssetsStatus')
            .and.to.equal(UseAssetsStatus);
    });

    it('exports the `useExtend()` hook', () =>
    {
        expect(PixiReact).to.have.property('useExtend')
            .and.to.equal(useExtend);
    });

    it('exports the `useSuspenseAssets()` hook', () =>
    {
        expect(PixiReact).to.have.property('useSuspenseAssets')
            .and.to.equal(useSuspenseAssets);
    });

    it('exports the `useTick()` hook', () =>
    {
        expect(PixiReact).to.have.property('useTick')
            .and.to.equal(useTick);
    });

    it('doesn\'t export extraneous keys', () =>
    {
        expect(PixiReact).to.have.all.keys(
            'Application',
            'createRoot',
            'extend',
            'useApp',
            'useApplication',
            'useAsset',
            'useAssets',
            'UseAssetsStatus',
            'useExtend',
            'useTick',
            'useSuspenseAssets',
        );
    });
});
