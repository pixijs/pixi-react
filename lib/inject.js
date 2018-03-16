import invariant from 'fbjs/lib/invariant'

export const INJECTED_TYPES = {}

export function injectType(type, behavior) {
  INJECTED_TYPES[type] = behavior
  return type
}

export function createInjectedTypeInstance(type, props, internalInstanceHandle, applyDisplayObjectProps) {
  let instance

  if (type in INJECTED_TYPES) {
    const injectedType = INJECTED_TYPES[type]
    let customDisplayObject
    if (typeof injectedType === 'function') {
      customDisplayObject = injectedType
    } else if (typeof injectedType.customDisplayObject === 'function') {
      customDisplayObject = injectedType.customDisplayObject
    }

    invariant(customDisplayObject, 'Invalid Component injected to ReactPixiFiber: `%s`.', type)

    instance = customDisplayObject(props)

    if (typeof injectedType.customApplyProps === 'function') {
      instance._customApplyProps = injectedType.customApplyProps.bind({
        // See: https://github.com/Izzimach/react-pixi/blob/a25196251a13ed9bb116a8576d93e9fceac2a14c/src/ReactPIXI.js#L953
        applyDisplayObjectProps: applyDisplayObjectProps.bind(null, instance),
      })
    }
    if (typeof injectedType.customDidAttach === 'function') {
      instance._customDidAttach = injectedType.customDidAttach
    }
    if (typeof injectedType.customWillDetach === 'function') {
      instance._customWillDetach = injectedType.customWillDetach
    }
  }

  return instance
}
