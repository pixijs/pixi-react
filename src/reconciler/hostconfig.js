import idx from 'idx/lib/idx'
import invariant from 'fbjs/lib/invariant'
import performanceNow from 'performance-now'
import emptyObject from 'fbjs/lib/emptyObject'
import { createElement } from '../utils/element'
import { applyDefaultProps } from '../utils/props'

function appendChild(parent, child) {
  if (parent.addChild) {
    parent.addChild(child)

    if (typeof child.didMount === 'function') {
      child.didMount.call(child, parent)
    }
  }
}

function removeChild(parent, child) {
  if (typeof child.willUnmount === 'function') {
    child.willUnmount(parent)
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

export default {
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
    return {} // signal
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

  resetTextContent(pixiElement) {
    // noop
  },

  now: performanceNow,

  useSyncScheduling: true,

  mutation: {
    appendChild,

    removeChild,

    insertBefore,

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      let applyProps = idx(instance, _ => _.applyProps)
      if (typeof applyProps !== 'function') {
        applyProps = (a, b) => applyDefaultProps(instance, a, b)
      }
      applyProps(oldProps, newProps)
    },

    commitMount(instance, updatePayload, type, oldProps, newProps) {
      // noop
    },

    commitTextUpdate(textInstance, oldText, newText) {
      // noop
    },

    appendChildToContainer: appendChild,

    removeChildFromContainer: removeChild,

    insertInContainerBefore: insertBefore,
  },
}
