import React from 'react'
import PropTypes from 'prop-types'
import * as PIXI from 'pixi.js'
import pkg from '../package.json'
import { DEFAULT_PROPS } from './props'
import ReactPixiFiber, { applyProps } from './ReactPixiFiber'
import { filterByKey, including } from './utils'

export function validateCanvas(props, propName, componentName) {
  // Let's assume that element is canvas if the element is Element and implements getContext
  const element = props[propName]
  if (typeof element === 'undefined') {
    return
  }

  const isCanvas = element instanceof Element && typeof element.getContext === 'function'
  if (!isCanvas) {
    const propType = typeof element
    return new Error(
      `Invalid prop '${propName}' of type '${propType}' supplied to '${componentName}', expected '<canvas> Element'.`
    )
  }
}

const propTypes = {
  options: PropTypes.shape({
    antialias: PropTypes.bool,
    autoStart: PropTypes.bool,
    backgroundColor: PropTypes.number,
    clearBeforeRender: PropTypes.bool,
    forceCanvas: PropTypes.bool,
    forceFXAA: PropTypes.bool,
    height: PropTypes.number,
    legacy: PropTypes.bool,
    powerPreference: PropTypes.string,
    preserveDrawingBuffer: PropTypes.bool,
    resolution: PropTypes.number,
    roundPixels: PropTypes.bool,
    sharedLoader: PropTypes.bool,
    sharedTicker: PropTypes.bool,
    transparent: PropTypes.bool,
    view: validateCanvas,
    width: PropTypes.number,
  }),
  children: PropTypes.node,
  height: PropTypes.number,
  width: PropTypes.number,
}
const childContextTypes = {
  app: PropTypes.object,
}

export const includingDisplayObjectProps = including(Object.keys(DEFAULT_PROPS))
export const includingStageProps = including(Object.keys(propTypes))
export const includingCanvasProps = key => !includingDisplayObjectProps(key) && !includingStageProps(key)

export const getCanvasProps = props => filterByKey(props, includingCanvasProps)
export const getDisplayObjectProps = props => filterByKey(props, includingDisplayObjectProps)

class Stage extends React.Component {
  getChildContext() {
    return {
      app: this._app,
    }
  }

  componentDidMount() {
    const { children, height, options, width } = this.props

    this._app = new PIXI.Application(width, height, {
      view: this._canvas,
      ...options,
    })

    // Apply root Container props
    const stageProps = getDisplayObjectProps(this.props)
    applyProps(this._app.stage, {}, stageProps)

    // Perhaps this should use the standalone render method somehow, the only differences now are:
    // - parentContainer
    // - callback
    // - return value
    this._mountNode = ReactPixiFiber.createContainer(this._app.stage)
    ReactPixiFiber.updateContainer(children, this._mountNode, this)

    ReactPixiFiber.injectIntoDevTools({
      findFiberByHostInstance: ReactPixiFiber.findFiberByHostInstance,
      bundleType: __DEV__ ? 1 : 0,
      version: pkg.version,
      rendererPackageName: pkg.name,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { children, height, width } = this.props

    // Apply root Container props
    const stageProps = getDisplayObjectProps(this.props)
    applyProps(this._app.stage, {}, stageProps)

    // Root container has been resized - resize renderer
    if (height !== prevProps.height || width !== prevProps.width) {
      this._app.renderer.resize(width, height)
    }

    ReactPixiFiber.updateContainer(children, this._mountNode, this)
  }

  componentWillUnmount() {
    ReactPixiFiber.updateContainer(null, this._mountNode, this)
  }

  render() {
    const { options } = this.props
    const canvasProps = getCanvasProps(this.props)

    // Do not render anything if view is passed to options
    if (typeof options !== 'undefined' && options.view) {
      return null
    } else {
      return <canvas ref={ref => (this._canvas = ref)} {...canvasProps} />
    }
  }
}

Stage.propTypes = propTypes
Stage.childContextTypes = childContextTypes

export default Stage
