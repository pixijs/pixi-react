import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SpineContext from './SpineContext'

class Animation extends Component {
  static contextType = SpineContext

  static propTypes = {
    name: PropTypes.string.isRequired,
    play: PropTypes.bool,
    trackTime: PropTypes.number,
    timeScale: PropTypes.number,
    animationEnd: PropTypes.number,
    events: PropTypes.object,
    track: PropTypes.number,
    loop: PropTypes.bool,
    queue: PropTypes.bool,
    delay: PropTypes.number,
  }

  static defaultProps = {
    play: true,
    trackTime: 0,
    timeScale: 1,
    animationEnd: null,
    events: {},
    track: 0,
    loop: false,
    queue: false,
    delay: 0,
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { name, play = true, trackTime, timeScale, animationEnd, events = {}, track, loop, queue, delay } = this.props
    const { spineElement } = this.context

    if (name) {
      spineElement.addAnimation(name, track, loop, queue, delay, trackTime, timeScale, animationEnd)

      if (play) {
        spineElement.playAnimation(name)
      }

      Object.keys(events).forEach(event => {
        if (typeof events[event] === 'function') {
          spineElement.addTrackEvent(event, events[event], name)
        }
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { name, trackTime, timeScale, animationEnd, track, loop, queue, play = true, delay } = this.props
    const { spineElement } = this.context

    if (name !== prevProps.name) {
      spineElement.addAnimation(name, track, loop, queue, delay, trackTime, timeScale, animationEnd)
    }

    if (play !== prevProps.play) {
      spineElement.playAnimation(name)
    }

    if (trackTime !== prevProps.trackTime) {
      spineElement.goToTime(name, trackTime)
    }

    if (timeScale !== prevProps.timeScale) {
      spineElement.setAnimationSpeed(name, timeScale)
    }

    if (animationEnd !== prevProps.animationEnd) {
      spineElement.setAnimationEndTime(name, animationEnd)
    }
  }

  render() {
    return (
      <SpineContext.Consumer>
        {props => {
          return null
        }}
      </SpineContext.Consumer>
    )
  }
}

export default Animation
