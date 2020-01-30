import * as PIXI from 'pixi.js'
import DisplayObject from '../src/components/DisplayObject'
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
      spy = jest.spyOn(PIXI.Texture, 'from').mockReturnValue(emptyTexture)
    })

    afterAll(() => {
      spy.mockRestore()
    })

    test('invariant image', () => {
      expect(() => getTextureFromProps('Test', { image: 123 })).toThrow('Test image prop is invalid')
    })

    test('invariant texture', () => {
      expect(() => getTextureFromProps('Test', { texture: 'texture' })).toThrow(
        'Test texture needs to be typeof `PIXI.Texture`'
      )
    })

    test('invariant video', () => {
      expect(() => getTextureFromProps('Test', { video: 123 })).toThrow('Test video prop is invalid')
    })

    test('invariant source', () => {
      expect(() => getTextureFromProps('Test', { source: null })).toThrow('Test source prop is invalid')
    })

    test('get texture from image url', () => {
      const texture = getTextureFromProps('Test', { image: './image.png' })
      expect(texture).toBeInstanceOf(PIXI.Texture)
      expect(spy).toBeCalledWith('./image.png')
    })

    test('get texture from image html element', () => {
      const image = document.createElement('img')
      const texture = getTextureFromProps('Test', { image })
      expect(texture).toBeInstanceOf(PIXI.Texture)
      expect(spy).toBeCalledWith(image)
    })

    test('get texture from video url', () => {
      const texture = getTextureFromProps('Test', { video: './video.mp4' })
      expect(texture).toBeInstanceOf(PIXI.Texture)
      expect(spy).toBeCalledWith('./video.mp4')
    })

    test('get texture from video html element', () => {
      const video = document.createElement('video')
      const texture = getTextureFromProps('Test', { video })
      expect(texture).toBeInstanceOf(PIXI.Texture)
      expect(spy).toBeCalledWith(video)
    })

    test('get no texture', () => {
      expect(() => getTextureFromProps('Test', {})).toThrow('Test could not get texture from props')
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
      DisplayObject.prototype.reactApplyProps.call(instance, { click: fn }, {})
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('click', fn)
    })

    test('call on', () => {
      const spy = jest.spyOn(instance, 'on')
      DisplayObject.prototype.reactApplyProps.call(instance, {}, { click: fn })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('click', fn)
    })

    test('removes old and add new listener', () => {
      DisplayObject.prototype.reactApplyProps.call(instance, {}, { click: fn })

      instance.emit('click', instance)
      instance.emit('click', instance)
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenCalledWith(instance)

      const newFn = jest.fn()
      fn.mockClear()

      DisplayObject.prototype.reactApplyProps.call(instance, { click: fn }, { click: newFn })
      instance.emit('click', instance)
      expect(fn).toHaveBeenCalledTimes(0)
      expect(newFn).toHaveBeenCalledTimes(1)
      expect(newFn).toHaveBeenCalledWith(instance)
    })

    test('prevent teardown/setup on same values', () => {
      const spyAdd = jest.spyOn(instance, 'on')
      const spyRemove = jest.spyOn(instance, 'removeListener')

      DisplayObject.prototype.reactApplyProps.call(instance, {}, { click: fn })

      expect(spyRemove).toHaveBeenCalledTimes(0)
      expect(spyAdd).toHaveBeenCalledTimes(1)

      DisplayObject.prototype.reactApplyProps.call(instance, { click: fn }, { click: fn })

      expect(spyRemove).toHaveBeenCalledTimes(0)
      expect(spyAdd).toHaveBeenCalledTimes(1)

      DisplayObject.prototype.reactApplyProps.call(instance, { click: fn }, { click: () => {} })

      expect(spyRemove).toHaveBeenCalledTimes(1)
      expect(spyAdd).toHaveBeenCalledTimes(2)
    })

    test('invalid instance', () => {
      expect(() => DisplayObject.prototype.reactApplyProps.call()).toThrow('instance needs to be typeof `PIXI.DisplayObject`, got `undefined`')
    })

    test('skip reserved props', () => {
      DisplayObject.prototype.reactApplyProps.call(instance, {}, { children: [1, 2, 3], worldAlpha: 0 })
      expect(instance.children).toEqual([])
      expect(instance.worldAlpha).toEqual(1)
    })

    test('set prop on instance', () => {
      DisplayObject.prototype.reactApplyProps.call(instance, {}, { foo: 'bar', alpha: 0.5 })
      expect(instance.foo).toEqual('bar')
      expect(instance.alpha).toEqual(0.5)
    })

    test('set back to default value', () => {
      instance.alpha = 10
      DisplayObject.prototype.reactApplyProps.call(instance, {}, { alpha: null })
      expect(instance.alpha).toEqual(1)
    })
  })
})
