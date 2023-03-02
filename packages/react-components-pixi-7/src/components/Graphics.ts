import { invariant } from '@pixi/react-invariant';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { applyDefaultProps } from '../utils/props';
import type { ExpandoContainer, ExpandoGraphics, PropsType } from '../types';

export type GraphicsProps = PropsType & {
    geometry?: PixiGraphics;
};

const Graphics = (_root: ExpandoContainer, { geometry }: GraphicsProps) =>
{
    invariant(!geometry || geometry instanceof PixiGraphics, `Graphics geometry needs to be a \`PIXI.Graphics\``);
    const g: ExpandoGraphics = geometry ? new PixiGraphics(geometry.geometry) : new PixiGraphics();

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
