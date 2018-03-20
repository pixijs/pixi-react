import * as PIXI from 'pixi.js'
import { getTextureFromProps, applyDefaultProps, PROPS_DISPLAY_OBJECT, PROPS_RESERVED } from '../src/utils/props'
import { emptyTexture } from './__fixtures__/textures'

describe('props', () => {
  test('reserved props', () => {
    expect(PROPS_RESERVED).toMatchSnapshot()
  })
  test('display object props', () => {
    expect(PROPS_DISPLAY_OBJECT).toMatchSnapshot()
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
        'Test texture needs to be typeof `PIXI.Texture`'
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

  describe('applyDefaultProps', () => {
    let instance, fn

    beforeEach(() => {
      instance = new PIXI.Container()
      fn = jest.fn()
    })

    test('call removeListener', () => {
      const spy = jest.spyOn(instance, 'removeListener')
      applyDefaultProps(instance, { click: fn }, {})
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('click', fn)
    })

    test('call on', () => {
      const spy = jest.spyOn(instance, 'on')
      applyDefaultProps(instance, {}, { click: fn })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('click', fn)
    })

    test('removes old and add new listener', () => {
      applyDefaultProps(instance, {}, { click: fn })

      instance.emit('click', instance)
      instance.emit('click', instance)
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenCalledWith(instance)

      const newFn = jest.fn()
      fn.mockClear()

      applyDefaultProps(instance, { click: fn }, { click: newFn })
      instance.emit('click', instance)
      expect(fn).toHaveBeenCalledTimes(0)
      expect(newFn).toHaveBeenCalledTimes(1)
      expect(newFn).toHaveBeenCalledWith(instance)
    })

    test('invalid instance', () => {
      expect(() => applyDefaultProps()).toThrow('instance needs to be typeof `PIXI.DisplayObject`, got `undefined`')
    })

    test('skip reserved props', () => {
      applyDefaultProps(instance, {}, { children: [1, 2, 3], worldAlpha: 0 })
      expect(instance.children).toEqual([])
      expect(instance.worldAlpha).toEqual(1)
    })

    test('set prop on instance', () => {
      applyDefaultProps(instance, {}, { foo: 'bar', alpha: 0.5 })
      expect(instance.foo).toEqual('bar')
      expect(instance.alpha).toEqual(0.5)
    })

    test('set back to default value', () => {
      instance.alpha = 10
      applyDefaultProps(instance, {}, { alpha: null })
      expect(instance.alpha).toEqual(1)
    })
  })
})
