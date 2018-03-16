import ReactFiberReconciler from 'react-reconciler'
import emptyObject from 'fbjs/lib/emptyObject'
import invariant from 'fbjs/lib/invariant'
import now from 'performance-now'
import * as PIXI from 'pixi.js'
import { createInjectedTypeInstance } from './inject'
import { DEFAULT_PROPS } from './props'
import { TYPES } from './types'
import { includingReservedProps, not, setPixiValue } from './utils'

/* Render Methods */

export const UPDATE_SIGNAL = {}

// TODO consider whitelisting props based on component type
export function defaultApplyProps(instance, oldProps, newProps) {
  Object.keys(newProps)
    .filter(not(includingReservedProps))
    .forEach(propName => {
      const value = newProps[propName]

      // Set value if defined
      if (typeof value !== 'undefined') {
        setPixiValue(instance, propName, value)
      } else if (typeof instance[propName] !== 'undefined' && typeof DEFAULT_PROPS[propName] !== 'undefined') {
        // Reset to default value (if it is defined) when display object had prop set and no longer has
        console.warn(`setting default value: ${propName} was ${instance[propName]} is ${value} for`, instance)
        setPixiValue(instance, propName, DEFAULT_PROPS[propName])
      } else {
        console.warn(`ignoring prop: ${propName} was ${instance[propName]} is ${value} for`, instance)
      }
    })
}

export function applyProps(instance, oldProps, newProps) {
  if (typeof instance._customApplyProps === 'function') {
    instance._customApplyProps(instance, oldProps, newProps)
  } else {
    module.exports.defaultApplyProps(instance, oldProps, newProps)
  }
}

/* PixiJS Renderer */

export function appendChild(parentInstance, child) {
  // TODO do we need to remove the child first if it's already added?
  parentInstance.removeChild(child)

  parentInstance.addChild(child)
  if (typeof child._customDidAttach === 'function') {
    child._customDidAttach(child)
  }
}

export function removeChild(parentInstance, child) {
  if (typeof child._customWillDetach === 'function') {
    child._customWillDetach(child)
  }

  parentInstance.removeChild(child)

  child.destroy()
}

export function insertBefore(parentInstance, child, beforeChild) {
  invariant(child !== beforeChild, 'ReactPixiFiber cannot insert node before itself')

  const childExists = parentInstance.children.indexOf(child) !== -1
  const index = parentInstance.getChildIndex(beforeChild)

  if (childExists) {
    parentInstance.setChildIndex(child, index)
  } else {
    parentInstance.addChildAt(child, index)
  }
}

export function commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
  module.exports.applyProps(instance, oldProps, newProps)
}

export function createInstance(type, props, internalInstanceHandle) {
  let instance

  switch (type) {
    case TYPES.BITMAP_TEXT:
      instance = new PIXI.extras.BitmapText(props.text, props.style)
      break
    case TYPES.CONTAINER:
      instance = new PIXI.Container()
      break
    case TYPES.GRAPHICS:
      instance = new PIXI.Graphics()
      break
    case TYPES.PARTICLE_CONTAINER:
      instance = new PIXI.particles.ParticleContainer(
        props.maxSize,
        props.properties,
        props.batchSize,
        props.autoResize
      )
      break
    case TYPES.SPRITE:
      instance = new PIXI.Sprite(props.texture)
      break
    case TYPES.TEXT:
      instance = new PIXI.Text(props.text, props.style, props.canvas)
      break
    case TYPES.TILING_SPRITE:
      instance = new PIXI.extras.TilingSprite(props.texture, props.width, props.height)
      break
    default:
      instance = createInjectedTypeInstance(type, props, internalInstanceHandle, defaultApplyProps)
      break
  }

  invariant(instance, 'ReactPixiFiber does not support the type: `%s`.', type)

  applyProps(instance, {}, props)

  return instance
}

export function createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
  invariant(false, 'ReactPixiFiber does not support text instances. Use Text component instead.')
}

export function finalizeInitialChildren(pixiElement, type, props, rootContainerInstance) {
  return false
}

export function getChildHostContext(parentHostContext, type) {
  return emptyObject
}

export function getRootHostContext(rootContainerInstance) {
  return emptyObject
}

export function getPublicInstance(inst) {
  return inst
}

export function prepareForCommit() {
  // Noop
}

export function prepareUpdate(pixiElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
  return UPDATE_SIGNAL
}

export function resetAfterCommit() {
  // Noop
}

export function resetTextContent(pixiElement) {
  // Noop
}

export function shouldDeprioritizeSubtree(type, props) {
  const isAlphaVisible = typeof props.alpha === 'undefined' || props.alpha > 0
  const isRenderable = typeof props.renderable === 'undefined' || props.renderable === true
  const isVisible = typeof props.visible === 'undefined' || props.visible === true

  return !(isAlphaVisible && isRenderable && isVisible)
}

export function shouldSetTextContent(type, props) {
  return false
}

export function commitTextUpdate(textInstance, oldText, newText) {
  // Noop
}

export function commitMount(instance, type, newProps) {
  // Noop
}

const ReactPixiFiber = ReactFiberReconciler({
  appendInitialChild: appendChild,
  createInstance: createInstance,
  createTextInstance: createTextInstance,
  finalizeInitialChildren: finalizeInitialChildren,
  getChildHostContext: getChildHostContext,
  getRootHostContext: getRootHostContext,
  getPublicInstance: getPublicInstance,
  now: now,
  prepareForCommit: prepareForCommit,
  prepareUpdate: prepareUpdate,
  resetAfterCommit: resetAfterCommit,
  resetTextContent: resetTextContent,
  shouldDeprioritizeSubtree: shouldDeprioritizeSubtree,
  shouldSetTextContent: shouldSetTextContent,
  useSyncScheduling: true,
  mutation: {
    appendChild: appendChild,
    appendChildToContainer: appendChild,
    commitMount: commitMount,
    commitTextUpdate: commitTextUpdate,
    commitUpdate: commitUpdate,
    insertBefore: insertBefore,
    insertInContainerBefore: insertBefore,
    removeChild: removeChild,
    removeChildFromContainer: removeChild,
  },
})

export default ReactPixiFiber
