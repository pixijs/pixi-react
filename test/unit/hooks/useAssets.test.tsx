import { Assets, loadTextures, Sprite, Texture, type UnresolvedAsset } from 'pixi.js';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { extend, useAssets } from '../../../src';
import { cleanup, renderHook, waitFor } from '@testing-library/react';

extend({ Sprite });

describe('useAssets', async () =>
{
    loadTextures.config = {
        preferWorkers: false,
        preferCreateImageBitmap: true,
        crossOrigin: 'anonymous',
    };

    const mockFetch = vi.spyOn(global, 'fetch');

    global.createImageBitmap = vi.fn().mockImplementation(() => new Promise<ImageBitmap>((resolve) =>
    {
        setTimeout(() => resolve({ width: 100, height: 100, close: () => { /* noop */ } }), 1);
    }));

    mockFetch.mockImplementation(() => new Promise<Response>((resolve) =>
    {
        setTimeout(() => resolve(new Response()), 1);
    }));

    beforeEach(async () =>
    {
        await Assets.init({ skipDetections: true });
    });

    afterEach(() =>
    {
        Assets.reset();
        cleanup();
    });

    afterAll(() =>
    {
        mockFetch.mockRestore();
    });

    it('loads assets', async () =>
    {
        const assets: UnresolvedAsset[] = [{ src: 'http://localhost/bc3d2999.png' }, { src: 'http://localhost/1a5c1ce4.png' }];

        const { result } = renderHook(() => useAssets<Texture>(assets));

        expect(result.current.isPending).toBe(true);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('accepts data', async () =>
    {
        // Explicitly type the T in the useAssets hook
        const { result } = renderHook(() => useAssets<Texture>([
            { src: 'http://localhost/7a1c8bee.png', data: { test: '7a1c8bee' } },
            { src: 'http://localhost/230a3f41.png', data: { test: '230a3f41' } },
        ]));

        expect(result.current.isPending).toBe(true);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const { assets: [texture], isSuccess } = result.current;

        expect(isSuccess).toBe(true);

        const isTexture = (texture?: Texture) => texture && texture instanceof Texture;

        expect(isTexture(texture)).toBe(true);
    });

    it('is properly typed with data', async () =>
    {
        // Do not provide a type for T in the useAssets hook
        const { result } = renderHook(() => useAssets([
            { src: 'http://localhost/d460dbdd.png', data: { test: 'd460dbdd' } },
        ]));

        expect(result.current.isPending).toBe(true);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const { assets: [texture], isSuccess } = result.current;

        expect(isSuccess).toBe(true);

        const isTexture = (texture?: Texture) => texture && texture instanceof Texture;

        expect(isTexture(texture)).toBe(true);
    });

    it('handles subsequent loads', async () =>
    {
        const assets: UnresolvedAsset[] = [{ src: 'http://localhost/c13a19b0.png' }, { src: 'http://localhost/ba91270b.png' }];

        const { result, rerender } = renderHook(() => useAssets<Texture>(assets));

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const { result: result2, rerender: rerender2 } = renderHook(() => useAssets<Texture>(assets));

        await waitFor(() => expect(result2.current.isSuccess).toBe(true));

        const isTexture = (texture?: Texture) => texture && texture instanceof Texture;

        expect(result.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
        expect(isTexture(result.current.assets[0])).toBe(true);
        expect(isTexture(result.current.assets[1])).toBe(true);
        expect(isTexture(result2.current.assets[0])).toBe(true);
        expect(isTexture(result2.current.assets[1])).toBe(true);

        rerender();

        expect(result.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
        expect(isTexture(result.current.assets[0])).toBe(true);
        expect(isTexture(result.current.assets[1])).toBe(true);
        expect(isTexture(result2.current.assets[0])).toBe(true);
        expect(isTexture(result2.current.assets[1])).toBe(true);

        rerender2();

        expect(result.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
        expect(isTexture(result.current.assets[0])).toBe(true);
        expect(isTexture(result.current.assets[1])).toBe(true);
        expect(isTexture(result2.current.assets[0])).toBe(true);
        expect(isTexture(result2.current.assets[1])).toBe(true);
    });
});
