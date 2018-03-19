import React from 'react'
import PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import { PROPS_DISPLAY_OBJECT } from '../utils/props'
import { renderFromComponent } from '../render'

const noop = () => {}

/**
 * -------------------------------------------
 * Stage React Component (use this in react-dom)
 *
 * @usage
 *
 *    const App = () => (
 *      <Stage width={500}
 *             height={500}
 *             options={ backgroundColor: 0xff0000 }
 *             onMount={( renderer, canvas ) => {
 *               console.log('PIXI renderer: ', renderer)
 *               console.log('Canvas element: ', canvas)
 *             }}>
 *    )
 *
 * -------------------------------------------
 */

const propTypes = {
  // dimensions
  width: PropTypes.number,
  height: PropTypes.number,

  // use builtin ticker? default=true
  useTicker: PropTypes.bool,

  // will return canvas and renderer instance
  onMount: PropTypes.func,

  // PIXI options, see http://pixijs.download/dev/docs/PIXI.Application.html
  options: PropTypes.shape({
    antialias: PropTypes.bool,
    autoStart: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    transparent: PropTypes.bool,
    preserveDrawingBuffer: PropTypes.bool,
    resolution: PropTypes.number,
    forceCanvas: PropTypes.bool,
    backgroundColor: PropTypes.number,
    clearBeforeRender: PropTypes.bool,
    roundPixels: PropTypes.bool,
    forceFXAA: PropTypes.bool,
    legacy: PropTypes.bool,
    powerPreference: PropTypes.string,
    sharedTicker: PropTypes.bool,
    sharedLoader: PropTypes.bool,

    // view is optional, use if provided
    view: (props, propName, componentName) => {
      const el = props[propName]
      if (el === undefined) {
        return
      }
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
  useTicker: true,
  onMount: noop,
}

function getCanvasProps(props) {
  const reserved = [...Object.keys(propTypes), ...Object.keys(PROPS_DISPLAY_OBJECT)]

  return Object.keys(props)
    .filter(p => !reserved.includes(p))
    .reduce((all, prop) => ({ ...all, [prop]: props[prop] }), {})
}

class Stage extends React.Component {
  _canvas = null

  componentWillMount() {
    invariant(!!window, `Cannot mount Stage, window object is not defined`)
  }

  componentDidMount() {
    const { children, width, height, options } = this.props

    this.app = new PIXI.Application(width, height, {
      ...options,
      view: this._canvas,
    })

    this.mountNode = renderFromComponent(children, this.app.stage, this, true)
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    const { children, width, height } = this.props

    // handle resize
    if (prevProps.height !== height || prevProps.width !== width) {
      this.app.resize(width, height)
    }

    // handle resolution ?

    renderFromComponent(children, this.mountNode, this)
  }

  componentWillUnmount() {
    renderFromComponent(null, this.mountNode, this)
  }

  render() {
    const { options } = this.props

    if (!options && options.view) {
      return null
    }

    return <canvas {...getCanvasProps(this.props)} ref={c => (this._canvas = c)} />
  }
}

Stage.propTypes = propTypes
Stage.defaultProps = defaultProps

export default Stage
