/**
 * -------------------------------------------
 * Host Config file.
 *
 * See:
 *   https://github.com/facebook/react/tree/master/packages/react-reconciler
 *   https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js
 * -------------------------------------------
 */

import performanceNow from 'performance-now'
import invariant from '../utils/invariant'
import { createElement } from '../utils/element'
import { CHILDREN, applyDefaultProps } from '../utils/props'

const NO_CONTEXT = {}

function appendChild(parent, child) {
  if (parent.addChild) {
    parent.addChild(child)

    if (typeof child.didMount === 'function') {
      child.didMount.call(child, child, parent)
    }
  }
}

function removeChild(parent, child) {
  if (typeof child.willUnmount === 'function') {
    child.willUnmount.call(child, child, parent)
  }

  // unmount potential children
  if (child?.config?.destroyChildren !== false && child.children?.length) {
    ;[...child.children].forEach(c => {
      removeChild(child, c)
    })
  }

  parent.removeChild(child)

  if (child?.config?.destroy !== false) {
    child.destroy()
  }
}

function insertBefore(parent, child, beforeChild) {
  invariant(child !== beforeChild, 'react-pixi: PixiFiber cannot insert node before itself')

  const childExists = parent.children.indexOf(child) !== -1
  const index = parent.getChildIndex(beforeChild)

  childExists ? parent.setChildIndex(child, index) : parent.addChildAt(child, index)
}

// get diff between 2 objects
// https://github.com/facebook/react/blob/97e2911/packages/react-dom/src/client/ReactDOMFiberComponent.js#L546
function diffProperties(pixiElement, type, lastProps, nextProps, rootContainerElement) {
  let updatePayload = null

  for (let propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue
    }
    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For all other deleted properties we add it to the queue. We use
      // the whitelist in the commit phase instead.
      if (!updatePayload) {
        updatePayload = []
      }
      updatePayload.push(propKey, null)
    }
  }

  for (let propKey in nextProps) {
    const nextProp = nextProps[propKey]
    const lastProp = lastProps != null ? lastProps[propKey] : undefined

    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp == null && lastProp == null)) {
      continue
    }

    if (propKey === CHILDREN) {
      // Noop. Text children not supported
    } else {
      // For any other property we always add it to the queue and then we
      // filter it out using the whitelist during the commit.
      if (!updatePayload) {
        updatePayload = []
      }
      updatePayload.push(propKey, nextProp)
    }
  }
  return updatePayload
}

let prepareChanged = null

const HostConfig = {
  getRootHostContext() {
    return NO_CONTEXT
  },

  getChildHostContext() {
    return NO_CONTEXT
  },

  getChildHostContextForEventComponent(parentHostContext) {
    return parentHostContext
  },

  getPublicInstance(instance) {
    return instance
  },

  prepareForCommit() {
    // noop
    return null
  },

  resetAfterCommit() {
    // noop
  },

  createInstance: createElement,

  hideInstance(instance) {
    instance.visible = false
  },

  unhideInstance(instance, props) {
    const visible = props !== undefined && props !== null && props.hasOwnProperty('visible') ? props.visible : true
    instance.visible = visible
  },

  finalizeInitialChildren(wordElement, type, props) {
    return false
  },

  prepareUpdate(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
    prepareChanged = diffProperties(pixiElement, type, oldProps, newProps, rootContainerInstance)
    return prepareChanged
  },

  shouldSetTextContent(type, props) {
    return false
  },

  shouldDeprioritizeSubtree(type, props) {
    const isAlphaVisible = typeof props.alpha === 'undefined' || props.alpha > 0
    const isRenderable = typeof props.renderable === 'undefined' || props.renderable === true
    const isVisible = typeof props.visible === 'undefined' || props.visible === true

    return !(isAlphaVisible && isRenderable && isVisible)
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandler) {
    invariant(
      false,
      'react-pixi: Error trying to add text node "' + text + '"',
      'PixiFiber does not support text nodes as children of a Pixi component. ' +
        'To pass a string value to your component, use a property other than children. ' +
        'If you wish to display some text, you can use &lt;Text text={string} /&gt; instead.'
    )
  },

  unhideTextInstance(textInstance, text) {
    // noop
  },

  mountEventComponent() {
    // noop
  },

  updateEventComponent() {
    // noop
  },

  handleEventTarget() {
    // noop
  },

  scheduleTimeout: setTimeout,

  cancelTimeout: clearTimeout,

  noTimeout: -1,

  warnsIfNotActing: false,

  now: performanceNow,

  isPrimaryRenderer: false,

  supportsMutation: true,

  supportsPersistence: false,

  supportsHydration: false,

  /**
   * -------------------------------------------
   * Mutation
   * -------------------------------------------
   */

  appendInitialChild(...args) {
    const res = appendChild.apply(null, args)
    window.dispatchEvent(new CustomEvent(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'appendInitialChild' }))
    return res
  },

  appendChild(...args) {
    const res = appendChild.apply(null, args)
    window.dispatchEvent(new CustomEvent(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'appendChild' }))
    return res
  },

  appendChildToContainer(...args) {
    const res = appendChild.apply(null, args)
    window.dispatchEvent(new CustomEvent(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'appendChildToContainer' }))
    return res
  },

  removeChild(...args) {
    const res = removeChild.apply(null, args)
    window.dispatchEvent(new CustomEvent(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'removeChild' }))
    return res
  },

  removeChildFromContainer(...args) {
    const res = removeChild.apply(null, args)
    window.dispatchEvent(new CustomEvent(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'removeChildFromContainer' }))
    return res
  },

  insertBefore,

  insertInContainerBefore(...args) {
    const res = insertBefore.apply(null, args)
    window.dispatchEvent(new CustomEvent(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'insertInContainerBefore' }))
    return res
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    let applyProps = instance && instance.applyProps
    if (typeof applyProps !== 'function') {
      applyProps = applyDefaultProps
    }

    const changed = applyProps(instance, oldProps, newProps)
    if (changed || prepareChanged) {
      window.dispatchEvent(new CustomEvent(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'commitUpdate' }))
    }
  },

  commitMount(instance, updatePayload, type, oldProps, newProps) {
    // noop
  },

  commitTextUpdate(textInstance, oldText, newText) {
    // noop
  },

  resetTextContent(pixiElement) {
    // noop
  },

  clearContainer(container) {
    // TODO implement this
  },

  getFundamentalComponentInstance(fundamentalInstance) {
    throw new Error('Not yet implemented.')
  },

  mountFundamentalComponent(fundamentalInstance) {
    throw new Error('Not yet implemented.')
  },

  shouldUpdateFundamentalComponent(fundamentalInstance) {
    throw new Error('Not yet implemented.')
  },

  unmountFundamentalComponent(fundamentalInstance) {
    throw new Error('Not yet implemented.')
  },

  getInstanceFromNode(node) {
    throw new Error('Not yet implemented.')
  },

  isOpaqueHydratingObject(value) {
    throw new Error('Not yet implemented')
  },

  makeOpaqueHydratingObject(attemptToReadValue) {
    throw new Error('Not yet implemented.')
  },

  makeClientIdInDEV(warnOnAccessInDEV) {
    throw new Error('Not yet implemented')
  },

  beforeActiveInstanceBlur(internalInstanceHandle) {
    // noop
  },

  afterActiveInstanceBlur() {
    // noop
  },

  preparePortalMount(portalInstance) {
    // noop
  },
}

export default HostConfig
