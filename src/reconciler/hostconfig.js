/**
 * -------------------------------------------
 * Host Config file.
 *
 * See:
 *   https://github.com/facebook/react/tree/master/packages/react-reconciler
 *   https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js
 * -------------------------------------------
 */

import invariant from 'fbjs/lib/invariant'
import cssManager from '../cssManager/cssManager'
import performanceNow from 'performance-now'
import { createElement } from '../utils/element'
import { CHILDREN, applyDefaultProps } from '../utils/props'

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

  parent.removeChild(child)
  child.destroy()
}

function insertBefore(parent, child, beforeChild) {
  invariant(child !== beforeChild, 'PixiFiber cannot insert node before itself')

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

export default {
  getRootHostContext(rootContainerInstance) {
    return rootContainerInstance
  },

  getChildHostContext() {
    return {}
  },

  getChildHostContextForEventComponent(parentHostContext) {
    return parentHostContext
  },

  getPublicInstance(instance) {
    return instance
  },

  prepareForCommit() {
    // noop
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

  appendInitialChild: appendChild,

  finalizeInitialChildren(wordElement, type, props) {
    return false
  },

  prepareUpdate(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
    return diffProperties(pixiElement, type, oldProps, newProps, rootContainerInstance)
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
    invariant(false, 'PixiFiber does not support text instances. Use `<Text /> component` instead.')
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

  appendChild,

  appendChildToContainer: appendChild,

  removeChild,

  removeChildFromContainer: removeChild,

  insertBefore,

  insertInContainerBefore: insertBefore,

  commitUpdate(instance, updatePayload, type, oldProps, { className, ...newProps }) {
    let applyProps = instance && instance.applyProps
    let cssProps
    let cssMan = instance.cssManager
    if (className && !cssMan) {
      cssMan = cssManager(instance, type, applyDefaultProps)
      instance.cssManager = cssMan
    }
    if (typeof applyProps !== 'function') {
      applyProps = applyDefaultProps
    }
    if (cssMan) {
      cssMan.setProps(newProps)
      cssProps = cssMan.setCSSProps(className, true, newProps)
    }
    applyProps(instance, oldProps, cssMan ? cssProps : newProps)
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
}
