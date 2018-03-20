import * as PIXI from 'pixi.js'
import { pixi } from '../src/utils'

const noop = () => {}

describe('pixi', () => {
  describe('parsePoint', () => {
    test('parse undefined', () => {
      expect(pixi.parsePoint(undefined)).toEqual([])
    })

    test('parse null', () => {
      expect(pixi.parsePoint(null)).toEqual([])
    })

    test('parse string', () => {
      expect(pixi.parsePoint('1,3')).toEqual([1, 3])
    })

    test('parse invalid string', () => {
      expect(pixi.parsePoint('not, valid')).toEqual([])
    })

    test('parse number', () => {
      expect(pixi.parsePoint(100)).toEqual([100])
    })

    test('parse shallow array', () => {
      expect(pixi.parsePoint([100, 200])).toEqual([100, 200])
      expect(pixi.parsePoint([100, 200])).not.toBe([100, 200])
    })

    test('parse object with x y', () => {
      expect(pixi.parsePoint({ x: 100, y: 200 })).toEqual([100, 200])
    })

    test('parse object with x only', () => {
      expect(pixi.parsePoint({ x: 100 })).toEqual([100, 0])
    })

    test('parse object with y only', () => {
      expect(pixi.parsePoint({ y: 200 })).toEqual([0, 200])
    })
  })

  describe('isPointType', () => {
    describe('true', () => {
      test('point', () => {
        expect(pixi.isPointType(new PIXI.Point(100, 200))).toBeTruthy()
      })

      test('observablepoint', () => {
        expect(pixi.isPointType(new PIXI.ObservablePoint(noop, this, 100, 200))).toBeTruthy()
      })
    })

    describe('false', () => {
      test('string', () => {
        expect(pixi.isPointType(undefined)).toBeFalsy()
      })

      test('number', () => {
        expect(pixi.isPointType(123)).toBeFalsy()
      })

      test('array', () => {
        expect(pixi.isPointType([100, 200])).toBeFalsy()
      })

      test('object', () => {
        expect(pixi.isPointType({ x: 100, y: 200 })).toBeFalsy()
      })
    })
  })

  describe('eventHandlers', () => {
    test('available event handlers', () => {
      expect(pixi.eventHandlers).toMatchSnapshot()
    })
  })
})
