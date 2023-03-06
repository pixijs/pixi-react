import { Text as PixiText } from '@pixi/text';
import { Sprite as PixiSprite } from '@pixi/sprite';
import type { PixiReactContainer, PixiReactSprite, PixiReactText, TextProps } from '../types';

const Text = (_root: PixiReactContainer, props: TextProps): PixiReactText | PixiReactSprite =>
{
    const { text = '', style = {}, isSprite } = props;
    const pixiText = new PixiText(text, style);

    if (isSprite)
    {
        // TODO: can we respectDirty?
        pixiText.updateText(false);

        return new PixiSprite(pixiText.texture);
    }

    return pixiText;
};

export default Text;
