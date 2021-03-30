import React from 'react'
import { Application, Ticker } from 'pixi.js'
import PropTypes from 'prop-types'
import invariant from '../utils/invariant'
import { PROPS_DISPLAY_OBJECT } from '../utils/props'
import { PixiFiber } from '../reconciler'
import { AppProvider } from './provider'

const noop = () => {}

/**
 * -------------------------------------------
 * Stage React Component (use this in react-dom)
 *
 * @usage
 *
 * const App = () => (
 *   <Stage
 *     width={500}
 *     height={500}
 *     options={ backgroundColor: 0xff0000 }
 *     onMount={( renderer, canvas ) => {
 *       console.log('PIXI renderer: ', renderer)
 *       console.log('Canvas element: ', canvas)
 *     }}>
 * );
 *
 * -------------------------------------------
 */

const propTypes = {
  // dimensions
  width: PropTypes.number,
  height: PropTypes.number,

  // will return renderer
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,

  // run ticker at start?
  raf: PropTypes.bool,

  // render component on component lifecycle changes?
  renderOnComponentChange: PropTypes.bool,

  children: PropTypes.node,

  // PIXI options, see https://pixijs.download/dev/docs/PIXI.Application.html
  options: PropTypes.shape({
    autoStart: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    useContextAlpha: PropTypes.bool,
    backgroundAlpha: PropTypes.number,
    autoDensity: PropTypes.bool,
    antialias: PropTypes.bool,
    preserveDrawingBuffer: PropTypes.bool,
    resolution: PropTypes.number,
    forceCanvas: PropTypes.bool,
    backgroundColor: PropTypes.number,
    clearBeforeRender: PropTypes.bool,
    powerPreference: PropTypes.string,
    sharedTicker: PropTypes.bool,
    sharedLoader: PropTypes.bool,

    // resizeTo needs to be a window or HTMLElement
    resizeTo: (props, propName) => {
      const el = props[propName]
      el &&
        invariant(
          el === window || el instanceof HTMLElement,
          `Invalid prop \`resizeTo\` of type ${typeof el}, expect \`window\` or an \`HTMLElement\`.`
        )
    },

    // view is optional, use if provided
    view: (props, propName, componentName) => {
      const el = props[propName]
      el &&
        invariant(
          el instanceof HTMLCanvasElement,
          `Invalid prop \`view\` of type ${typeof el}, supplied to ${componentName}, expected \`<canvas> Element\``
        )
    },
  }),
}

const defaultProps = {
  width: 800,
  height: 600,
  onMount: noop,
  onUnmount: noop,
  raf: true,
  renderOnComponentChange: true,
}

export function getCanvasProps(props) {
  const reserved = [...Object.keys(propTypes), ...Object.keys(PROPS_DISPLAY_OBJECT)]

  return Object.keys(props)
    .filter(p => !reserved.includes(p))
    .reduce((all, prop) => ({ ...all, [prop]: props[prop] }), {})
}

class Stage extends React.Component {
  _canvas = null
  _mediaQuery = null
  _ticker = null
  _needsUpdate = true
  app = null

  componentDidMount() {
    const { onMount, width, height, options, raf, renderOnComponentChange } = this.props

    this.app = new Application({
      width,
      height,
      view: this._canvas,
      ...options,
      autoDensity: options?.autoDensity !== false,
    })

    this.app.ticker.autoStart = false
    this.app.ticker[raf ? 'start' : 'stop']()

    this.mountNode = PixiFiber.createContainer(this.app.stage)
    PixiFiber.updateContainer(this.getChildren(), this.mountNode, this)

    onMount(this.app)

    // update size on media query resolution change?
    // only if autoDensity = true
    if (options?.autoDensity && window.matchMedia && options?.resolution === undefined) {
      this._mediaQuery = window.matchMedia(`(-webkit-min-device-pixel-ratio: 1.3), (min-resolution: 120dpi)`)
      this._mediaQuery.addListener(this.updateSize)
    }

    // listen for reconciler changes
    if (renderOnComponentChange && !raf) {
      this._ticker = new Ticker()
      this._ticker.autoStart = true
      this._ticker.add(this.renderStage)
      window.addEventListener('__REACT_PIXI_REQUEST_RENDER__', this.needsRenderUpdate)
    }

    this.updateSize()
    this.renderStage()
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    const { width, height, raf, renderOnComponentChange, options } = this.props

    // update resolution
    if (options?.resolution !== undefined && prevProps?.options.resolution !== options?.resolution) {
      this.app.renderer.resolution = options.resolution
      this.resetInteractionManager()
    }

    // update size
    if (
      prevProps.height !== height ||
      prevProps.width !== width ||
      prevProps.options?.resolution !== options?.resolution
    ) {
      this.updateSize()
    }

    // handle raf change
    if (prevProps.raf !== raf) {
      this.app.ticker[raf ? 'start' : 'stop']()
    }

    // flush fiber
    PixiFiber.updateContainer(this.getChildren(), this.mountNode, this)

    if (
      prevProps.width !== width ||
      prevProps.height !== height ||
      prevProps.raf !== raf ||
      prevProps.renderOnComponentChange !== renderOnComponentChange ||
      prevProps.options !== options
    ) {
      this._needsUpdate = true
      this.renderStage()
    }
  }

  updateSize = () => {
    const { width, height, options } = this.props

    if (!options?.resolution) {
      this.app.renderer.resolution = window.devicePixelRatio
      this.resetInteractionManager()
    }

    this.app.renderer.resize(width, height)
  }

  needsRenderUpdate = () => {
    this._needsUpdate = true
  }

  renderStage = () => {
    const { renderOnComponentChange, raf } = this.props
    if (!raf && renderOnComponentChange && this._needsUpdate) {
      this._needsUpdate = false
      this.app.renderer.render(this.app.stage)
    }
  }

  resetInteractionManager() {
    this.app.renderer.plugins.interaction.resolution = this.app.renderer.resolution
  }

  getChildren() {
    const { children } = this.props
    return <AppProvider value={this.app}>{children}</AppProvider>
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Error occurred in \`Stage\`.`)
    console.error(error)
    console.error(errorInfo)
  }

  componentWillUnmount() {
    this.props.onUnmount(this.app)

    if (this._ticker) {
      this._ticker.remove(this.renderStage)
      this._ticker.destroy()
    }

    window.removeEventListener('__REACT_PIXI_REQUEST_RENDER__', this.needsRenderUpdate)

    PixiFiber.updateContainer(null, this.mountNode, this)

    if (this._mediaQuery) {
      this._mediaQuery.removeListener(this.updateSize)
      this._mediaQuery = null
    }

    this.app.destroy()
  }

  render() {
    const { options } = this.props

    if (options && options.view) {
      invariant(options.view instanceof HTMLCanvasElement, 'options.view needs to be a `HTMLCanvasElement`')
      return null
    }

    return <canvas {...getCanvasProps(this.props)} ref={c => (this._canvas = c)} />
  }
}

Stage.propTypes = propTypes
Stage.defaultProps = defaultProps

export default Stage
