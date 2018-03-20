import React from 'react'
import * as PIXI from 'pixi.js'
import { render, roots } from '../src/render'
import { createElement } from '../src/utils/element'
import {
  appendChild,
  removeChild,
  insertBefore,
  shouldDeprioritizeSubtree,
  prepareUpdate,
  commitUpdate,
} from '../src/reconciler'
import { Container, Text } from '../src'

jest.mock('../src/utils/element', () => ({
  ...require.requireActual('../src/utils/element'),
  createElement: jest.fn(),
}))

jest.mock('../src/reconciler', () => ({
  ...require.requireActual('../src/reconciler'),
  appendChild: jest.fn(),
  removeChild: jest.fn(),
  insertBefore: jest.fn(),
  shouldDeprioritizeSubtree: jest.fn(),
  prepareUpdate: jest.fn(),
  commitUpdate: jest.fn(),
}))

describe('reconciler', () => {
  let container = new PIXI.Container()
  const renderInContainer = comp => render(comp, container)

  const mockActual = (fnName, path, fn) => {
    fn.mockImplementation((...args) => require.requireActual(path)[fnName](...args))
  }

  beforeEach(() => {
    jest.resetAllMocks()
    mockActual('createElement', '../src/utils/element', createElement)
    mockActual('appendChild', '../src/utils/reconciler', appendChild)
    mockActual('removeChild', '../src/utils/reconciler', removeChild)
    mockActual('insertBefore', '../src/utils/reconciler', insertBefore)
    mockActual('shouldDeprioritizeSubtree', '../src/utils/reconciler', shouldDeprioritizeSubtree)
    mockActual('prepareUpdate', '../src/utils/reconciler', prepareUpdate)
    mockActual('commitUpdate', '../src/utils/reconciler', commitUpdate)
  })

  afterEach(() => {
    roots.clear()
  })

  test.only('create instances', () => {
    renderInContainer(
      <Container x={0} y={0}>
        <Text text="foo" />
      </Container>
    )

    expect(createElement).toHaveBeenCalledTimes(2)

    expect(createElement.mock.calls[0][0]).toEqual('Text')
    expect(createElement.mock.calls[0][1]).toEqual({ text: 'foo' })
    expect(createElement.mock.calls[0][2]).toBeInstanceOf(PIXI.Container)

    expect(createElement.mock.calls[1][0]).toEqual('Container')
    expect(createElement.mock.calls[1][1]).toHaveProperty('x', 0)
    expect(createElement.mock.calls[1][1]).toHaveProperty('y', 0)
    expect(createElement.mock.calls[1][1]).toHaveProperty('children')
    expect(createElement.mock.calls[1][1].children.type).toEqual('Text')
  })

  test('append children', () => {})
})
