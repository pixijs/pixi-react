import * as PIXI from 'pixi.js'
import invariant from 'fbjs/lib/invariant'

/**
 * Helper util for fetching the texture from props
 * Can be either texture or image
 *
 * @param {string} elementType
 * @param {PIXI.Texture} texture
 * @param {string|undefined} image
 * @returns {PIXI.Texture}
 */
const getTextureFromProps = (elementType, { texture = undefined, image = undefined }) => {
  if (image) {
    invariant(typeof image === 'string', elementType + ' image needs to be a string, got `%s`', typeof image)
    return PIXI.Texture.fromImage(image)
  }

  invariant(texture instanceof PIXI.Texture, elementType + ' texture needs to be type of `PIXI.Texture`')
  return texture
}

export default getTextureFromProps
