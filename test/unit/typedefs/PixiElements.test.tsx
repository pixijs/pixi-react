import { AlphaFilter, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { describe, expect, it } from 'vitest';
import { extend } from '../../../src';

extend({ Container, Graphics, Sprite, Text, Texture, AlphaFilter });

describe('PixiElements', () =>
{
    it('applies children and props', () =>
    {
        const elements = (
            <container>
                <graphics draw={(_: Graphics) => { /* noop */ }} />
                <sprite texture={Texture.EMPTY} />
                <alphaFilter alpha={0.5} />
                <pixiText anchor={{ x: 0.5, y: 0.5 }} text="Hello, World!" />
            </container>
        );

        expect(elements.props.children).toHaveLength(4);

        expect(elements.props.children[0].type).toEqual('graphics');
        expect(elements.props.children[0].props.draw).toBeTypeOf('function');

        expect(elements.props.children[1].type).toEqual('sprite');
        expect(elements.props.children[1].props.draw).toBeUndefined();
        expect(elements.props.children[1].props.texture).toBeInstanceOf(Texture);

        expect(elements.props.children[2].type).toEqual('alphaFilter');
        expect(elements.props.children[2].props.alpha).toEqual(0.5);

        expect(elements.props.children[3].type).toEqual('pixiText');
        expect(elements.props.children[3].props.text).toEqual('Hello, World!');
    });
});
