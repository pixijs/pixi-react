import { Assets, Cache, Sprite, Texture, type UnresolvedAsset } from 'pixi.js';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { extend, useAssets } from '../../../src';
import { cleanup, renderHook, waitFor } from '@testing-library/react';

extend({ Sprite });

describe('useAssets', async () =>
{
    const assets: UnresolvedAsset[] = [{ src: 'test.png' }, { src: 'test2.png' }];

    // Mock the Assets.load, Assets.get & Cache.has method
    let loaded: Record<string, unknown> = {};
    const load = vi.spyOn(Assets, 'load');
    const get = vi.spyOn(Assets, 'get');
    const has = vi.spyOn(Cache, 'has');

    // Mock the Assets.load to populate the loaded record, and resolve after 100ms
    load.mockImplementation((urls) =>
    {
        const assets = urls as UnresolvedAsset[];
        const result = assets.reduce((acc, val) => ({ ...acc, [val.src!.toString()]: Object.assign(Texture.EMPTY, { data: val.data }) }), {});

        return new Promise((resolve) =>
        {
            setTimeout(() =>
            {
                loaded = { ...loaded, ...result };
                resolve(result);
            }, 10);
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
        type Data = { data: { test: string } };
        const { result } = renderHook(() => useAssets<Texture & Data>([
            { src: 'test.png', data: { test: 'test' } },
            { src: 'test2.png', data: { test: 'test' } },
        ]));

        expect(result.current.isPending).toBe(true);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const { assets: [texture], isSuccess } = result.current;

        expect(isSuccess).toBe(true);
        expect(texture?.data.test).toBe('test');

        const isTexture = (texture?: Texture) => texture && texture instanceof Texture;
        const getData = (texture?: Texture & Data) => texture?.data.test;

        expect(isTexture(texture)).toBe(true);
        expect(getData(texture)).toBe('test');
    });

    it('is properly typed with data', async () =>
    {
        type Data = { data: { test: string } };
        const { result } = renderHook(() => useAssets([
            { src: 'test.png', data: { test: 'test' } },
        ]));

        expect(result.current.isPending).toBe(true);
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const { assets: [texture], isSuccess } = result.current;

        expect(isSuccess).toBe(true);
        expect(texture?.data.test).toBe('test');

        const isTexture = (texture?: Texture) => texture && texture instanceof Texture;
        const getData = (texture?: Texture & Data) => texture?.data.test;

        expect(isTexture(texture)).toBe(true);
        expect(getData(texture)).toBe('test');
    });
});
