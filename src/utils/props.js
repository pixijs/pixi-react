import invariant from 'fbjs/lib/invariant'
import { Texture } from 'pixi.js'

export const CHILDREN = 'children'
/**
 * Reserved props
 *
 * @type {Object}
 */
export const PROPS_RESERVED = {
  [CHILDREN]: true,
  parent: true,
  worldAlpha: true,
  worldTransform: true,
  worldVisible: true,
}

/**
 * Default display object props
 * See https://github.com/michalochman/react-pixi-fiber/blob/a4dbddbef0ffbf0f563c64d30766ea28222a51ea/src/props.js#L9
 *
 * @type {Object}
 */
export const PROPS_DISPLAY_OBJECT = {
  alpha: 1,
  buttonMode: false,
  cacheAsBitmap: false,
  cursor: null,
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
 * @param {object} props
 * @returns {PIXI.Texture|null}
 */
export const getTextureFromProps = (elementType, props = {}) => {
  const check = (inType, validator) => {
    if (props.hasOwnProperty(inType)) {
      const valid =
        validator.typeofs.some(t => typeof props[inType] === t) ||
        validator.instanceofs.some(i => props[inType] instanceof i)
      invariant(valid, `${elementType} ${inType} prop is invalid`)
      return props[inType]
    }
  }

  if (props.texture) {
    invariant(props.texture instanceof Texture, `${elementType} texture needs to be typeof \`PIXI.Texture\``)
    return props.texture
  } else {
    const result =
      check('image', { typeofs: ['string'], instanceofs: [HTMLImageElement] }) ||
      check('video', { typeofs: ['string'], instanceofs: [HTMLVideoElement] }) ||
      check('source', {
        typeofs: ['string', 'number'],
        instanceofs: [HTMLImageElement, HTMLVideoElement, HTMLCanvasElement, Texture],
      })

    invariant(!!result, `${elementType} could not get texture from props`)
    return Texture.from(result)
  }
}
