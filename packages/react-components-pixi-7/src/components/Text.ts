import type { TextStyle } from '@pixi/text';
import { Text as PixiText } from '@pixi/text';
import { Sprite as PixiSprite } from '@pixi/sprite';
import type { ExpandoContainer, ExpandoSprite, ExpandoText, PropsType } from '../types';

export type TextProps = PropsType & {
    text?: string;
    style?: Partial<TextStyle>;
    isSprite?: boolean;
};

const Text = (_root: ExpandoContainer, props: TextProps): ExpandoText | ExpandoSprite =>
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
