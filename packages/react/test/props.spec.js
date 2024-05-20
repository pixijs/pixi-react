import { Container } from '@pixi/display';
import { Texture } from '@pixi/core';
import { getTextureFromProps, applyDefaultProps, PROPS_DISPLAY_OBJECT, PROPS_RESERVED } from '../src/utils/props';
import { emptyTexture } from './__fixtures__/textures';

describe('props', () =>
{
    test('reserved props', () =>
    {
        expect(PROPS_RESERVED).toMatchSnapshot();
    });
    test('display object props', () =>
    {
        expect(PROPS_DISPLAY_OBJECT).toMatchSnapshot();
    });

    describe('getTextureFromProps', () =>
    {
        let spy;

        beforeAll(() =>
        {
            spy = jest.spyOn(Texture, 'from').mockReturnValue(emptyTexture);
        });

        afterAll(() =>
        {
            spy.mockRestore();
        });

        test('invariant image', () =>
        {
            expect(() => getTextureFromProps('Test', undefined, { image: 123 })).toThrow('Test image prop is invalid');
        });

        test('invariant texture', () =>
        {
            expect(() => getTextureFromProps('Test', undefined, { texture: 'texture' })).toThrow(
                'Test texture needs to be typeof `Texture`'
            );
        });

        test('invariant video', () =>
        {
            expect(() => getTextureFromProps('Test', undefined, { video: 123 })).toThrow('Test video prop is invalid');
        });

        test('invariant source', () =>
        {
            expect(() => getTextureFromProps('Test', undefined, { source: null })).toThrow('Test source prop is invalid');
        });

        test('get texture from image url', () =>
        {
            const texture = getTextureFromProps('Test', undefined, { image: './image.png' });

            expect(texture).toBeInstanceOf(Texture);
            expect(spy).toBeCalledWith('./image.png');
        });

        test('get texture from image html element', () =>
        {
            const image = document.createElement('img');
            const texture = getTextureFromProps('Test', undefined, { image });

            expect(texture).toBeInstanceOf(Texture);
            expect(spy).toBeCalledWith(image);
        });

        test('get texture from video url', () =>
        {
            const texture = getTextureFromProps('Test', undefined, { video: './video.mp4' });

            expect(texture).toBeInstanceOf(Texture);
            expect(spy).toBeCalledWith('./video.mp4');
        });

        test('get texture from video html element', () =>
        {
            const video = document.createElement('video');
            const texture = getTextureFromProps('Test', undefined, { video });

            expect(texture).toBeInstanceOf(Texture);
            expect(spy).toBeCalledWith(video);
        });

        test('get no texture', () =>
        {
            expect(() => getTextureFromProps('Test', undefined, {})).toThrow('Test could not get texture from props');
        });

        test('get texture from texture', () =>
        {
            const texture = getTextureFromProps('Test', undefined, { texture: emptyTexture });

            expect(texture).toBe(emptyTexture);
        });
    });

    describe('applyDefaultProps', () =>
    {
        let instance;
        let fn;

        beforeEach(() =>
        {
            instance = new Container();
            fn = jest.fn();
        });

        test('call removeListener', () =>
        {
            const spy = jest.spyOn(instance, 'removeListener');
            const changed = applyDefaultProps(instance, { click: fn }, {});

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('click', fn);
            expect(changed).toBeTruthy();
        });

        test('call on', () =>
        {
            const spy = jest.spyOn(instance, 'on');
            const changed = applyDefaultProps(instance, {}, { click: fn });

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('click', fn);
            expect(changed).toBeTruthy();
        });

        test('should get change value', () =>
        {
            expect(applyDefaultProps(instance, { x: 0 }, { x: 1 })).toBeTruthy();
            expect(applyDefaultProps(instance, { x: 0 }, { x: 0 })).toBeFalsy();
        });

        test('removes old and add new listener', () =>
        {
            let changed = applyDefaultProps(instance, {}, { click: fn });

            instance.emit('click', instance);
            instance.emit('click', instance);
            expect(fn).toHaveBeenCalledTimes(2);
            expect(fn).toHaveBeenCalledWith(instance);
            expect(changed).toBeTruthy();

            const newFn = jest.fn();

            fn.mockClear();

            changed = applyDefaultProps(instance, { click: fn }, { click: newFn });
            instance.emit('click', instance);
            expect(fn).toHaveBeenCalledTimes(0);
            expect(newFn).toHaveBeenCalledTimes(1);
            expect(newFn).toHaveBeenCalledWith(instance);
            expect(changed).toBeTruthy();
        });

        test('prevent teardown/setup on same values', () =>
        {
            const spyAdd = jest.spyOn(instance, 'on');
            const spyRemove = jest.spyOn(instance, 'removeListener');

            applyDefaultProps(instance, {}, { click: fn });

            expect(spyRemove).toHaveBeenCalledTimes(0);
            expect(spyAdd).toHaveBeenCalledTimes(1);

            applyDefaultProps(instance, { click: fn }, { click: fn });

            expect(spyRemove).toHaveBeenCalledTimes(0);
            expect(spyAdd).toHaveBeenCalledTimes(1);

            applyDefaultProps(instance, { click: fn }, { click: () => {} });

            expect(spyRemove).toHaveBeenCalledTimes(1);
            expect(spyAdd).toHaveBeenCalledTimes(2);
        });

        test('invalid instance', () =>
        {
            expect(() => applyDefaultProps()).toThrow('instance needs to be typeof `DisplayObject`, got `undefined`');
        });

        test('skip reserved props', () =>
        {
            const changed = applyDefaultProps(instance, {}, { children: [1, 2, 3], worldAlpha: 0 });

            expect(instance.children).toEqual([]);
            expect(instance.worldAlpha).toEqual(1);
            expect(changed).toBeFalsy();
        });

        test('set prop on instance', () =>
        {
            const changed = applyDefaultProps(instance, {}, { foo: 'bar', alpha: 0.5 });

            expect(instance.foo).toEqual('bar');
            expect(instance.alpha).toEqual(0.5);
            expect(changed).toBeTruthy();
        });

        test('set back to default value', () =>
        {
            instance.alpha = 10;
            const changed = applyDefaultProps(instance, {}, { alpha: undefined });

            expect(instance.alpha).toEqual(1);
            expect(changed).toBeTruthy();
        });
    });
});
