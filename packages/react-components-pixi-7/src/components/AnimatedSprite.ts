import { Texture } from '@pixi/core';
import type { FrameObject } from '@pixi/sprite-animated';
import { AnimatedSprite as PixiAnimatedSprite } from '@pixi/sprite-animated';
import { invariant } from '@pixi/react-invariant';
import { applyDefaultProps } from '../utils/props';
import type { AnimatedSpriteProps, AnimatedSpriteTexturesProp, PixiReactAnimatedSprite, PixiReactContainer } from '../types';
import { isArrayWithLength } from '../utils/fp';

const isTexture = (maybeTexture: any): maybeTexture is Texture => maybeTexture instanceof Texture;
const isFrameObject = (maybeFrameObject: any): maybeFrameObject is FrameObject => Boolean(maybeFrameObject?.texture);

const validateTextures = (textures: AnimatedSpriteTexturesProp) =>
    textures.map((texture) =>
    {
        const instanceIsTexture = isTexture(texture);
        const instanceIsFrameObject = isFrameObject(texture);

        invariant(
            instanceIsTexture || instanceIsFrameObject,
            `AnimationSprite textures needs to be an array of \`PIXI.Texture\` or \`{ texture: PIXI.Texture, time:
                number }\``,
        );

        return texture;
    });

const AnimatedSprite = (_root: PixiReactContainer, props: AnimatedSpriteProps) =>
{
    const { textures, images, isPlaying = true, initialFrame } = props;

    invariant(
        isArrayWithLength(textures) || isArrayWithLength(images),
        `AnimationSprite requires either a textures or images prop`,
    );

    const animatedSprite: PixiReactAnimatedSprite = images
        ? PixiAnimatedSprite.fromImages(images)
        : new PixiAnimatedSprite(validateTextures(textures as AnimatedSpriteTexturesProp) as AnimatedSpriteTexturesProp);

    animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](initialFrame || 0);
    animatedSprite.applyProps = (instance, oldProps: AnimatedSpriteProps, newProps: AnimatedSpriteProps) =>
    {
        const { textures, isPlaying, initialFrame, ...props } = newProps;

        let changed = applyDefaultProps(instance, oldProps, props);

        if (textures && oldProps.textures !== textures)
        {
            instance.textures = validateTextures(textures) as AnimatedSpriteTexturesProp;
            changed = true;
        }

        if (isPlaying !== oldProps.isPlaying || initialFrame !== oldProps.initialFrame)
        {
            const frame = typeof initialFrame === 'number' ? initialFrame : animatedSprite.currentFrame || 0;

            animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](frame);
            changed = true;
        }

        return changed;
    };

    return animatedSprite;
};

export default AnimatedSprite;
