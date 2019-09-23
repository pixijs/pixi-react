import { isEmpty, splitAndTrim, isBooleanString, convertToCamelCased, containsAll } from '../helpers'

export const transitionPropertyNames = [
  'transitionProperty',
  'transitionDuration',
  'transitionDelay',
  'transitionTimingFunction',
]

export const animationPropertyNames = [
  'animationName',
  'animationDuration',
  'animationDelay',
  'animationIterationCount',
  'animationDirection',
  'animationTimingFunction',
  'animationFillMode',
  'animationPlayState',
]

export const textStylePropertiesNames = [
  'align',
  'breakWords',
  'dropShadow',
  'dropShadowAlpha',
  'dropShadowAngle',
  'dropShadowBlur',
  'dropShadowColor',
  'dropShadowDistance',
  'fill',
  'fillGradientType',
  'fillGradientStops',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'lineJoin',
  'miterLimit',
  'padding',
  'stroke',
  'strokeThickness',
  'textBaseline',
  'trim',
  'whiteSpace',
  'wordWrap',
  'wordWrapWidth',
  'leading',
]

const xyContexts = 'position,scale,skew,pivot,anchor,tilePosition,tileScale'.split(',')
const contexts = {
  x: 'position',
  y: 'position',
  tileX: 'tilePosition',
  tileY: 'tilePosition',
}

xyContexts.forEach(xyContext => {
  contexts[`${xyContext}X`] = xyContext
  contexts[`${xyContext}Y`] = xyContext
})

const parseRule = innerHTML => {
  const ruleRegEx = /\s*([a-z-]+)\s*:\s*((?:[^;]*url\(.*?\)[^;]*|[^;]*)*)\s*(?:;|$)/gi
  const obj = {}
  let token
  while ((token = ruleRegEx.exec(innerHTML))) {
    obj[convertToCamelCased(token[1])] = token[2]
  }
  return obj
}

export const getContexts = () => contexts

export const castStringCSSValue = value => {
  if (isEmpty(value)) return false
  let castValue = value.replace('!important', '').trim()
  if (castValue.match(/\[[^\]]*]/g) || isBooleanString(castValue)) {
    castValue = JSON.parse(castValue.replace(/'/g, '"'))
  } else if (!/\D/.test(castValue)) {
    castValue = Number(castValue)
  } else {
    castValue = castValue.replace(/["']/g, '')
  }
  return castValue
}

export const getToBeTweenedProps = props =>
  Object.keys(props)
    .filter(name => name.indexOf('transition') > -1 || name.indexOf('animation') > -1)
    .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {})

export const convertCSSPropsToPIXI = (props = {}, onlyImportant = false) => {
  const mainStyle = Object.keys(props)
    .filter(key => {
      if (key === 'style') return false
      const condition = props[key] && props[key].toString().indexOf('!important') > -1
      return onlyImportant ? condition : !condition
    })
    .reduce((acc, key) => ({ ...acc, [key]: castStringCSSValue(props[key]) }), {})

  const txtStyle = props.style
    ? Object.keys(props.style)
        .filter(key => {
          const condition = props.style[key] && props.style[key].toString().indexOf('!important') > -1
          return onlyImportant ? condition : !condition
        })
        .reduce((acc, key) => ({ ...acc, [key]: castStringCSSValue(props.style[key]) }), {})
    : {}

  return {
    ...mainStyle,
    ...{
      style: txtStyle,
    },
  }
}

export const parseCSSInnerHTML = (innerHTML, type) => {
  const types = {
    animation: /([\s\S]+?)\{([\s\S]*?)\}/gi,
    rules: /pixi([\s\S]+?)\{([\s\S]*?)\}/gi,
  }
  let text = innerHTML
  const ruleRegEx = types[type] || new RegExp(`(.${type}[\\s]*?)\\{([\\s\\S]*?)\\}`, 'gi')
  const rules = {}
  let token
  text = text.replace(/\/\*[\s\S]*?\*\//g, '').replace('-webkit-', '')

  if (type !== 'animation') {
    text = text.replace(/((@media)([\s\S]*?){([\s\S]*?}\s*?)})/g, '')
  }
  while ((token = ruleRegEx.exec(text))) {
    const style = parseRule(token[2].trim())
    const classSelectorNames = splitAndTrim(token[1].trim().replace(/\s*,\s*/, ', '), ',')

    classSelectorNames.forEach(classSelectorName => {
      if (!classSelectorName) {
        rules[classSelectorName] = style
      } else {
        rules[classSelectorName] = {
          ...rules[classSelectorName],
          ...style,
        }
      }
    })
  }
  return rules
}

export const parseAnimationRule = innerHTML => {
  const animation = {
    steps: {},
  }
  const parsedCSS = parseCSSInnerHTML(innerHTML.content, 'animation')
  Object.keys(parsedCSS).forEach(css => {
    let selector = css.replace('%', '')
    if (css === 'from') selector = '0'
    if (css === 'to') selector = '100'
    animation.steps[selector] = parsedCSS[css]
  })
  return animation
}

export const getAtRules = (innerHTML, type) => {
  const ruleRegEx = new RegExp(`((@${type})([\\s\\S]*?){([\\s\\S]*?}\\s*?)})`, 'g')
  const rules = []
  let token = ''
  while ((token = ruleRegEx.exec(innerHTML))) {
    rules.push({
      rule: token[3].replace(/\s+/g, '').trim(),
      content: token[4].trim(),
    })
  }
  return rules
}

export const cssRuleMatch = (haystack, niddle) => {
  const haystackArr = splitAndTrim(haystack.substr(1, haystack.length), '.')
  const niddleArr = splitAndTrim(niddle, ' ')
  if (haystackArr.length === 1) {
    return niddleArr.indexOf(haystackArr[0]) > -1
  }
  if (haystackArr.length === niddleArr.length) {
    return containsAll(haystackArr, niddleArr)
  }
  return false
}

export const hasCSSAnimations = obj => {
  const animationProps = [...transitionPropertyNames, ...animationPropertyNames]
  const rules = Object.values(obj)
  return rules.map(rule => animationProps.some(r => Object.keys(rule).includes(r))).includes(true)
}
