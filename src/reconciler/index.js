import Reconciler from 'react-reconciler'
import emptyObject from 'fbjs/lib/emptyObject'
import { createElement } from '../utils/createElement'
import now from 'performance-now'

import pkg from '../../package.json'

/**
 * The React Reconciler handling PIXI elements
 *
 * @type {Object}
 */
const PixiFiber = Reconciler({
  appendInitialChild(parent, child) {
    if (parent.appendChild) {
      parent.appendChild(child)
    } else {
      parent.document = child
    }
  },

  createInstance(type, props, internalInstanceHandler) {
    return createElement(type, props, internalInstanceHandler)
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandler) {
    return text
  },

  finalizeInitialChildren(wordElement, type, props) {
    return false
  },

  getPublicInstance(ins) {
    return ins
  },

  prepareForCommit() {
    // noop
  },

  prepareUpdate(wordElement, type, oldProps, newProps) {
    return true
  },

  resetAfterCommit() {
    // noop
  },

  resetTextContent(wordElement) {
    // noop
  },

  getRootHostContext(rootInstance) {
    // You can use this 'rootInstance' to pass data from the roots.
  },

  getChildHostContext() {
    return emptyObject
  },

  shouldSetTextContent(type, props) {
    return false
  },

  now,

  useSyncScheduling: true,

  mutation: {
    appendChild(parent, child) {
      if (parent.appendChild) {
        parent.appendChild(child)
      } else {
        parent.document = child
      }
    },

    appendChildToContainer(parent, child) {
      if (parent.appendChild) {
        parent.appendChild(child)
      } else {
        parent.document = child
      }
    },

    removeChild(parent, child) {
      parent.removeChild(child)
    },

    removeChildFromContainer(parent, child) {
      parent.removeChild(child)
    },

    inserBefore(parent, child, beforeChild) {
      // noop
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      // noop
    },

    commitMount(instance, updatePayload, type, oldProps, newProps) {
      // noop
    },

    commitTextUpdate(textInstance, oldText, newText) {
      textInstance.children = newText
    },
  },
})

export default PixiFiber

export const VERSION = pkg.version

export const PACKAGE_NAME = pkg.name
