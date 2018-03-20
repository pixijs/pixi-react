import React from 'react'
import * as PIXI from 'pixi.js'
import { createElement, TYPES } from '../src/utils/element'

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
