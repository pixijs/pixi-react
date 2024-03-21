import { Sprite as PixiSprite, Text as PixiText } from 'pixi.js';

const Text = (root, props) =>
{
    const { text = '', style = {}, isSprite } = props;
    const pixiText = new PixiText({ text, style });

    if (isSprite)
    {
        const app = root.__reactpixi.app;
        const texture = app.renderer.canvasText.getTexture(
            text,
            app.renderer.resolution,
            pixiText.style,
            pixiText._getKey()
        );

        return new PixiSprite(texture);
    }

    return pixiText;
};

export default Text;
