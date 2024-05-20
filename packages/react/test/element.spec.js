import { Container } from '@pixi/display';
import { Graphics } from '@pixi/graphics';
import { Text } from '@pixi/text';
import { BitmapText } from '@pixi/text-bitmap';
import { Sprite } from '@pixi/sprite';
import { Texture } from '@pixi/core';
import { AnimatedSprite } from '@pixi/sprite-animated';
import { ParticleContainer } from '@pixi/particle-container';
import { TilingSprite } from '@pixi/sprite-tiling';
import { SimpleRope, SimpleMesh, NineSlicePlane } from '@pixi/mesh-extras';
import { Point } from '@pixi/math';
import React from 'react';
import { render } from '@testing-library/react';

import { createElement, TYPES, TYPES_INJECTED, PixiComponent } from '../src/utils/element';
import Stage from '../src/stage';

import { emptyTexture } from './__fixtures__/textures';
import { desyrel } from './__fixtures__/bitmapfonts';
import parseBitmapFont from './__utils__/parseBitmapFont';

parseBitmapFont(desyrel);

describe('createElement', () =>
{
    test('types', () =>
    {
        expect(TYPES).toMatchSnapshot();
    });

    test('create Container', () =>
    {
        const element = createElement(TYPES.Container);

        expect(element).toBeInstanceOf(Container);
    });

    test('create Text', () =>
    {
        const element = createElement(TYPES.Text, { text: 'foobar' });

        expect(element).toBeInstanceOf(Text);
    });

    test('create Text as a sprite', () =>
    {
        const element = createElement(TYPES.Text, { text: 'foobar', isSprite: true });

        expect(element).toBeInstanceOf(Sprite);
    });

    test('create Sprite', () =>
    {
        const element = createElement(TYPES.Sprite, { texture: emptyTexture });

        expect(element).toBeInstanceOf(Sprite);
    });

    test('create AnimatedSprite', () =>
    {
        const element = createElement(TYPES.AnimatedSprite, { textures: [emptyTexture] });

        expect(element).toBeInstanceOf(AnimatedSprite);
    });

    test('create ParticleContainer', () =>
    {
        const element = createElement(TYPES.ParticleContainer);

        expect(element).toBeInstanceOf(ParticleContainer);
    });

    test('create BitmapText', () =>
    {
        const element = createElement(TYPES.BitmapText, {
            text: 'foobar',
            style: { fontName: 'Desyrel', fontSize: 35, align: 'left' },
        });

        expect(element).toBeInstanceOf(BitmapText);
    });

    test('create TilingSprite', () =>
    {
        const element = createElement(TYPES.TilingSprite, { texture: emptyTexture });

        expect(element).toBeInstanceOf(TilingSprite);
    });

    test('create Graphics', () =>
    {
        const element = createElement(TYPES.Graphics);

        expect(element).toBeInstanceOf(Graphics);
    });

    test('create NineSlicePlane', () =>
    {
        const element = createElement(TYPES.NineSlicePlane, { texture: emptyTexture });

        expect(element).toBeInstanceOf(NineSlicePlane);
    });

    test('create SimpleMesh', () =>
    {
        const element = createElement(TYPES.SimpleMesh, { texture: emptyTexture });

        expect(element).toBeInstanceOf(SimpleMesh);
    });

    test('create SimpleRope', () =>
    {
        const element = createElement(TYPES.SimpleRope, {
            texture: emptyTexture,
            points: [new Point(0, 0), new Point(20, 20)],
        });

        expect(element).toBeInstanceOf(SimpleRope);
    });

    test('get undefined', () =>
    {
        expect(createElement('INVALID')).toBeUndefined();
    });
});

describe('element.applyProps', () =>
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

    test('Sprite.applyProps exists', () =>
    {
        const element = createElement(TYPES.Sprite, { image: './image.png' });

        expect(element).toHaveProperty('applyProps');
        expect(spy).toHaveBeenCalledWith('./image.png');
    });

    test('AnimatedSprite.applyProps with images prop exists', () =>
    {
        const element = createElement(TYPES.AnimatedSprite, { images: ['./image.png'] });

        expect(element).toHaveProperty('applyProps');
        expect(spy).lastCalledWith('./image.png');
    });

    test('AnimatedSprite.applyProps with updated image props', () =>
    {
        const element = createElement(TYPES.AnimatedSprite, { images: ['./image.png'] });
        const changed = element.applyProps(element, { images: ['./image.png'] }, { images: ['./new-image.png'] });

        expect(spy).lastCalledWith('./new-image.png');
    });

    test('AnimatedSprite.applyProps with textures prop exists', () =>
    {
        const element = createElement(TYPES.AnimatedSprite, { textures: [Texture.from('./image.png')] });

        expect(element).toHaveProperty('applyProps');
        expect(spy).lastCalledWith('./image.png');
    });

    test('Sprite.applyProps image', () =>
    {
        const element = createElement(TYPES.Sprite, { image: './image.png' });

        expect(spy).lastCalledWith('./image.png');

        const changed = element.applyProps(element, { image: './image.png' }, { image: './new-image.png' });

        expect(spy).lastCalledWith('./new-image.png');
        expect(changed).toBeFalsy();
    });

    test('Sprite.applyProps texture', () =>
    {
        const element = createElement(TYPES.Sprite, { texture: emptyTexture });

        const changed = element.applyProps(element, { texture: emptyTexture }, { image: './image.png' });

        expect(changed).toBeTruthy();
    });

    test('TilingSprite.applyProps exists', () =>
    {
        const element = createElement(TYPES.TilingSprite, { image: './image.png' });

        expect(element).toHaveProperty('applyProps');
        expect(spy).toHaveBeenCalledWith('./image.png');
    });

    test('TilingSprite.applyProps image', () =>
    {
        const element = createElement(TYPES.TilingSprite, { image: './image.png' });

        expect(spy).lastCalledWith('./image.png');

        const changed = element.applyProps(element, { image: './image.png' }, { image: './new-image.png' });

        expect(changed).toBeFalsy();
        expect(spy).lastCalledWith('./new-image.png');
    });

    test('TilingSprite.applyProps texture', () =>
    {
        const element = createElement(TYPES.TilingSprite, { texture: emptyTexture });

        const changed = element.applyProps(element, { texture: emptyTexture }, { image: './image.png' });

        expect(changed).toBeTruthy();
    });

    test('TilingSprite.applyProps tilePosition', () =>
    {
        const oldPosition = '1, 2';
        const newPosition = { x: 12, y: 20 };
        const element = createElement(TYPES.TilingSprite, { tilePosition: oldPosition, image: './image.png' });

        const changed = element.applyProps(
            element,
            { tilePosition: oldPosition, image: './image.png' },
            { tilePosition: newPosition, image: './image.png' }
        );

        expect(changed).toBeTruthy();
    });

    test('SimpleRope.applyProps exists', () =>
    {
        const element = createElement(TYPES.SimpleRope, {
            image: './image.png',
            points: [new Point(0, 0), new Point(20, 20)],
        });

        expect(element).toHaveProperty('applyProps');
        expect(spy).toHaveBeenCalledWith('./image.png');
    });

    test('SimpleRope.applyProps image', () =>
    {
        const element = createElement(TYPES.SimpleRope, {
            image: './image.png',
            points: [new Point(0, 0), new Point(20, 20)],
        });

        expect(spy).lastCalledWith('./image.png');

        const changed = element.applyProps(
            element,
            { image: './image.png' },
            {
                image: './new-image.png',
                points: [new Point(0, 0), new Point(20, 20)],
            }
        );

        expect(spy).lastCalledWith('./new-image.png');
        expect(changed).toBeTruthy();
    });

    test('NineSlicePlane.applyProps exists', () =>
    {
        const element = createElement(TYPES.NineSlicePlane, { image: './image.png' });

        expect(element).toHaveProperty('applyProps');
        expect(spy).toHaveBeenCalledWith('./image.png');
    });

    test('NineSlicePlane.applyProps image', () =>
    {
        const element = createElement(TYPES.NineSlicePlane, { image: './image.png' });

        expect(spy).lastCalledWith('./image.png');

        const changed = element.applyProps(element, { image: './image.png' }, { image: './new-image.png' });

        expect(spy).lastCalledWith('./new-image.png');
        expect(changed).toBeFalsy();
    });

    test('NineSlicePlane.applyProps texture', () =>
    {
        const element = createElement(TYPES.NineSlicePlane, { texture: emptyTexture });
        const changed = element.applyProps(element, { texture: emptyTexture }, { image: './new-image.png' });

        expect(changed).toBeTruthy();
    });

    test('SimpleMesh.applyProps exists', () =>
    {
        const element = createElement(TYPES.SimpleMesh, { image: './image.png' });

        expect(element).toHaveProperty('applyProps');
        expect(spy).toHaveBeenCalledWith('./image.png');
    });

    test('SimpleMesh.applyProps image', () =>
    {
        const element = createElement(TYPES.SimpleMesh, { image: './image.png' });

        expect(spy).lastCalledWith('./image.png');

        const changed = element.applyProps(element, { image: './image.png' }, { image: './new-image.png' });

        expect(spy).lastCalledWith('./new-image.png');
        expect(changed).toBeFalsy();
    });

    test('SimpleMesh.applyProps texture', () =>
    {
        const element = createElement(TYPES.SimpleMesh, { texture: emptyTexture });

        const changed = element.applyProps(element, { texture: emptyTexture }, { image: './new-image.png' });

        expect(changed).toBeTruthy();
    });

    test('Graphics.applyProps exists', () =>
    {
        const spy = jest.fn();

        const element = createElement(TYPES.Graphics, { draw: spy });

        expect(element).toHaveProperty('applyProps');
        expect(spy).toBeCalledWith(element);
    });

    test('Graphics.applyProps draw', () =>
    {
        const spy = jest.fn();

        const element = createElement(TYPES.Graphics, { draw: spy });

        expect(spy).toHaveBeenCalledTimes(1);

        const applied = element.applyProps(element, { draw: spy }, { draw: spy });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(applied).toBeFalsy();
    });

    test('Graphics.applyProps draw prevented twice', () =>
    {
        const draw1 = jest.fn();
        const draw2 = jest.fn();
        const props = { draw: draw1 };
        const nextProps = { draw: draw2 };
        let applied = false;
        const element = createElement(TYPES.Graphics, props);

        applied = element.applyProps(element, props, props);
        expect(applied).toBeFalsy();
        applied = element.applyProps(element, props, props);
        expect(applied).toBeFalsy();
        expect(draw1).toHaveBeenCalledTimes(1);
        applied = element.applyProps(element, props, nextProps);
        expect(applied).toBeTruthy();
        applied = element.applyProps(element, nextProps, nextProps);
        expect(applied).toBeFalsy();
        expect(draw2).toHaveBeenCalledTimes(1);
    });
});

describe('PixiComponent', () =>
{
    afterEach(() =>
    {
        Object.keys(TYPES_INJECTED).forEach((k) =>
        {
            delete TYPES_INJECTED[k];
        });
    });

    test('type must be defined', () =>
    {
        expect(() => new PixiComponent(null)).toThrow('Expect type to be defined, got `null`');
    });

    test('cannot override existing component', () =>
    {
        expect(() => new PixiComponent('Text', {})).toThrow(
            'Component `Text` could not be created, already exists in default components.'
        );
    });

    test('inject custom component', () =>
    {
        const lifecycle = { create: (props) => {} };

        // eslint-disable-next-line no-new
        new PixiComponent('Rectangle', lifecycle);
        expect(TYPES_INJECTED).toHaveProperty('Rectangle', lifecycle);
    });

    test('create injected component', () =>
    {
        const scoped = jest.fn();
        const config = {
            destroyChildren: true,
            destroy: true
        };

        const lifecycle = {
            create: jest.fn(() => new Graphics()),
            didMount: jest.fn(),
            willUnmount: jest.fn(),
            applyProps: jest.fn(function applyProps()
            {
                scoped(this);
            }),
            config
        };

        // eslint-disable-next-line no-new
        new PixiComponent('Rectangle', lifecycle);

        const props = { x: 100, y: 200 };
        const element = createElement('Rectangle', props, null);

        expect(element.didMount).toBeDefined();
        expect(element.willUnmount).toBeDefined();
        expect(element.applyProps).toBeDefined();
        expect(element.config).toBe(config);
        expect(element).toBeInstanceOf(Graphics);
        expect(lifecycle.create).toHaveBeenCalledTimes(1);
        expect(lifecycle.create).toHaveBeenCalledWith(props, { root: null });
        expect(lifecycle.applyProps).toHaveBeenCalledTimes(1);
        expect(scoped).toHaveBeenCalledTimes(1);
        expect(scoped).toHaveBeenCalledWith(element);
    });

    test.each`
        destroyChildren
        ${true}
        ${false}
    `('unmount and destroy component when destroyChildren is $destroyChildren', ({ destroyChildren }) =>
    {
        const scoped = jest.fn();
        const config = {
            destroyChildren,
            destroy: true
        };

        const makeLifecycle = (pixiInstance) => ({
            create: jest.fn(() => pixiInstance),
            didMount: jest.fn(),
            willUnmount: jest.fn(),
            applyProps: jest.fn(function applyProps()
            {
                scoped(this);
            }),
            config
        });

        const parentPixiInstance = new Container();
        const childPixiInstance = new Container();

        const parentDestroySpy = jest.spyOn(parentPixiInstance, 'destroy');
        const childDestroySpy = jest.spyOn(childPixiInstance, 'destroy');

        const parentLifecycle = makeLifecycle(parentPixiInstance);
        const childLifecycle = makeLifecycle(childPixiInstance);

        const Parent = PixiComponent('Parent', parentLifecycle);
        const Child = PixiComponent('Child', childLifecycle);

        const { unmount } = render(
            <Stage width={800} height={600}>
                <Parent>
                    <Child />
                </Parent>
            </Stage>
        );

        expect(parentLifecycle.create).toHaveBeenCalledTimes(1);
        expect(parentLifecycle.didMount).toHaveBeenCalledTimes(1);
        expect(parentLifecycle.applyProps).toHaveBeenCalledTimes(1);
        expect(childLifecycle.create).toHaveBeenCalledTimes(1);
        expect(childLifecycle.didMount).toHaveBeenCalledTimes(1);
        expect(childLifecycle.applyProps).toHaveBeenCalledTimes(1);

        unmount();

        expect(parentLifecycle.willUnmount).toHaveBeenCalledTimes(1);
        expect(parentDestroySpy).toHaveBeenCalledTimes(1);
        expect(parentDestroySpy).toHaveBeenCalledWith({
            children: destroyChildren,
            texture: false,
            baseTexture: false
        });

        if (destroyChildren)
        {
            expect(childLifecycle.willUnmount).toHaveBeenCalledTimes(1);
            expect(childDestroySpy).toHaveBeenCalledTimes(1);
            expect(childDestroySpy).toHaveBeenCalledWith({
                children: destroyChildren,
                texture: false,
                baseTexture: false
            });
        }
        else
        {
            expect(childLifecycle.willUnmount).not.toHaveBeenCalled();
            expect(childDestroySpy).not.toHaveBeenCalled();
        }
    });

    test('create injected component without lifecycle methods', () =>
    {
        // eslint-disable-next-line no-new
        new PixiComponent('Rectangle', {
            create: () => new Graphics(),
        });

        const element = createElement('Rectangle');

        expect(element.didMount).toBeUndefined();
        expect(element.willUnmount).toBeUndefined();
        expect(element.applyProps).toBeUndefined();
    });
});
