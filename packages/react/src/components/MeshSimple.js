import { MeshSimple as PixiMeshSimple } from 'pixi.js';
import { applyDefaultProps, getTextureFromProps } from '../utils/props';

const MeshSimple = (root, props) =>
{
    const texture = getTextureFromProps('Mesh', root, props);
    const { vertices, uvs, indices, topology = 'triangle-list' } = props;

    const simpleMesh = new PixiMeshSimple({ texture, vertices, uvs, indices, topology });

    simpleMesh.applyProps = (instance, oldProps, newProps) =>
    {
        const { image, texture, ...props } = newProps;
        let changed = applyDefaultProps(instance, oldProps, props);

        if (image || texture)
        {
            // change = true not required for image, getTextureFromProps will call update
            if (texture !== oldProps.texture)
            {
                changed = true;
            }
            instance.texture = getTextureFromProps('Mesh', root, newProps);
        }

        return changed;
    };

    return simpleMesh;
};

export default MeshSimple;
