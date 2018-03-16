import invariant from 'fbjs/lib/invariant'
import { injectType } from './inject'

function CustomPIXIComponent(behavior, type) {
  invariant(
    typeof type === 'string',
    'Invalid argument `type` of type `%s` supplied to `CustomPIXIComponent`, expected `string`.',
    typeof type
  )

  return injectType(type, behavior)
}

export default CustomPIXIComponent
