import { Text as PixiText } from '@pixi/text';
import { Sprite as PixiSprite } from '@pixi/sprite';

const Text = (root, props) =>
{
    const { text = '', style = {}, isSprite } = props;
    const pixiText = new PixiText(text, style);

    if (isSprite)
    {
        pixiText.updateText();

        return new PixiSprite(pixiText.texture);
    }

    return pixiText;
};

export default Text;
