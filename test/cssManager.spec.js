import {
  createElement, TYPES,
} from '../src/utils/element'
import cssSource from '../src/cssManager/cssSource'
import cssManager from '../src/cssManager/cssManager'
import * as tweensUtils from '../src/cssManager/tweens';
import { addTestStyleSheet, removeTestStyleSheet } from './__utils__/mock'

jest.mock('../src/cssManager/cssSource', () => {
  const animations = {
    'animation-1': {
      0: {

      },
      100: {

      },
    },
  }
  const allCSSRules = {
    '.selector-1': {
      y: '650',
    },
    '.selector-2': {
      scaleX: '2',
      scaleY: '2',
    },
    '.button': {
      interactive: 'true',
    },
    '.text': {
      fontSize: '10',
      fontFamily: 'Arial',
      fontStyle: 'Italic',
      fontWeight: '300',
    },
    '.x-200': {
      x: '200',
    },

    '.y-300': {
      y: '300',
    },
    '.animation': {
      alpha: '0.5',
      animationName: 'animation-1',
    },
    '.transition': {
      alpha: '0.5',
      transitionProperty: 'x,y',
    },
    '.animation-not-present': {
      alpha: '0.5',
      animationName: 'animation-2',
    },
  }

  const splitAndTrim = (string, separator) => (string
    ? string.split(separator).map((item) => item.trim())
    : [])


  const containsAll = (selectorText, ors) => (selectorText ? ors.every((x) => selectorText.indexOf(x) >= 0) : false)
  const cssRuleMatch = (haystack, niddle) => {
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
  return {
    addStyleSheet: jest.fn(),
    addMediaQueryListener: jest.fn(),
    removeMediaQueryListener: jest.fn(),
    getCSSAnimationByName: (name) => animations[name],
    getCSSRuleByName: (name) => {
      let obj = {}
      Object.keys(allCSSRules)
        .filter((cssRule) => cssRuleMatch(cssRule.replace(/\s/g, ''), name))
        .forEach((cssRule) => {
          obj = { ...obj, ...allCSSRules[cssRule] }
        })
      return obj
    },
  }
});

jest.mock('../src/cssManager/tweens', () => ({
  convertTransitionToTween: jest.fn(),
  convertAnimationToTween: jest.fn(),
}));

describe('cssManager init', () => {
  let element
  let stage
  let applyProps
  beforeEach(() => {
    jest.resetAllMocks()
    addTestStyleSheet('')
    stage = createElement(TYPES.Container)
    element = createElement(TYPES.Container)
    stage.addChild(element)
    applyProps = jest.fn()
    cssManager(element, 'Container', applyProps)
  });
  afterEach(() => {
    stage.destroy()
    removeTestStyleSheet()
  });

  test('that it should call addMediaQueryListener when starting the cssManager', () => {
    const spy1 = jest.spyOn(cssSource, 'addMediaQueryListener')
    expect(spy1).toHaveBeenCalled()
  })

  test('that it should call removeMediaQueryListener when removing the element', () => {
    const spy1 = jest.spyOn(cssSource, 'removeMediaQueryListener')
    stage.removeChild(element)
    expect(spy1).toHaveBeenCalled()
  })
})

describe('cssManager setCSSProps', () => {
  let element = {
    scale: { x: 1, y: 1 },
    position: { x: 0, y: 0 },
    on: jest.fn(),
    setProps: jest.fn(),
  }
  let applyProps
  let cssMan
  beforeEach(() => {
    jest.resetAllMocks()
    addTestStyleSheet('')
    element = { ...element }
    applyProps = jest.fn()
    cssMan = cssManager(element, 'Container', applyProps)
  });
  afterEach(() => {
    removeTestStyleSheet()
  });

  test('add single stylesheet generate by styled components and take last selector of the class when passing styled:true ', () => {
    cssMan.setProps({ styled: true })
    cssMan.setCSSProps('selector-1 selector-2')
    const spy1 = jest.spyOn(cssSource, 'addStyleSheet')
    expect(spy1).toHaveBeenCalledWith('', 'selector-2')
  })
  test('when it is an update, it is not needed to add the stylesheet again', () => {
    cssMan.setProps({ styled: true })
    cssMan.setCSSProps('selector-1 selector-2', true)
    const spy1 = jest.spyOn(cssSource, 'addStyleSheet')
    expect(spy1).not.toHaveBeenCalled()
  })
  test('when is not styled component, addStyleSheet is not to be called', () => {
    cssMan.setProps({ styled: false })
    cssMan.setCSSProps('selector-1 selector-2')
    const spy1 = jest.spyOn(cssSource, 'addStyleSheet')
    expect(spy1).not.toHaveBeenCalled()
  })

  test('that it should return an object with the props set by the css', () => {
    cssMan.setProps({ styled: false })
    const cssProps = cssMan.setCSSProps('selector-1 selector-2')
    expect(cssProps).toEqual({
      y: 650, scaleX: 2, scaleY: 2, style: {},
    })
  })

  test('that it should return an object with the props set by the css and any element specific prop passed as additional', () => {
    cssMan.setProps({ styled: false })
    const cssProps = cssMan.setCSSProps('selector-1 selector-2', true, {
      width: 300,
    })
    expect(cssProps).toEqual({
      y: 650, scaleX: 2, scaleY: 2, style: {}, width: 300,
    })
  })

  test('that it should give the element a getCSSBasedProps which return an object', () => {
    cssMan.setProps({ styled: false })
    cssMan.setCSSProps('selector-1', true, {
      width: 300,
    })
    expect(element.getCSSBasedProps()).toEqual({
      y: 650, style: {},
    })
  })
})


describe('cssManager setCSSProps with classes that do not exist', () => {
  let element = {
    scale: { x: 1, y: 1 },
    position: { x: 0, y: 0 },
    interactive: true,
    on: jest.fn(),
    setProps: jest.fn(),
  }
  let applyProps
  let cssMan
  beforeEach(() => {
    jest.resetAllMocks()
    addTestStyleSheet('')
    element = { ...element }
    applyProps = jest.fn()
    cssMan = cssManager(element, 'Container', applyProps)
  });
  afterEach(() => {
    removeTestStyleSheet()
  });

  test('that it should return the initial element properties if class does not exist', () => {
    cssMan.setProps({ styled: false })
    const cssProps = cssMan.setCSSProps('unexistingClass')
    expect(cssProps).toEqual({
      style: {},
    })
  })

  test('that it should return the initial element properties if class does not exist', () => {
    cssMan.setProps({ styled: false })
    const cssProps = cssMan.setCSSProps(null)
    expect(cssProps).toEqual({
      style: {},
    })
  })
})

describe('cssManager setCSSProps with Text type elements', () => {
  let element = {
    scale: { x: 1, y: 1 },
    position: { x: 0, y: 0 },
    on: jest.fn(),
    setProps: jest.fn(),
  }
  let applyProps
  let cssMan
  beforeEach(() => {
    jest.resetAllMocks()
    addTestStyleSheet('')
    element = { ...element }
    applyProps = jest.fn()
    cssMan = cssManager(element, 'Text', applyProps)
  });
  afterEach(() => {
    removeTestStyleSheet()
  });
  test('Font properties should be part of the style object ', () => {
    cssMan.setProps({ styled: false })
    const cssProps = cssMan.setCSSProps('text')
    expect(cssProps).toEqual({
      style: {
        fontSize: 10, fontFamily: 'Arial', fontStyle: 'Italic', fontWeight: 300,
      },
    })
  })
})

describe('cssManager setCSSProps adding the later removing classes', () => {
  let element = {
    scale: { x: 1, y: 1 },
    position: { x: 10, y: 10 },
    on: jest.fn(),
    setProps: jest.fn(),
  }
  let applyProps
  let cssMan
  beforeEach(() => {
    jest.resetAllMocks()
    element = { ...element }
    applyProps = jest.fn()
    cssMan = cssManager(element, 'Container', applyProps)
  });

  test('that it should always return the initial properties when a property is initially set by a css and then later is not', () => {
    let cssProps
    cssMan.setProps({ styled: false })
    cssProps = cssMan.setCSSProps('x-200')
    expect(cssProps).toEqual({
      x: 200, style: {},
    })
    cssProps = cssMan.setCSSProps('x-200 y-300', true)
    expect(cssProps).toEqual({
      x: 200, y: 300, style: {},
    })
    cssProps = cssMan.setCSSProps('x-200', true)
    expect(cssProps).toEqual({
      x: 200, y: 10, style: {},
    })
    cssProps = cssMan.setCSSProps('', true)
    expect(cssProps).toEqual({
      x: 10, y: 10, style: {},
    })
  })
})

describe('cssManager setCSSProps calling tween methods for transitions or animations', () => {
  let element = {
    scale: { x: 1, y: 1 },
    position: { x: 10, y: 10 },
    on: jest.fn(),
    setProps: jest.fn(),
  }
  let applyProps
  let cssMan
  beforeEach(() => {
    jest.resetAllMocks()
    element = { ...element }
    applyProps = jest.fn()
    cssMan = cssManager(element, 'Container', applyProps)
  });

  test('that it should call the convertAnimationToTween when a css class has animation-name prop and the animation exists', () => {
    cssMan.setProps({ styled: false })
    const spy1 = jest.spyOn(tweensUtils, 'convertAnimationToTween')
    const cssProps = cssMan.setCSSProps('animation')
    expect(spy1).toHaveBeenCalledWith(element, { 0: {}, 100: {} }, { animationName: 'animation-1' })
    expect(cssProps).toEqual({ alpha: '0.5', style: {} })
  })

  test('that it should not call the convertAnimationToTween when a css class has animation-name prop but the animation does not exists', () => {
    cssMan.setProps({ styled: false })
    const spy1 = jest.spyOn(tweensUtils, 'convertAnimationToTween')
    cssMan.setCSSProps('animation-not-present')
    expect(spy1).not.toHaveBeenCalled()
  })

  test('that it should call the convertTransitionToTween when a css class has a transition-property prop, but only after the 1st time', () => {
    let cssProps
    cssMan.setProps({ styled: false })
    const spy1 = jest.spyOn(tweensUtils, 'convertTransitionToTween')
    cssProps = cssMan.setCSSProps('transition y-300')
    expect(spy1).not.toHaveBeenCalled()
    expect(cssProps).toEqual({ alpha: '0.5', y: 300, style: {} })
    cssProps = cssMan.setCSSProps('transition y-300', true)
    expect(spy1).toHaveBeenCalledWith(element, { y: 300 }, { transitionProperty: 'x,y' })
  })
})
