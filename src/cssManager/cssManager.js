import {
  getToBeTweenedProps,
  convertCSSPropsToPIXI,
  getContexts,
  transitionPropertyNames,
  animationPropertyNames,
  textStylePropertiesNames,
} from '../utils/css'
import { convertAnimationToTween, convertTransitionToTween } from './tweens'
import cssSource from './cssSource'
import { unassign, pick, isEmpty, splitAndTrim } from '../helpers'

const filterTweenPropsAndParams = (props, toRemove, action) => {
  const filter = {
    in: pick,
    out: unassign,
  }
  const transitionProps = props.transitionProperty
  const propsHandledByTransition = Object.keys(toRemove)

  return filter[action](props, [...propsHandledByTransition, ...transitionPropertyNames, ...animationPropertyNames])
}

const getCSSBasedProps = cssRule => {
  const props = {
    style: {},
  }

  Object.keys(cssRule).forEach(rule => {
    if (textStylePropertiesNames.includes(rule)) {
      props.style[rule] = cssRule[rule]
    } else {
      props[rule] = cssRule[rule]
    }
  })
  return props
}

const extendPIXIWithCSSProps = (cssProps, props = {}) => {
  const elProps = convertCSSPropsToPIXI(cssProps)
  const importantElProps = convertCSSPropsToPIXI(cssProps, true)
  return {
    ...elProps,
    ...props,
    ...importantElProps,
    style: {
      ...elProps.style,
      ...props.style,
      ...importantElProps.style,
    },
  }
}

const getInitialElementProp = (element, cssBasedProp) => {
  let value
  if (isEmpty(element[cssBasedProp])) {
    const context = getContexts()[cssBasedProp]
    if (context) {
      const axis =
        cssBasedProp
          .charAt(cssBasedProp.length - 1)
          .toLowerCase()
          .indexOf('x') !== -1
          ? 'x'
          : 'y'
      value = element[context][axis]
    } else {
      value = element[cssBasedProp]
    }
  } else {
    value = element[cssBasedProp]
  }
  return value
}

export default (element, type, applyProps) => {
  const initialCSSValues = {}
  let allProps
  let currentClassName
  let currentProps = {}
  let transitionProps = {}
  element.getCSSBasedProps = () => {
    return extendPIXIWithCSSProps(getCSSBasedProps(cssSource.getCSSRuleByName(currentClassName)))
  }
  const tweenComponent = (animationProps, animationParams) => {
    const { transitionProperty, animationName } = animationParams
    const arrTransitionProps = Object.keys(transitionProps)
    if (animationName) {
      const animationByName = cssSource.getCSSAnimationByName(animationName)
      if (animationByName) {
        convertAnimationToTween(element, animationByName, animationParams)
      }
    }
    if (arrTransitionProps.length > 0) {
      convertTransitionToTween(element, pick(animationProps, arrTransitionProps), animationParams)
    }

    if (transitionProperty) {
      transitionProperty.split(',').forEach(p => {
        transitionProps[p.trim()] = true
      })
    }
  }

  const setCSSProps = (className, isUpdate, props) => {
    let animationProps
    let animationParams
    if (className) {
      if (!isUpdate && currentProps.styled) {
        const styledComponentCSSSelector = className.split(' ')
        currentClassName = styledComponentCSSSelector[styledComponentCSSSelector.length - 1]
        cssSource.addStyleSheet(document.querySelectorAll('[data-styled]')[0].innerHTML, currentClassName)
      } else {
        currentClassName = className
      }
    } else {
      transitionProps = {}
    }

    const cssBasedProps = getCSSBasedProps(cssSource.getCSSRuleByName(className))
    Object.keys(cssBasedProps).forEach(cssBasedProp => {
      if (isEmpty(initialCSSValues[cssBasedProp])) {
        initialCSSValues[cssBasedProp] = getInitialElementProp(element, cssBasedProp)
      }
    })

    allProps = {
      ...initialCSSValues,
      ...extendPIXIWithCSSProps(cssBasedProps, props),
    }

    animationProps = {
      ...initialCSSValues,
      ...filterTweenPropsAndParams(allProps, transitionProps, 'in'),
    }

    animationParams = getToBeTweenedProps(animationProps)
    const { transitionProperty } = animationParams
    if (!transitionProperty) {
      transitionProps = {}
    }

    const propsAndParamsWithoutTweened = filterTweenPropsAndParams(allProps, transitionProps, 'out')
    tweenComponent(animationProps, animationParams)

    return propsAndParamsWithoutTweened
  }

  const updateComponent = () => {
    if (!cssSource.hasMediaQuery(`.${currentClassName}`)) return
    setCSSProps(currentClassName, true)

    if (applyProps) {
      applyProps(element, currentProps, filterTweenPropsAndParams(allProps, transitionProps, 'out'))
    }
  }

  const setProps = props => {
    currentProps = props
  }

  cssSource.addMediaQueryListener(updateComponent)

  element.on('removed', () => {
    //clean up when element is removed by the stage
    delete element.cssManager
    cssSource.removeMediaQueryListener(updateComponent)
  })

  return {
    setCSSProps,
    setProps,
  }
}
