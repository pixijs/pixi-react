window.TimelineMax = props => {
  return {
    getProps: jest.fn().mockReturnValue(props),
    to: jest.fn(),
    reverse: jest.fn(),
    kill: jest.fn()
  };
};

describe('cssSource', () => {
  let cssSource
  let cssInnerHTML
  beforeEach(() => {
    jest.resetModules()
    

    cssInnerHTML = require('./__utils__/mock').cssInnerHTML
    cssSource = require('../src/cssManager/cssSource').default;
    cssSource.addStyleSheet(cssInnerHTML)
  });

  describe('hasMediaQuery', () => {
    test('that it should return true when a css rule is also in mediaqueries', () => {
      expect(cssSource.hasMediaQuery('.from-top-to-bottom')).toEqual(true)
    });
  });

  describe('getCSSAnimationByName', () => {
    test('that it should return a found css animations with all its props', () => {
      expect(cssSource.getCSSAnimationByName('slide-bottom')).toEqual({
        steps: { 0: { alpha: '0' }, 100: { alpha: '1', y: '590' } },
      })
    });
  });

  describe('getCSSRuleByName', () => {
    test('that it should return a found css rule with all its props', () => {
      expect(cssSource.getCSSRuleByName('from-top-to-bottom')).toEqual({
        alpha: '0',
        animationDelay: '1000',
        animationDuration: '1000',
        animationName: 'slide-bottom',
      })
    });


    test('that it should return a found css rule with all its props included the ones in matching mediaqueries', () => {
      expect(cssSource.getCSSRuleByName('from-top-to-bottom-with-mediaquery')).toEqual({
        alpha: '0',
        animationDelay: '1000',
        animationDuration: '3000',
        animationName: 'slide-bottom',
      })
    });
  });

  afterEach(() => {
    jest.resetAllMocks()
  });
})

describe('cssSource', () => {
  let cssSource
  beforeEach(() => {
    jest.resetModules()
   

    cssSource = require('../src/cssManager/cssSource').default;
    cssSource.addStyleSheet('')
  });

  describe('addMediaQueryListener with not matching mediaqueries', () => {
    test('that it should add correctly a matching mediaquery event listener and not dispatched if a rule is not matching', () => {
      let called = false
      cssSource.addMediaQueryListener(() => {
        called = true
      })
      expect(called).toEqual(false)
    });
  });

  describe('addMediaQueryListener', () => {
    test('that it should add correctly a matching mediaquery event listener and dispatched if a rule is matching', () => {
      const { cssInnerHTML } = require('./__utils__/mock')
      let called = false
      cssSource.addMediaQueryListener(() => {
        called = true
      })
      cssSource.addStyleSheet(cssInnerHTML)

      expect(called).toEqual(true)
    });
  });

  describe('removeMediaQueryListener', () => {
    test('that it should no longer dispatch a matching mediaquery event if the listener is removed', () => {
      const { cssInnerHTML } = require('./__utils__/mock')
      let called = false
      const callback = () => {
        called = true
      }
      cssSource.addMediaQueryListener(callback)
      cssSource.removeMediaQueryListener(callback)
      cssSource.addStyleSheet(cssInnerHTML)
      expect(called).toEqual(false)
    });
  });


  afterEach(() => {
    jest.resetAllMocks()
  });
})
