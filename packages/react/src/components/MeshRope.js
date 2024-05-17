import { MeshRope as PixiMeshRope } from 'pixi.js';
import invariant from '../utils/invariant';
import { getTextureFromProps, applyDefaultProps } from '../utils/props';

const MeshRope = (root, props) =>
{
    const texture = getTextureFromProps('MeshRope', root, props);
    const { points } = props;

    const rope = new PixiMeshRope({ texture, points });

    rope.applyProps = (instance, oldProps, newProps) =>
    {
        const { image, texture, ...props } = newProps;

        invariant(Array.isArray(newProps.points), 'MeshRope points needs to be %s', 'Array<Point>');
        let changed = applyDefaultProps(instance, oldProps, props);

        if (image || texture)
        {
            if (texture !== oldProps.texture)
            {
                changed = true;
            }
            instance.texture = getTextureFromProps('MeshRope', root, newProps);
        }

        return changed;
    };

    return rope;
};

export default MeshRope;
