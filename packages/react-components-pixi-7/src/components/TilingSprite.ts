import type { Texture } from '@pixi/core';
import { TilingSprite as PixiTilingSprite } from '@pixi/sprite-tiling';
import { getTextureFromProps, applyDefaultProps } from '../utils/props';
import { parsePoint, pointsAreEqual } from '../utils/pixi';
import type { ExpandoContainer, ExpandoTilingSprite, PointLike, PropsType } from '../types';

export type TilingSpriteProps = PropsType & {
    image?: string | HTMLImageElement;
    texture?: Texture;
    width?: number;
    height?: number;
    tilePosition?: PointLike;
    tileScale?: PointLike;
};

const TilingSprite = (root: ExpandoContainer, props: TilingSpriteProps) =>
{
    const { width = 100, height = 100 } = props;
    const texture = getTextureFromProps('TilingSprite', root, props);

    const ts: ExpandoTilingSprite = new PixiTilingSprite(texture, width, height);

    ts.applyProps = (instance, oldProps, newProps) =>
    {
        const { tileScale, tilePosition, image, texture, ...props } = newProps;
        let changed = applyDefaultProps(instance, oldProps, props);

        if (tilePosition)
        {
            const newTilePosition = parsePoint(tilePosition);

            instance.tilePosition.set(...newTilePosition);
            changed = !pointsAreEqual(parsePoint(oldProps.tilePosition), newTilePosition) || changed;
        }

        if (tileScale)
        {
            const newTileScale = parsePoint(tileScale);

            instance.tileScale.set(...newTileScale);
            changed = !pointsAreEqual(parsePoint(oldProps.tileScale), newTileScale) || changed;
        }

        if (image || texture)
        {
            // change = true not required for image, getTextureFromProps will call update
            if (texture !== oldProps.texture)
            {
                changed = true;
            }

            instance.texture = getTextureFromProps('Sprite', root, newProps);
        }

        return changed;
    };

    return ts;
};

export default TilingSprite;
