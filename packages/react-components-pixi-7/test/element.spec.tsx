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
import { render } from '@testing-library/react';
import type { PixiReactHostConfig } from '@pixi/react-fiber';
import type { ComponentsType, PixiComponentType, PropsType } from '@pixi/react-types';

import { TYPES } from '../src';
import { emptyTexture } from './__fixtures__/textures';
import { desyrel } from './__fixtures__/bitmapfonts';
import parseBitmapFont from './__utils__/parseBitmapFont';
import { configure } from './__utils__/configure';
import type { PixiReactContainer, ReactStageComponent } from '../src/types';

parseBitmapFont(desyrel);

describe('createElement', () =>
{
    let hostConfig: PixiReactHostConfig<Container, Container>;
    let createElement: (type: string, props?: PropsType) => Container;

    beforeEach(() =>
    {
        ({ hostConfig } = configure());
        createElement = (type: string, props: PropsType = {}) =>
            hostConfig.createInstance(type, props, new Container(), null, null);
    });

    test('types', () =>
    {
        expect(TYPES).toMatchSnapshot();
    });

    test('create Container', () =>
    {
        const element = createElement(TYPES.Container, {});

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

    test('throw Error for undefined component', () =>
    {
        expect(() => createElement('INVALID')).toThrow('Unable to instantiate element of type INVALID');
    });
});

describe('applyProps', () =>
{
    let spy: any;
    let hostConfig: PixiReactHostConfig<Container, Container>;
    let createElement: (type: string, props?: PropsType) => PixiReactContainer;

    beforeEach(() =>
    {
        ({ hostConfig } = configure());
        createElement = (type: string, props: PropsType = {}) =>
            hostConfig.createInstance(type, props, new Container(), null, null);
    });

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

        const changed = element.applyProps?.(element, { image: './image.png' }, { image: './new-image.png' });

        expect(spy).lastCalledWith('./new-image.png');
        expect(changed).toBeFalsy();
    });

    test('Sprite.applyProps texture', () =>
    {
        const element = createElement(TYPES.Sprite, { texture: emptyTexture });

        const changed = element.applyProps?.(element, { texture: emptyTexture }, { image: './image.png' });

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

        const changed = element.applyProps?.(element, { image: './image.png' }, { image: './new-image.png' });

        expect(changed).toBeFalsy();
        expect(spy).lastCalledWith('./new-image.png');
    });

    test('TilingSprite.applyProps texture', () =>
    {
        const element = createElement(TYPES.TilingSprite, { texture: emptyTexture });

        const changed = element.applyProps?.(element, { texture: emptyTexture }, { image: './image.png' });

        expect(changed).toBeTruthy();
    });

    test('TilingSprite.applyProps tilePosition', () =>
    {
        const oldPosition = '1, 2';
        const newPosition = { x: 12, y: 20 };
        const element = createElement(TYPES.TilingSprite, { tilePosition: oldPosition, image: './image.png' });

        const changed = element.applyProps?.(
            element,
            { tilePosition: oldPosition, image: './image.png' },
            { tilePosition: newPosition, image: './image.png' },
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

        const changed = element.applyProps?.(
            element,
            { image: './image.png' },
            {
                image: './new-image.png',
                points: [new Point(0, 0), new Point(20, 20)],
            },
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

        const changed = element.applyProps?.(element, { image: './image.png' }, { image: './new-image.png' });

        expect(spy).lastCalledWith('./new-image.png');
        expect(changed).toBeFalsy();
    });

    test('NineSlicePlane.applyProps texture', () =>
    {
        const element = createElement(TYPES.NineSlicePlane, { texture: emptyTexture });
        const changed = element.applyProps?.(element, { texture: emptyTexture }, { image: './new-image.png' });

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

        const changed = element.applyProps?.(element, { image: './image.png' }, { image: './new-image.png' });

        expect(spy).lastCalledWith('./new-image.png');
        expect(changed).toBeFalsy();
    });

    test('SimpleMesh.applyProps texture', () =>
    {
        const element = createElement(TYPES.SimpleMesh, { texture: emptyTexture });

        const changed = element.applyProps?.(element, { texture: emptyTexture }, { image: './new-image.png' });

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

        const applied = element.applyProps?.(element, { draw: spy }, { draw: spy });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(applied).toBeFalsy();
    });

    test('Graphics.applyProps draw prevented twice', () =>
    {
        const draw1 = jest.fn();
        const draw2 = jest.fn();
        const props = { draw: draw1 };
        const nextProps = { draw: draw2 };
        let applied: boolean | undefined = false;
        const element = createElement(TYPES.Graphics, props);

        applied = element.applyProps?.(element, props, props);
        expect(applied).toBeFalsy();
        applied = element.applyProps?.(element, props, props);
        expect(applied).toBeFalsy();
        expect(draw1).toHaveBeenCalledTimes(1);
        applied = element.applyProps?.(element, props, nextProps);
        expect(applied).toBeTruthy();
        applied = element.applyProps?.(element, nextProps, nextProps);
        expect(applied).toBeFalsy();
        expect(draw2).toHaveBeenCalledTimes(1);
    });
});

describe('PixiComponent', () =>
{
    let hostConfig: PixiReactHostConfig<Container, Container>;
    let root: Container;
    let createElement: (type: string, props?: PropsType) => PixiReactContainer;
    let Stage: ReactStageComponent;
    let COMPONENTS: ComponentsType;
    let PixiComponent: PixiComponentType;

    const mockLifeCycle = {
        create: () => new Container(),
    };

    beforeEach(() =>
    {
        ({ hostConfig, Stage, COMPONENTS, PixiComponent } = configure());
        root = new Container();

        createElement = (type: string, props: PropsType = {}) =>
            hostConfig.createInstance(type, props, root, null, null);
    });

    test('type must be defined', () =>
    {
        // @ts-ignore - specifically allowing null for testing
        expect(() => PixiComponent(null, mockLifeCycle)).toThrow('Expect type to be defined, got `null`');
    });

    test('cannot override existing component', () =>
    {
        expect(() => PixiComponent('Text', mockLifeCycle)).toThrow(
            'Component `Text` could not be created, a component with that name already exists.',
        );
    });

    test('inject custom component', () =>
    {
        PixiComponent('Rectangle', mockLifeCycle);
        expect(COMPONENTS).toHaveProperty('Rectangle', mockLifeCycle);
    });

    test('create injected component', () =>
    {
        const scoped = jest.fn();
        const config = {
            destroyChildren: true,
            destroy: true,
        };

        const lifecycle = {
            create: jest.fn(() => new Graphics()),
            didMount: jest.fn(),
            willUnmount: jest.fn(),
            applyProps: jest.fn(function applyProps()
            {
                scoped(this);

                return true;
            }),
            config,
        };

        // eslint-disable-next-line no-new
        PixiComponent('Rectangle', lifecycle);

        const props = { x: 100, y: 200 };
        const element = createElement('Rectangle', props);

        expect(element.didMount).toBeDefined();
        expect(element.willUnmount).toBeDefined();
        expect(element.applyProps).toBeDefined();
        expect(element.config).toBe(config);
        expect(element).toBeInstanceOf(Graphics);
        expect(lifecycle.create).toHaveBeenCalledTimes(1);
        expect(lifecycle.create).toHaveBeenCalledWith(props, root);
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
            destroy: true,
        };

        const makeLifecycle = (pixiInstance: PixiReactContainer) => ({
            create: jest.fn(() => pixiInstance),
            didMount: jest.fn(),
            willUnmount: jest.fn(),
            applyProps: jest.fn(function applyProps()
            {
                scoped(this);

                return true;
            }),
            config,
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
            </Stage>,
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
            baseTexture: false,
        });

        if (destroyChildren)
        {
            expect(childLifecycle.willUnmount).toHaveBeenCalledTimes(1);
            expect(childDestroySpy).toHaveBeenCalledTimes(1);
            expect(childDestroySpy).toHaveBeenCalledWith({
                children: destroyChildren,
                texture: false,
                baseTexture: false,
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
        PixiComponent('Rectangle', {
            create: () => new Graphics(),
        });

        const element = createElement('Rectangle');

        expect(element.didMount).toBeUndefined();
        expect(element.willUnmount).toBeUndefined();
        expect(element.applyProps).toBeUndefined();
    });
});
