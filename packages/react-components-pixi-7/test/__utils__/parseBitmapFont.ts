import { BitmapFont } from '@pixi/text-bitmap';
import { emptyTexture } from '../__fixtures__/textures';
import type { Resource, Texture } from '@pixi/core';

const parseBitmapFontData = (
    data: string,
    type: DOMParserSupportedType = 'text/xml',
    texture: Texture<Resource> = emptyTexture,
) =>
{
    const parsed = new window.DOMParser().parseFromString(data, type);

    // broken in jsdom!
    if (!(parsed instanceof XMLDocument))
    {
        Object.setPrototypeOf(parsed, XMLDocument.prototype);
    }

    BitmapFont.install(parsed, texture);
};

export default parseBitmapFontData;
