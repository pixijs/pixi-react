import { Assets, Cache, Sprite, Texture, type UnresolvedAsset } from 'pixi.js';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { extend, useAssets } from '../../../src';
import { cleanup, renderHook, waitFor } from '@testing-library/react';

extend({ Sprite });

describe('useAssets', async () =>
{
    const assets: UnresolvedAsset[] = [{ src: 'test.png' }, { src: 'test2.png' }];

    // Store the loaded assets and data state to verify the hook results
    let loaded: Record<string, unknown> = {};
    let data: Record<string, any> = {};

    // Mock the Assets.load, Assets.get & Cache.has method
    const load = vi.spyOn(Assets, 'load');
    const get = vi.spyOn(Assets, 'get');
    const has = vi.spyOn(Cache, 'has');

    // Mock the Assets.load to populate the loaded record, and resolve after 1ms
    load.mockImplementation((urls) =>
    {
        const assets = urls as UnresolvedAsset[];

        return new Promise((resolve) =>
        {
            setTimeout(() =>
            {
                loaded = { ...loaded, ...assets.reduce((acc, val) => ({ ...acc, [val.src!.toString()]: Texture.EMPTY }), {}) };
                data = { ...data, ...assets.reduce((acc, val) => ({ ...acc, [val.src!.toString()]: val.data }), {}) };
                resolve(loaded);
            }, 1);
        });
    });

    // Mock the Assets.get to return the loaded record
    get.mockImplementation((keys) =>
        keys.reduce<Record<string, unknown>>((acc, key, idx) => ({ ...acc, [idx]: loaded[key] }), {}));

    // Mock the Cache.has to check if the key is in the loaded record
    has.mockImplementation((key) => key in loaded);

    // Load the default results using Assets.load to compare against the results from the useAssets hook
    const defaultResults = await Assets.load<Texture>(assets);

    beforeEach(() =>
    {
        loaded = {};
        data = {};
    });

    afterEach(() =>
    {
        cleanup();
    });

    afterAll(() =>
    {
        load.mockRestore();
        get.mockRestore();
    });

    it('loads assets', async () =>
    {
        const { result } = renderHook(() => useAssets<Texture>(assets));

        expect(result.current.isPending).toBe(true);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.assets).toEqual(assets.map(({ src }) => defaultResults[src!.toString()]));
    });

    it('accepts data', async () =>
    {
        // Explicitly type the T in the useAssets hook
        const { result } = renderHook(() => useAssets<Texture>([
            { src: 'test.png', data: { test: '7a1c8bee' } },
            { src: 'test2.png', data: { test: '230a3f41' } },
        ]));

        expect(result.current.isPending).toBe(true);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const { assets: [texture], isSuccess } = result.current;

        expect(isSuccess).toBe(true);
        expect(data['test.png'].test).toBe('7a1c8bee');
        expect(data['test2.png'].test).toBe('230a3f41');

        const isTexture = (texture?: Texture) => texture && texture instanceof Texture;

        expect(isTexture(texture)).toBe(true);
    });

    it('is properly typed with data', async () =>
    {
        // Do not provide a type for T in the useAssets hook
        const { result } = renderHook(() => useAssets([
            { src: 'test.png', data: { test: 'd460dbdd' } },
        ]));

        expect(result.current.isPending).toBe(true);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const { assets: [texture], isSuccess } = result.current;

        expect(isSuccess).toBe(true);

        const isTexture = (texture?: Texture) => texture && texture instanceof Texture;

        expect(isTexture(texture)).toBe(true);
    });
});
