import type { IBitmapTextStyle } from '@pixi/text-bitmap';
import { BitmapText as PixiBitmapText } from '@pixi/text-bitmap';
import type { ExpandoBitmapText, ExpandoContainer, PropsType } from '../types';

export type BitmapTextProps = PropsType & {
    text: string;
    style: Partial<IBitmapTextStyle>;
};

const BitmapText = (_root: ExpandoContainer, props: BitmapTextProps): ExpandoBitmapText =>
{
    const { text, style } = props;

    return new PixiBitmapText(text, style);
};

export default BitmapText;
