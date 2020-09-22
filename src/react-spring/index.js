import { createHost } from '@react-spring/animated'
import { TYPES } from '../utils/element'

const primitives = Object.keys(TYPES)

const host = createHost(primitives, {
  applyAnimatedValues(instance, props) {
    if (!(instance.nodeType || instance.pluginName)) {
      return false
    }
    instance.applyProps(instance, {}, props)
  },
})
const animated = host.animated

export { animated }
