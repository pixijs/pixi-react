import { Sprite as PixiSprite } from '@pixi/sprite';
import { getTextureFromProps, applyDefaultProps } from '../utils/props';
import type { PixiReactContainer, PixiReactSprite, SpriteProps } from '../types';

const Sprite = (root: PixiReactContainer, props: SpriteProps) =>
{
    const sprite: PixiReactSprite = new PixiSprite(getTextureFromProps('Sprite', root, props));

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
