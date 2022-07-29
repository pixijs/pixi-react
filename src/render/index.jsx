import invariant from '../utils/invariant'
import { PixiFiber } from '../reconciler'
import { ConcurrentRoot } from 'react-reconciler/constants'
import { Container } from 'pixi.js'

// cache root containers
/** @type {Map<Container, any>} */
export const roots = new Map()

export function unmountComponentAtNode(container) {
  if (roots.has(container)) {
    // unmount component
    PixiFiber.updateContainer(null, roots.get(container), undefined, () => {
      roots.delete(container)
    })
  }
}

/**
 * Custom Renderer with react 18 API
 * Use this without React-DOM
 *
 * @param {HTMLCanvasElement} canvas element
 * @returns {*}
 */
export function createRoot(container) {
  invariant(
    Container.prototype.isPrototypeOf(container),
    'Invalid argument `container`, expected instance of `PIXI.Container`.'
  )

  let root = roots.get(container)
  invariant(!root, 'pixi-react: createRoot should only be called once')

  if (!root) {
    root = PixiFiber.createContainer(container, ConcurrentRoot, null, false)
    roots.set(container, root)
    container.__reactpixi = { root: container }
  }

  return {
    render(element) {
      // schedules a top level update
      PixiFiber.updateContainer(element, root, undefined)

      return PixiFiber.getPublicRootInstance(root)
    },
    unmount() {
      unmountComponentAtNode(container)
      roots.delete(container)
    },
  }
}

/**
 * Custom Renderer
 * Use this without React-DOM
 *
 * @param {*} element
 * @param {PIXI.Container} container (i.e. the Stage)
 * @param {Function} callback
 * @param {*} options
 * @deprecated
 */
export function render(element, container, callback) {
  console.warn('pixi-react: render is deprecated, use createRoot instead')
  if (callback == null) {
    console.warn('pixi-react: render callback no longer exists in react 18 API')
  }

  let root = roots.get(container)

  if (!root) {
    root = createRoot(container)
  }

  return root.render(element, undefined)
}
