import { BitmapFont, Cache, bitmapFontXMLParser } from 'pixi.js';
import { emptyTexture } from '../__fixtures__/textures';

const parseBitmapFontData = (data, type = 'text/xml', texture = emptyTexture) =>
{
    const parsed = new window.DOMParser().parseFromString(data, type);

    // broken in jsdom!
    if (!(parsed instanceof XMLDocument))
    {
        Object.setPrototypeOf(parsed, XMLDocument.prototype);
    }

    const bitmapFontData = bitmapFontXMLParser.parse(parsed);
    const { pages } = bitmapFontData;
    const textureUrls = [];

    for (let i = 0; i < pages.length; ++i)
    {
        textureUrls.push('/');
    }

    const textures = textureUrls.map(() => emptyTexture);

    const bitmap = new BitmapFont({
        data: bitmapFontData,
        textures,
    });

    Cache.set(`${bitmap.fontFamily}-bitmap`, bitmap);
};

export default parseBitmapFontData;
