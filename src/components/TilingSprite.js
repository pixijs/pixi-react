import * as PIXI from 'pixi.js'
import { getTextureFromProps } from '../utils'
import { omit } from 'lodash-es'

const TilingSprite = (root, props) => {
  const { width, height } = props
  const texture = getTextureFromProps('TilingSprite', props)

  const ts = new PIXI.extras.TilingSprite(texture, width, height)

  // apply remaining prop members
  let members = omit(props, 'width', 'height', 'texture', 'image')
  Object.keys(members).forEach(m => {
    ts[m] = members[m]
  })

  return ts
}

export default TilingSprite
