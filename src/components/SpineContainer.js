import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TYPES } from '../utils/element'
import { Animation, Slot, Bone } from './spineComponent'
import SpineContext from './spineComponent/SpineContext'
const { Spine } = TYPES

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
  }
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.warn(error, errorInfo)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }
    return null
  }
}

class SpineContainer extends Component {
  static Animation = Animation
  static Slot = Slot
  static Bone = Bone
  static contextType = SpineContext
  static propTypes = {
    spineData: PropTypes.object.isRequired,
    children: PropTypes.node,
    autoPlay: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    events: PropTypes.object,
    skin: PropTypes.string,
    speed: PropTypes.number,
    mixes: PropTypes.array,
    animations: PropTypes.array,
  }

  constructor(props, context) {
    super(props)
    const { spineData, autoPlay = true, width, height, events = {}, skin, mixes } = props
    const { spineManager } = context
    this.spineElement = spineManager(spineData)
    if (this.spineElement) {
      this.spineElement.init({
        autoPlay,
        width,
        height,
        events,
        skin,
        mixes,
      })
    } else {
      console.warn('To use the spine component please install pixi-spine.') 
    }
  }

  componentDidMount = () => {
    if (!this.spineElement) return
    const { speed = 1, animations } = this.props
    this.spineElement.setSpeed(speed)
    if (animations && animations.length > 0) {
      animations.forEach(animation => {
        if (!this.spineElement.getAnimationByName(animation)) {
          this.spineElement.addAnimation(animation)
        }
        this.spineElement.playAnimation(animation)
      })
    }
  }

  componentDidUpdate = prevProps => {
    if (!this.spineElement) return
    const { skin, animations } = this.props

    if (skin !== prevProps.skin) {
      this.spineElement.setSkinByName(skin)
    }

    if (JSON.stringify(animations) !== JSON.stringify(prevProps.animations)) {
      animations.forEach(animation => {
        if (!this.spineElement.getAnimationByName(animation)) {
          this.spineElement.addAnimation(animation)
        }
        this.spineElement.playAnimation(animation)
      })
    }
  }

  render() {
    return (
      <SpineContext.Provider value={{ ...this.props, spineElement: this.spineElement }}>
        <ErrorBoundary>
          <Spine {...this.props} spineElement={this.spineElement} />
        </ErrorBoundary>
      </SpineContext.Provider>
    )
  }
}

export default SpineContainer
