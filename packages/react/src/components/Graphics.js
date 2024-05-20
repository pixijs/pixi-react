import { Graphics as PixiGraphics } from '@pixi/graphics';
import { applyDefaultProps } from '../utils/props';
import invariant from '../utils/invariant';

const Graphics = (root, { geometry }) =>
{
    invariant(!geometry || geometry instanceof PixiGraphics, `Graphics geometry needs to be a \`Graphics\``);
    const g = geometry ? new PixiGraphics(geometry.geometry) : new PixiGraphics();

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
