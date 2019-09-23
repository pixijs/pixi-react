import { parseCSSInnerHTML, getAtRules, parseAnimationRule, cssRuleMatch, hasCSSAnimations } from '../utils/css'
import { sortProps, deepmerge } from '../helpers'

const cssAnimations = {}
let cssRules = {}
const mediaqueries = {}
const selectorsWithMediaQueries = []
const mediaqueriesListeners = []
const mediaqueriesMatchers = []

const canITween = cssRule => {
  if (hasCSSAnimations(cssRule) && !window.TimelineMax) {
    console.error('GSAP needs to be a project dependency if you want to use css animations or transitions')
    return false
  }
  return true
}

const sortRulesWithTransitionsPropsFirst = (rule1, rule2) => {
  const rule1Props = Object.keys(rule1[1])
  const rule2Props = Object.keys(rule2[1])
  return rule2Props.includes('transitionProperty') - rule1Props.includes('transitionProperty')
}

const callMediaqueryListeners = value => {
  const mq = value.media.replace(/\s+/g, '').trim()
  if (!mediaqueries[mq]) return
  const isCurrentlyMatching = mediaqueries[mq].matching
  mediaqueries[mq].matching = value.matches
  mediaqueriesListeners.forEach(listener => {
    if (isCurrentlyMatching !== mediaqueries[mq].matching) {
      listener.call(listener, value.matches)
    }
  })
}

const extendWithDictionary = (obj, dictionary) => {
  Object.keys(dictionary).forEach(prop => {
    if (!obj[prop]) {
      obj[prop] = dictionary[prop]
    } else {
      obj[prop] = {
        ...obj[prop],
        ...dictionary[prop],
      }
    }
  })
}

const getMatchingMediaQueries = () => {
  const matchingMediaQueries = {}
  Object.keys(mediaqueries)
    .filter(mediaquery => mediaqueries[mediaquery].matching === true)
    .map(mediaquery => mediaqueries[mediaquery].cssRules)
    .forEach(rules => {
      extendWithDictionary(matchingMediaQueries, rules)
    })
  return matchingMediaQueries
}

const addStyleSheet = (cssInnerHTML, specificRule) => {
  if (specificRule && cssRules[`.${specificRule}`]) return
  const cssRule = parseCSSInnerHTML(cssInnerHTML, specificRule || 'rules')
  if (canITween(cssRule)) {
    extendWithDictionary(cssRules, cssRule)
  }

  getAtRules(cssInnerHTML, 'media').forEach(rule => {
    const cssRulesInMediaQuery = parseCSSInnerHTML(rule.content, specificRule || 'rules')

    if (!mediaqueries[rule.rule]) {
      mediaqueries[rule.rule] = {
        cssRules: cssRulesInMediaQuery,
        matching: false,
      }
      const mediaquery = window.matchMedia(rule.rule)
      mediaqueriesMatchers.push(mediaquery)
      callMediaqueryListeners(mediaquery)
      mediaquery.addListener(callMediaqueryListeners)
    } else {
      extendWithDictionary(mediaqueries[rule.rule].cssRules, cssRulesInMediaQuery)
    }
    Object.keys(cssRulesInMediaQuery).forEach(r => {
      if (canITween(cssRulesInMediaQuery[r])) {
        selectorsWithMediaQueries.push(r)
      }
    })
  })

  if (window.TimelineMax) {
    getAtRules(cssInnerHTML, 'keyframes').forEach(atRule => {
      const animationRule = parseAnimationRule(atRule)
      cssAnimations[atRule.rule] = animationRule
    })
  }
  //make rules containing transition-property declarations always being found first
  cssRules = sortProps(cssRules, sortRulesWithTransitionsPropsFirst)
}

const getCSSRuleByName = name => {
  let obj = {}
  const cssRulesInMediaQueries = getMatchingMediaQueries()
  const allCSSRules = deepmerge({}, [cssRules, cssRulesInMediaQueries])

  Object.keys(allCSSRules)
    .filter(cssRule => cssRuleMatch(cssRule.replace(/\s/g, ''), name))
    .forEach(cssRule => {
      obj = { ...obj, ...allCSSRules[cssRule] }
    })
  return obj
}

const addMediaQueryListener = listener => {
  mediaqueriesListeners.push(listener)
  mediaqueriesMatchers.forEach(value => {
    listener.call(listener, value.matches)
  })
}

const removeMediaQueryListener = listener => {
  const index = mediaqueriesListeners.indexOf(listener)
  if (index > -1) {
    mediaqueriesListeners.splice(index, 1)
  }
}

const getCSSAnimationByName = name => cssAnimations[name]

const hasMediaQuery = selector => selectorsWithMediaQueries.includes(selector)

const addStyleSheets = styleSheets => {
  Array.from(styleSheets).forEach(styleSheet => {
    const cssInnerHTML = styleSheet.ownerNode.innerHTML
    addStyleSheet(cssInnerHTML, null)
  })
}

const cssSource = {
  hasMediaQuery,
  addStyleSheets,
  addStyleSheet,
  getCSSAnimationByName,
  getCSSRuleByName,
  addMediaQueryListener,
  removeMediaQueryListener,
}

Object.freeze(cssSource)

export default cssSource
