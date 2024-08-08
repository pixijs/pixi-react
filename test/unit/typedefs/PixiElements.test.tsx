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

        expect(elements.props.children).to.have.length(4);

        expect(elements.props.children[0].type).to.equal('graphics');
        expect(elements.props.children[0].props.draw).to.be.a('function');

        expect(elements.props.children[1].type).to.equal('sprite');
        expect(elements.props.children[1].props.draw).to.be.undefined;
        expect(elements.props.children[1].props.texture).to.be.instanceOf(Texture);

        expect(elements.props.children[2].type).to.equal('alphaFilter');
        expect(elements.props.children[2].props.alpha).to.equal(0.5);

        expect(elements.props.children[3].type).to.equal('pixiText');
        expect(elements.props.children[3].props.text).to.equal('Hello, World!');
    });
});
