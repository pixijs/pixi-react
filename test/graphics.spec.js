import React from 'react'
import * as PIXI from 'pixi.js'
import renderer from 'react-test-renderer'
import * as reactTest from '@testing-library/react'
import { PixiFiber } from '../src'
import { Container, Stage, Text, Graphics } from '../src'
import { Context } from '../src/stage/provider'
import { getCanvasProps } from '../src/stage'
import { mockToSpy } from './__utils__/mock'

jest.mock('../src/reconciler')
jest.useFakeTimers()

describe('graphics', () => {
  beforeEach(() => {
    window.matchMedia.mockClear()
    jest.clearAllMocks()
    mockToSpy('../src/reconciler')
  })

  test.skip('renders a graphics component with draw prop', () => {
    const spy = jest.fn()
    const tree = renderer.create(
        <Stage>
            <Graphics draw={spy} />
        </Stage>
    ).toJSON();
    expect(tree).toMatchSnapshot()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test.skip('renders a graphics component with geometry prop', () => {
    const spy = jest.fn()
    const geometry = <Graphics draw={spy} />
    const tree = renderer.create(
        <Stage>
            <Graphics geometry={geometry} />
            <Graphics geometry={geometry} />
        </Stage>
    ).toJSON();
    expect(tree).toMatchSnapshot()
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
