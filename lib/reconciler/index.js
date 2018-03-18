import "core-js/modules/es6.function.name";
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import { createElement } from '../utils/createElement';
import now from 'performance-now';
import pkg from '../../package.json';
var PixiFiber = Reconciler({
  appendInitialChild: function appendInitialChild(parent, child) {
    if (parent.appendChild) {
      parent.appendChild(child);
    } else {
      parent.document = child;
    }
  },
  createInstance: function createInstance(type, props, internalInstanceHandler) {
    return createElement(type, props, internalInstanceHandler);
  },
  createTextInstance: function createTextInstance(text, rootContainerInstance, internalInstanceHandler) {
    return text;
  },
  finalizeInitialChildren: function finalizeInitialChildren(wordElement, type, props) {
    return false;
  },
  getPublicInstance: function getPublicInstance(ins) {
    return ins;
  },
  prepareForCommit: function prepareForCommit() {// noop
  },
  prepareUpdate: function prepareUpdate(wordElement, type, oldProps, newProps) {
    return true;
  },
  resetAfterCommit: function resetAfterCommit() {// noop
  },
  resetTextContent: function resetTextContent(wordElement) {// noop
  },
  getRootHostContext: function getRootHostContext(rootInstance) {// You can use this 'rootInstance' to pass data from the roots.
  },
  getChildHostContext: function getChildHostContext() {
    return emptyObject;
  },
  shouldSetTextContent: function shouldSetTextContent(type, props) {
    return false;
  },
  now: now,
  useSyncScheduling: true,
  mutation: {
    appendChild: function appendChild(parent, child) {
      if (parent.appendChild) {
        parent.appendChild(child);
      } else {
        parent.document = child;
      }
    },
    appendChildToContainer: function appendChildToContainer(parent, child) {
      if (parent.appendChild) {
        parent.appendChild(child);
      } else {
        parent.document = child;
      }
    },
    removeChild: function removeChild(parent, child) {
      parent.removeChild(child);
    },
    removeChildFromContainer: function removeChildFromContainer(parent, child) {
      parent.removeChild(child);
    },
    inserBefore: function inserBefore(parent, child, beforeChild) {// noop
    },
    commitUpdate: function commitUpdate(instance, updatePayload, type, oldProps, newProps) {// noop
    },
    commitMount: function commitMount(instance, updatePayload, type, oldProps, newProps) {// noop
    },
    commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
      textInstance.children = newText;
    }
  }
});
export default PixiFiber;
export var VERSION = pkg.version;
export var PACKAGE_NAME = pkg.name;