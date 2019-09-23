import {
  getToBeTweenedProps,
  convertCSSPropsToPIXI,
  parseAnimationRule,
  parseCSSInnerHTML,
  getAtRules,
  castStringCSSValue,
  cssRuleMatch,
} from '../src/utils/css';

import { cssInnerHTML, cssObject, allAnimations } from './__utils__/mock'

const animationAndTransitionProps = {
  transitionProperty: 'x',
  transitionDuration: '1000',
  transitionDelay: '1000',
  transitionTimingFunction: 'ease',
  animationName: 'slidein',
  animationDuration: '1000',
  animationDelay: '1000',
  animationIterationCount: '1',
  animationDirection: 'reverse',
  animationTimingFunction: 'ease',
  animationPlayState: 'running',
};

const cssProps = {
  x: '10',
  y: '10',
  interactive: 'true',
  width: '20 !important',
  style: {
    fontFamily: 'Arial',
    fontSize: '36',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: '["#FF0000", "#FFFF00"]',
  },
};

describe('css', () => {
  describe('getToBeTweenedProps', () => {
    let toBeTweenedProps;
    beforeAll(() => {
      toBeTweenedProps = {
        ...animationAndTransitionProps,
        x: 0,
        y: 0,
      };
    });
    test('that it should return only props that are related to animations and transitions', () => {
      expect(getToBeTweenedProps(toBeTweenedProps)).toEqual(
        animationAndTransitionProps,
      );
    });
  });

  describe('convertCSSPropsToPIXI', () => {
    test('that should convert the props correctly ', () => {
      const pixiProps = convertCSSPropsToPIXI(cssProps);
      expect(pixiProps.x).toEqual(10);
      expect(pixiProps.interactive).toEqual(true);
      expect(pixiProps.width).toBeUndefined();
      expect(pixiProps.style.fill).toEqual(['#FF0000', '#FFFF00']);
    });
    test('that should convert the props correctly and return only the !important ones', () => {
      const pixiProps = convertCSSPropsToPIXI(cssProps, true);
      expect(pixiProps.x).toBeUndefined();
      expect(pixiProps.interactive).toBeUndefined();
      expect(pixiProps.width).toBe(20);
      expect(pixiProps.style.fill).toBeUndefined();
    });
    test('should convert the props correctly and return only all but the !important ones', () => {
      const pixiProps = convertCSSPropsToPIXI(cssProps, false);
      expect(pixiProps.x).toEqual(10);
      expect(pixiProps.interactive).toEqual(true);
      expect(pixiProps.width).toBeUndefined();
      expect(pixiProps.style.fill).toEqual(['#FF0000', '#FFFF00']);
    });
  });

  describe('parseAnimationRule', () => {
    test('should convert the animation correctly to an object with its animation steps and name of it', () => {
      const animationRule = {
        rule: 'slide-bottom',
        content:
          '0% {  alpha: 0;   }   50% {    alpha: 0.5;   y: 200;  } 100% {    alpha: 1;   y: 590;  }',
      };
      const animation = parseAnimationRule(animationRule);
      expect(animation.steps['0']).toEqual({ alpha: '0' });
      expect(animation.steps['50']).toEqual({ alpha: '0.5', y: '200' });
      expect(animation.steps['100']).toEqual({ alpha: '1', y: '590' });
    });
    test('should convert the animation correctly interpreting "from" as 0% and "to" as 100%', () => {
      const animationRule = {
        rule: 'slide-bottom',
        content: 'from {  alpha: 0;   }  to {    alpha: 1;   y: 590;  }',
      };
      const animation = parseAnimationRule(animationRule);
      expect(animation.steps['0']).toEqual({ alpha: '0' });
      expect(animation.steps['100']).toEqual({ alpha: '1', y: '590' });
    });
  });

  describe('parseCSSInnerHTML', () => {
    test('should convert the css text to an object with all the rules', () => {
      const rules = parseCSSInnerHTML(cssInnerHTML, 'rules');
      Object.keys(rules).forEach((rule) => {
        expect(cssObject[rule]).toEqual(rules[rule]);
      });
    });

    test('should convert a text with the animation steps to an object with the steps as its properties ', () => {
      const rules = parseCSSInnerHTML(`
          from {
            alpha: 0;
          }
          to {
            alpha: 1;
            y: 590;
          }
      `, 'animation');
      expect(rules.from).toEqual({ alpha: '0' });
      expect(rules.to).toEqual({ alpha: '1', y: '590' });
    });

    test('should find the rule withing the css text and return an object with all its properties ', () => {
      const rules = parseCSSInnerHTML(cssInnerHTML, 'x100_y100');
      expect(Object.keys(rules).length).toEqual(1);
      expect(rules['.x100_y100']).toEqual({ x: '100', y: '100' });
    });
  });

  describe('getAtRules', () => {
    test('should find within the css text all the rules with @keyframes and remove white spaces ', () => {
      getAtRules(cssInnerHTML, 'keyframes');
      allAnimations.forEach((rule, index) => {
        expect(allAnimations[index].content.replace(/\s/g, '')).toEqual(
          rule.content.replace(/\s/g, ''),
        );
      });
    });

    test('should find within the css text all the rules with @media and remove white spaces ', () => {
      const rules = getAtRules(cssInnerHTML, 'media');
      expect(Object.keys(rules).length).toEqual(2);
      expect(rules[0].content.replace(/\s/g, '')).toEqual(
        'pixi.from-top-to-bottom{animation-name:slide-bottom;animation-duration:3000;}',
      );
    });
  });

  describe('castStringCSSValue', () => {
    test('should cast css values that are wrong to "false" ', () => {
      const value = castStringCSSValue(undefined);
      expect(value).toEqual(false);
    });
    test('should cast css values that are wrong to "false"', () => {
      const value = castStringCSSValue(null);
      expect(value).toEqual(false);
    });
    test('should cast css string values that are numbers to a number ', () => {
      const value = castStringCSSValue('1 !important');
      expect(value).toEqual(1);
    });
    test('should leave css string values that are string', () => {
      const value = castStringCSSValue('test !important');
      expect(value).toEqual('test');
    });
    test('should cast css string values that are booleans to a boolean type', () => {
      const value = castStringCSSValue('true !important');
      expect(value).toEqual(true);
    });
    test('should cast css string values that are arrays to an array ', () => {
      const value = castStringCSSValue('[1, 2, 3] !important');
      expect(value).toEqual([1, 2, 3]);
    });
  });
  // TODO seems the order does not matter but it should
  describe('cssRuleMatch', () => {
    test('should find the rule selector withing a text', () => {
      const value = cssRuleMatch('.clickable', 'clickable');
      expect(value).toEqual(true);
    });
    test('should find the rule selectors withing a text ', () => {
      const value = cssRuleMatch('.clickable.test', 'clickable test');
      expect(value).toEqual(true);
    });
    test('should find the rule selector withing a text regardless of the order', () => {
      const value = cssRuleMatch(
        '.selector.clickable.test',
        'clickable selector test',
      );
      expect(value).toEqual(true);
    });
    test('should not match when there are not exactly all selectors', () => {
      const value = cssRuleMatch(
        '.selector.clickable',
        'clickable selector test',
      );
      expect(value).toEqual(false);
    });
  });
});
