import React from 'react'
import * as PIXI from 'pixi.js'
import { createElement, TYPES, TYPES_INJECTED, PixiComponent } from '../src/utils/element'

import { emptyTexture } from './__fixtures__/textures'
import { desyrel } from './__fixtures__/bitmapfonts'
import parseBitmapFont from './__utils__/parseBitmapFont'

parseBitmapFont(desyrel)

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

describe('PixiComponent', () => {
  afterEach(() => {
    Object.keys(TYPES_INJECTED).forEach(k => {
      delete TYPES_INJECTED[k]
    })
  })

  test('type must be defined', () => {
    expect(() => new PixiComponent(null)).toThrow('Expect type to be defined, got `null`')
  })

  test('cannot override existing component', () => {
    expect(() => new PixiComponent('Text', {})).toThrow(
      'Component `Text` could not be created, already exists in default components.'
    )
  })

  test('inject custom component', () => {
    let lifecycle = { create: props => {} }
    new PixiComponent('Rectangle', lifecycle)
    expect(TYPES_INJECTED).toHaveProperty('Rectangle', lifecycle)
  })

  test('create injected component', () => {
    const scoped = jest.fn()

    const lifecycle = {
      create: jest.fn(() => new PIXI.Graphics()),
      didMount: jest.fn(),
      willUnmount: jest.fn(),
      applyProps: jest.fn(function() {
        scoped(this)
      }),
    }

    new PixiComponent('Rectangle', lifecycle)

    const props = { x: 100, y: 200 }
    const element = createElement('Rectangle', props)

    expect(element.didMount).toBeDefined()
    expect(element.willUnmount).toBeDefined()
    expect(element.applyProps).toBeDefined()
    expect(element).toBeInstanceOf(PIXI.Graphics)
    expect(lifecycle.create).toHaveBeenCalledTimes(1)
    expect(lifecycle.create).toHaveBeenCalledWith(props)
    expect(lifecycle.applyProps).toHaveBeenCalledTimes(1)
    expect(scoped).toHaveBeenCalledTimes(1)
    expect(scoped).toHaveBeenCalledWith(element)
  })

  test('create injected component without lifecycle methods', () => {
    new PixiComponent('Rectangle', {
      create: () => new PIXI.Graphics(),
    })

    const element = createElement('Rectangle')
    expect(element.didMount).toBeUndefined()
    expect(element.willUnmount).toBeUndefined()
    expect(element.applyProps).toBeUndefined()
  })
})
