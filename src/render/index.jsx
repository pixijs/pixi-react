import invariant from '../utils/invariant'
import { PixiFiber } from '../reconciler'
import { ConcurrentRoot } from 'react-reconciler/constants'
import { Container } from 'pixi.js'

// cache root containers
/** @type {Map<Container, any>} */
export const roots = new Map()

/**
 * @param {PIXI.Container} container
 * @returns {void}
 */
function unmountComponent(container) {
  invariant(
    Container.prototype.isPrototypeOf(container),
    'Invalid argument `container`, expected instance of `PIXI.Container`.'
  )

  if (roots.has(container)) {
    // unmount component
    PixiFiber.updateContainer(null, roots.get(container), undefined, () => {
      roots.delete(container)
    })
  }
}

/**
 * @deprecated use root.unmount() instead
 * @param {Container} container
 * @returns {void}
 */
export function unmountComponentAtNode(container) {
  unmountComponent(container)
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
      unmountComponent(container)
      roots.delete(container)
    },
  }
}

/**
 * Custom Renderer
 * Use this without React-DOM
 *
 * @deprecated use createRoot instead
 *
 * @param {React.ReactNode} element
 * @param {Container} container (i.e. the Stage)
 * @param {Function} callback
 */
export function render(element, container, callback) {
  console.warn('pixi-react: render is deprecated, use createRoot instead')
  if (callback != null) {
    console.warn('pixi-react: render callback no longer exists in react 18 API')
  }

  let root = roots.get(container)

  if (!root) {
    root = createRoot(container)
  }

  return root.render(element, undefined)
}
