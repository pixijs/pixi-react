import { invariant } from '@pixi/react-invariant';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { applyDefaultProps } from '../utils/props';
import type { GraphicsProps, PixiReactContainer, PixiReactGraphics } from '../types';

const Graphics = (_root: PixiReactContainer, { geometry }: GraphicsProps) =>
{
    invariant(!geometry || geometry instanceof PixiGraphics, `Graphics geometry needs to be a \`PIXI.Graphics\``);
    const g: PixiReactGraphics = geometry ? new PixiGraphics(geometry.geometry) : new PixiGraphics();

    g.applyProps = (instance, oldProps, newProps) =>
    {
        const { draw, geometry, ...props } = newProps;
        let changed = applyDefaultProps(instance, oldProps, props);

        if (oldProps.draw !== draw && typeof draw === 'function')
        {
            changed = true;
            draw.call(g, g);
        }

        return changed;
    };

    return g;
};

export default Graphics;
