import Reconciler from 'react-reconciler'
import emptyObject from 'fbjs/lib/emptyObject'
import invariant from 'fbjs/lib/invariant'
import { createElement } from '../utils/createElement'
import now from 'performance-now'

import pkg from '../../package.json'

const UPDATE_SIGNAL = {}

const appendChild = (parent, child) => {
  if (parent.addChild) {
    parent.addChild(child)

    if (typeof child.didMount === 'function') {
      child.didMount.call(child, parent)
    }
  }
}

const removeChild = (parent, child) => {
  if (typeof child.willUnmount === 'function') {
    child.willUnmount(parent)
  }

  parent.removeChild(child)
  child.destroy()
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

  prepareUpdate(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
    return UPDATE_SIGNAL
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

    inserBefore(parent, child, beforeChild) {
      invariant(child !== beforeChild, 'ReactPixiFiber cannot insert node before itself')

      const childExists = parent.children.indexOf(child) !== -1
      const index = parent.getChildIndex(beforeChild)

      childExists ? parent.setChildIndex(child, index) : parent.addChildAt(child, index)
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      // todo implement updates
    },

    commitMount(instance, updatePayload, type, oldProps, newProps) {
      // noop
    },

    commitTextUpdate(textInstance, oldText, newText) {
      textInstance.children = newText
    },
  },
})

export const VERSION = pkg.version

export const PACKAGE_NAME = pkg.name
