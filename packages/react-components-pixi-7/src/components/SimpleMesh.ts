import type { Texture } from '@pixi/core';
import { DRAW_MODES } from '@pixi/constants';
import { SimpleMesh as PixiSimpleMesh } from '@pixi/mesh-extras';
import { applyDefaultProps, getTextureFromProps } from '../utils/props';
import type { ExpandoContainer, ExpandoSimpleMesh, PropsType } from '../types';

export type SimpleMeshProps = PropsType & {
    image?: string | HTMLImageElement;
    texture?: Texture;
    vertices?: Float32Array;
    uvs?: Float32Array;
    indices?: Uint16Array;
    drawMode?: DRAW_MODES;
};

const SimpleMesh = (root: ExpandoContainer, props: SimpleMeshProps) =>
{
    const texture = getTextureFromProps('Mesh', root, props);
    const { vertices, uvs, indices, drawMode = DRAW_MODES.TRIANGLES } = props;

    const simpleMesh: ExpandoSimpleMesh = new PixiSimpleMesh(texture, vertices, uvs, indices, drawMode);

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

export default SimpleMesh;