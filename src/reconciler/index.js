import Reconciler from 'react-reconciler'
import emptyObject from 'fbjs/lib/emptyObject'
import invariant from 'fbjs/lib/invariant'
import now from 'performance-now'
import idx from 'idx'
import { createElement } from '../utils/element'
import { applyDefaultProps } from '../utils/props'

import pkg from '../../package.json'

export const appendChild = (parent, child) => {
  console.log('appendChild')
  if (parent.addChild) {
    parent.addChild(child)

    if (typeof child.didMount === 'function') {
      child.didMount.call(child, parent)
    }
  }
}

export const removeChild = (parent, child) => {
  console.log(`removeChild`)
  if (typeof child.willUnmount === 'function') {
    child.willUnmount(parent)
  }

  parent.removeChild(child)
  child.destroy()
}

export const insertBefore = (parent, child, beforeChild) => {
  console.log(`inserBefore`)
  invariant(child !== beforeChild, 'ReactPixiFiber cannot insert node before itself')

  const childExists = parent.children.indexOf(child) !== -1
  const index = parent.getChildIndex(beforeChild)

  childExists ? parent.setChildIndex(child, index) : parent.addChildAt(child, index)
}

export const shouldDeprioritizeSubtree = (type, props) => {
  console.log(`shouldDeprioritizeSubtree`)
  const isAlphaVisible = typeof props.alpha === 'undefined' || props.alpha > 0
  const isRenderable = typeof props.renderable === 'undefined' || props.renderable === true
  const isVisible = typeof props.visible === 'undefined' || props.visible === true

  return !(isAlphaVisible && isRenderable && isVisible)
}

export const prepareUpdate = (pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) => {
  console.log(`prepareUpdate`)
  return {} // signal
}

export const commitUpdate = (instance, updatePayload, type, oldProps, newProps) => {
  console.log(`commitUpdate`)
  let applyProps = idx(instance, _ => _.applyProps)
  if (typeof applyProps !== 'function') {
    applyProps = (a, b) => applyDefaultProps(instance, a, b)
  }
  applyProps(oldProps, newProps)
}

/**
 * The React Reconciler handling PIXI elements
 *
 * @type {Object}
 */
export const PixiFiber = Reconciler({
  getRootHostContext(rootContainerInstance) {
    return emptyObject
  },

  getChildHostContext() {
    return emptyObject
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

  appendInitialChild: appendChild,

  finalizeInitialChildren(wordElement, type, props) {
    return false
  },

  prepareUpdate: prepareUpdate,

  shouldSetTextContent(type, props) {
    return false
  },

  shouldDeprioritizeSubtree: shouldDeprioritizeSubtree,

  createTextInstance(text, rootContainerInstance, internalInstanceHandler) {
    invariant(false, 'ReactPixiFiber does not support text instances. Use `<Text /> component` instead.')
  },

  resetTextContent(pixiElement) {
    // noop
  },

  now,

  useSyncScheduling: true,

  mutation: {
    appendChild: appendChild,

    appendChildToContainer: appendChild,

    removeChild: removeChild,

    removeChildFromContainer: removeChild,

    insertBefore: insertBefore,

    insertInContainerBefore: insertBefore,

    commitUpdate: commitUpdate,

    commitMount(instance, updatePayload, type, oldProps, newProps) {
      // noop
    },

    commitTextUpdate(textInstance, oldText, newText) {
      // noop
    },
  },
})

export const VERSION = pkg.version

export const PACKAGE_NAME = pkg.name
