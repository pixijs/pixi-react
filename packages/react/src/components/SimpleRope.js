import { SimpleRope as PixiSimpleRope } from '@pixi/mesh-extras';
import invariant from '../utils/invariant';
import { getTextureFromProps, applyDefaultProps } from '../utils/props';

const SimpleRope = (root, props) =>
{
    const texture = getTextureFromProps('SimpleRope', root, props);
    const { points } = props;

    const rope = new PixiSimpleRope(texture, points);

    rope.applyProps = (instance, oldProps, newProps) =>
    {
        const { image, texture, ...props } = newProps;

        invariant(Array.isArray(newProps.points), 'SimpleRope points needs to be %s', 'Array<Point>');
        let changed = applyDefaultProps(instance, oldProps, props);

        if (image || texture)
        {
            if (texture !== oldProps.texture)
            {
                changed = true;
            }
            instance.texture = getTextureFromProps('SimpleRope', root, newProps);
        }

        return changed;
    };

    return rope;
};

export default SimpleRope;
