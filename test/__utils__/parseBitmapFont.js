import * as PIXI from 'pixi.js'
import { emptyTexture } from '../__fixtures__/textures'

const parseBitmapFontData = (data, type = 'text/xml', texture = emptyTexture) => {
  return PIXI.loaders.parseBitmapFontData({ data: new window.DOMParser().parseFromString(data, type) }, texture)
}

export default parseBitmapFontData
