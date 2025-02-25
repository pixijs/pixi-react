import { type Texture } from 'pixi.js';
import { type PixiElements } from '@pixi/react';

export type TilingSpriteProps = PixiElements['pixiTilingSprite'] & {
    image?: string;
    texture?: Texture;
};
