import React from 'react'
import * as PIXI from 'pixi.js'
import { createElement, TYPES } from '../src/utils/createElement'
import { props, pixi } from '../src/utils'
import { getTextureFromProps } from '../src/utils/props'

import { emptyTexture } from './__fixtures__/textures'
import { desyrel } from './__fixtures__/bitmapfonts'
import parseBitmapFont from './__utils__/parseBitmapFont'

const noop = () => {}

parseBitmapFont(desyrel)

describe('props', () => {
  test('reserved props', () => {
    expect(props.PROPS_RESERVED).toMatchSnapshot()
  })
  test('display object props', () => {
    expect(props.PROPS_DISPLAY_OBJECT).toMatchSnapshot()
  })
})

describe('createElement', () => {
  test('types', () => {
    expect(TYPES).toMatchSnapshot()
  })

  test('create Container', () => {
    const element = createElement(TYPES.Container)
    expect(element).toBeInstanceOf(PIXI.Container)
  })

  test('create Text', () => {
    const element = createElement(TYPES.Text, { text: 'foobar' })
    expect(element).toBeInstanceOf(PIXI.Text)
  })

  test('create Sprite', () => {
    const element = createElement(TYPES.Sprite, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.Sprite)
  })

  test('create ParticleContainer', () => {
    const element = createElement(TYPES.ParticleContainer)
    expect(element).toBeInstanceOf(PIXI.particles.ParticleContainer)
  })

  test('create BitmapText', () => {
    const element = createElement(TYPES.BitmapText, { text: 'foobar', style: { font: '35px Desyrel' } })
    expect(element).toBeInstanceOf(PIXI.extras.BitmapText)
  })

  test('create TilingSprite', () => {
    const element = createElement(TYPES.TilingSprite, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.extras.TilingSprite)
  })

  test('create Graphics', () => {
    const element = createElement(TYPES.Graphics)
    expect(element).toBeInstanceOf(PIXI.Graphics)
  })

  test('create NineSlicePlane', () => {
    const element = createElement(TYPES.NineSlicePlane, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.mesh.NineSlicePlane)
  })

  test('create Mesh', () => {
    const element = createElement(TYPES.Mesh, { texture: emptyTexture })
    expect(element).toBeInstanceOf(PIXI.mesh.Mesh)
  })

  test('create Rope', () => {
    const element = createElement(TYPES.Rope, { texture: emptyTexture, points: [] })
    expect(element).toBeInstanceOf(PIXI.mesh.Rope)
  })

  test('get undefined', () => {
    expect(createElement('INVALID')).toBeUndefined()
  })
})

describe('getTextureFromProps', () => {
  let spy

  beforeAll(() => {
    spy = jest.spyOn(PIXI.Texture, 'fromImage').mockReturnValue(emptyTexture)
  })

  afterAll(() => {
    spy.mockRestore()
  })

  test('invariant image', () => {
    expect(() => getTextureFromProps('Test', { image: 123 })).toThrow('Test image needs to be a string, got `number`')
  })

  test('invariant texture', () => {
    expect(() => getTextureFromProps('Test', { texture: 'texture' })).toThrow(
      'Test texture needs to be type of `PIXI.Texture`'
    )
  })

  test('get texture from image', () => {
    const texture = getTextureFromProps('Test', { image: './image.png' })
    expect(texture).toBeInstanceOf(PIXI.Texture)
    expect(spy).toBeCalledWith('./image.png')
  })

  test('get texture from texture', () => {
    const texture = getTextureFromProps('Test', { texture: emptyTexture })
    expect(texture).toBe(emptyTexture)
  })
})

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
    test('available event hanlders', () => {
      expect(pixi.eventHandlers).toMatchSnapshot()
    })
  })
})
