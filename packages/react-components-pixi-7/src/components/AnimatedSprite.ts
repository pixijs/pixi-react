import type { Resource } from '@pixi/core';
import { Texture } from '@pixi/core';
import type { FrameObject } from '@pixi/sprite-animated';
import { AnimatedSprite as PixiAnimatedSprite } from '@pixi/sprite-animated';
import { invariant } from '@pixi/react-invariant';
import { applyDefaultProps } from '../utils/props';
import type { ExpandoAnimatedSprite, ExpandoContainer, PropsType } from '../types';
import { isArrayWithLength } from '../utils/fp';

type TexturesProp = Texture<Resource>[] | FrameObject[];

const isTexture = (maybeTexture: any): maybeTexture is Texture => maybeTexture instanceof Texture;
const isFrameObject = (maybeFrameObject: any): maybeFrameObject is FrameObject => Boolean(maybeFrameObject?.texture);

// TODO: should we whitelist all props? eg. DisplayObjectProps & ContainerProps & SpriteProps & AnimatedSpriteProps
export type AnimatedSpriteProps = PropsType & {
    textures?: TexturesProp;
    images?: string[];
    isPlaying?: boolean;
    initialFrame?: number;
};

const validateTextures = (textures: TexturesProp) =>
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

const AnimatedSprite = (_root: ExpandoContainer, props: AnimatedSpriteProps) =>
{
    const { textures, images, isPlaying = true, initialFrame } = props;

    invariant(
        isArrayWithLength(textures) || isArrayWithLength(images),
        `AnimationSprite requires either a textures or images prop`,
    );

    const animatedSprite: ExpandoAnimatedSprite = images
        ? PixiAnimatedSprite.fromImages(images)
        : new PixiAnimatedSprite(validateTextures(textures as TexturesProp) as TexturesProp);

    animatedSprite[isPlaying ? 'gotoAndPlay' : 'gotoAndStop'](initialFrame || 0);
    animatedSprite.applyProps = (instance, oldProps: AnimatedSpriteProps, newProps: AnimatedSpriteProps) =>
    {
        const { textures, isPlaying, initialFrame, ...props } = newProps;

        let changed = applyDefaultProps(instance, oldProps, props);

        if (textures && oldProps.textures !== textures)
        {
            instance.textures = validateTextures(textures) as TexturesProp;
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
