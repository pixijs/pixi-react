import * as PIXI from 'pixi.js'
import invariant from 'fbjs/lib/invariant'

const getTextureFromProps = (elementType, { texture, image }) => {
  if (image) {
    invariant(typeof image === 'string', elementType + ' image needs to be a string, got `%s`', typeof image)
    return PIXI.Texture.fromImage(image)
  }

  invariant(texture instanceof PIXI.Texture, elementType + ' texture needs to be type of `PIXI.Texture`')
  return texture
}

export default getTextureFromProps
