import { BitmapText as PixiBitmapText } from '@pixi/text-bitmap';
import type { BitmapTextProps, PixiReactBitmapText, PixiReactContainer } from '../types';

const BitmapText = (_root: PixiReactContainer, props: BitmapTextProps): PixiReactBitmapText =>
{
    const { text, style } = props;

    return new PixiBitmapText(text, style);
};

export default BitmapText;
