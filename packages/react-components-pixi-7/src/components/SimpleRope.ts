import { SimpleRope as PixiSimpleRope } from '@pixi/mesh-extras';
import { invariant } from '@pixi/react-invariant';
import { getTextureFromProps, applyDefaultProps } from '../utils/props';
import type { ExpandoContainer, ExpandoSimpleRope, PropsType } from '../types';
import type { IPoint, Texture } from '@pixi/core';

export type SimpleRopeProps = PropsType & {
    image?: string | HTMLImageElement;
    texture?: Texture;
    points: IPoint[];
};

const SimpleRope = (root: ExpandoContainer, props: SimpleRopeProps) =>
{
    const texture = getTextureFromProps('SimpleRope', root, props);
    const { points } = props;

    const rope: ExpandoSimpleRope = new PixiSimpleRope(texture, points);

    rope.applyProps = (instance, oldProps, newProps) =>
    {
        const { image, texture, ...props } = newProps;

        invariant(Array.isArray(newProps.points), 'SimpleRope points needs to be %s', 'Array<PIXI.Point>');
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