import { pick, isFunction } from '../helpers'

export const convertAnimationToTween = (
  element,
  props,
  {
    animationDuration = 1,
    animationDelay = 1,
    animationIterationCount = 1,
    animationDirection = 'normal',
    animationTimingFunction = 'linear',
    animationFillMode,
    animationPlayState = 'running',
  }
) => {
  if (!window.TimelineMax) return false
  const animationsTimeline = new window.TimelineMax({
    paused: animationPlayState === 'paused',
    delay: animationDelay / 1000,
    yoyo: animationDirection === 'alternate',
    repeat: animationIterationCount !== 'infinite' ? animationIterationCount - 1 : -1,
    onReverseComplete: () => {
      if (element.animationEnd && isFunction(element.animationEnd) && animationDirection === 'reverse') {
        element.animationEnd.call(element, element)
      }
      animationsTimeline.kill()
    },
    onComplete: () => {
      if (element.animationEnd && isFunction(element.animationEnd)) {
        element.animationEnd.call(element, element)
      }
      animationsTimeline.kill()
    },
  })

  if (animationDirection === 'reverse' && animationPlayState === 'running') {
    animationsTimeline.reverse(0, false)
  }

  Object.keys(props.steps).forEach((step, index, arr) => {
    let time = 0
    if (index >= 1) {
      time = parseFloat(arr[index]) - parseFloat(arr[index - 1])
    }
    animationsTimeline.to(element, (time / 100) * (animationDuration / 1000), {
      ease: animationTimingFunction,
      pixi: { ...props.steps[step] },
    })
  })
  return animationsTimeline
}

export const convertTransitionToTween = (
  element,
  baseProps,
  { transitionProperty, transitionDuration = 0, transitionDelay = 0, transitionTimingFunction = 'linear' }
) => {
  if (!window.TimelineMax) return false
  const transitionPropNames = transitionProperty ? transitionProperty.split(',').map(item => item.trim()) : []

  const propsToTransition = pick(baseProps, transitionPropNames)
  if (Object.entries(propsToTransition).length > 0) {
    const transition = new window.TimelineMax({
      delay: transitionDelay / 1000,
      ease: transitionTimingFunction,
      onComplete: () => {
        transition.kill()
        if (element.transitionEnd && isFunction(element.transitionEnd)) {
          element.transitionEnd.call(element, element)
        }
      },
    })

    transition.to(element, transitionDuration / 1000, {
      ease: transitionTimingFunction,
      pixi: propsToTransition,
    })

    return transition
  }
  return false
}
