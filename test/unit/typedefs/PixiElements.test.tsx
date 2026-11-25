import { AlphaFilter, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { describe, expect, it } from 'vitest';
import { extend, type PixiReactElementProps } from '../../../src';

extend({ Container, Graphics, Sprite, Text, Texture, AlphaFilter });

describe('PixiElements', () =>
{
    it('applies children and props', () =>
    {
        const elements = (
            <pixiContainer>
                <pixiGraphics draw={(_: Graphics) => { /* noop */ }} />
                <pixiSprite texture={Texture.EMPTY} />
                <pixiAlphaFilter alpha={0.5} />
                <pixiText anchor={{ x: 0.5, y: 0.5 }} text="Hello, World!" />
            </pixiContainer>
        );

        expect(elements.props.children).toHaveLength(4);

        expect(elements.props.children[0].type).toEqual('pixiGraphics');
        expect(elements.props.children[0].props.draw).toBeTypeOf('function');

        expect(elements.props.children[1].type).toEqual('pixiSprite');
        expect(elements.props.children[1].props.draw).toBeUndefined();
        expect(elements.props.children[1].props.texture).toBeInstanceOf(Texture);

        expect(elements.props.children[2].type).toEqual('pixiAlphaFilter');
        expect(elements.props.children[2].props.alpha).toEqual(0.5);

        expect(elements.props.children[3].type).toEqual('pixiText');
        expect(elements.props.children[3].props.text).toEqual('Hello, World!');
    });

    it('types event handlers, including ones a generic wrapper forwards', () =>
    {
        function Button<T extends typeof Container>(props: PixiReactElementProps<T>)
        {
            return <pixiContainer onClick={props.onClick} onWheel={props.onWheel} />;
        }

        const element = (
            <pixiContainer
                onPointerDown={(event) => event.global.x}
                onWheel={(event) => event.deltaY}
            >
                <Button onClick={() => undefined} />
            </pixiContainer>
        );

        expect(element.props.onWheel).toBeTypeOf('function');
    });
});
