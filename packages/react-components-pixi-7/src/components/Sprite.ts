import { Sprite as PixiSprite } from '@pixi/sprite';
import type { Texture } from '@pixi/core';
import { getTextureFromProps, applyDefaultProps } from '../utils/props';
import type { ExpandoContainer, ExpandoSprite, PropsType } from '../types';

export type SpriteProps = PropsType & {
    image?: string | HTMLImageElement;
    texture?: Texture;
};

const Sprite = (root: ExpandoContainer, props: SpriteProps) =>
{
    const sprite: ExpandoSprite = new PixiSprite(getTextureFromProps('Sprite', root, props));

    sprite.applyProps = (instance, oldProps, newProps) =>
    {
        const { image, texture, ...props } = newProps;
        let changed = applyDefaultProps(instance, oldProps, props);

        if ((texture && oldProps.texture !== newProps.texture) || (image && oldProps.image !== newProps.image))
        {
            // getTextureFromProps will call update for image
            if (oldProps.texture !== newProps.texture)
            {
                changed = true;
            }
            instance.texture = getTextureFromProps('Sprite', root, newProps);
        }

        return changed;
    };

    return sprite;
};

export default Sprite;
