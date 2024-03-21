import { NineSliceSprite as PixiNineSliceSprite } from 'pixi.js';
import { getTextureFromProps, applyDefaultProps } from '../utils/props';

const NineSliceSprite = (root, props) =>
{
    const { leftWidth = 10, topHeight = 10, rightWidth = 10, bottomHeight = 10 } = props;
    const texture = getTextureFromProps('NineSliceSprite', root, props);

    const nineSliceSprite = new PixiNineSliceSprite({ texture, leftWidth, topHeight, rightWidth, bottomHeight });

    nineSliceSprite.applyProps = (instance, oldProps, newProps) =>
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
            instance.texture = getTextureFromProps('NineSliceSprite', root, newProps);
        }

        return changed;
    };

    return nineSliceSprite;
};

export default NineSliceSprite;
