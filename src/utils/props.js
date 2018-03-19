import * as PIXI from 'pixi.js'
import invariant from 'fbjs/lib/invariant'

/**
 * Reserved props
 *
 * @type {Object}
 */
export const PROPS_RESERVED = {
  children: true,
  parent: true,
  worldAlpha: true,
  worldTransform: true,
  worldVisible: true,
}

/**
 * Default display object props
 *
 * @type {Object}
 */
export const PROPS_DISPLAY_OBJECT = {
  alpha: 1,
  buttonMode: false,
  cacheAsBitmap: false,
  cursor: 'auto',
  filterArea: null,
  filters: null,
  hitArea: null,
  interactive: false,
  mask: null,
  pivot: 0,
  position: 0,
  renderable: true,
  rotation: 0,
  scale: 1,
  skew: 0,
  transform: null,
  visible: true,
  x: 0,
  y: 0,
}

/**
 * Helper util for fetching the texture from props
 * Can be either texture or image
 *
 * @param {string} elementType
 * @param {PIXI.Texture} texture
 * @param {string|undefined} image
 * @returns {PIXI.Texture}
 */
export const getTextureFromProps = (elementType, { texture = undefined, image = undefined }) => {
  if (image) {
    invariant(typeof image === 'string', elementType + ' image needs to be a string, got `%s`', typeof image)
    return PIXI.Texture.fromImage(image)
  }

  invariant(texture instanceof PIXI.Texture, elementType + ' texture needs to be type of `PIXI.Texture`')
  return texture
}
