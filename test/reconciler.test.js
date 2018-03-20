import React from 'react'
import * as PIXI from 'pixi.js'
import { render, roots } from '../src/render'
import hostconfig from '../src/reconciler/hostconfig'
import { Container, Text } from '../src'

jest.mock('../src/reconciler/hostconfig')

describe('reconciler', () => {
  let container = new PIXI.Container()
  const renderInContainer = comp => render(comp, container)

  beforeEach(() => {
    jest.resetAllMocks()

    // create spies of mock functions
    Object.keys(hostconfig).forEach(methodName => {
      const method = hostconfig[methodName]
      if (typeof method === 'function') {
        method.mockImplementation((...args) => {
          return require.requireActual('../src/reconciler/hostconfig').default[methodName](...args)
        })
      }
    })
  })

  afterEach(() => roots.clear())

  describe('single render', () => {
    test('create instances', () => {
      renderInContainer(
        <Container x={0} y={0}>
          <Text text="foo" />
        </Container>
      )

      expect(hostconfig.createInstance).toHaveBeenCalledTimes(2)

      expect(hostconfig.createInstance.mock.calls[0][0]).toEqual('Text')
      expect(hostconfig.createInstance.mock.calls[0][1]).toEqual({ text: 'foo' })
      expect(hostconfig.createInstance.mock.calls[0][2]).toBeInstanceOf(PIXI.Container)

      expect(hostconfig.createInstance.mock.calls[1][0]).toEqual('Container')
      expect(hostconfig.createInstance.mock.calls[1][1]).toHaveProperty('x', 0)
      expect(hostconfig.createInstance.mock.calls[1][1]).toHaveProperty('y', 0)
      expect(hostconfig.createInstance.mock.calls[1][1]).toHaveProperty('children')
      expect(hostconfig.createInstance.mock.calls[1][1].children.type).toEqual('Text')
    })

    test('append children', () => {
      renderInContainer(
        <Container>
          <Text text="bar" />
        </Container>
      )

      expect(hostconfig.appendInitialChild).toHaveBeenCalledTimes(2)
      expect(hostconfig.appendInitialChild.mock.calls[0][1]).toBeInstanceOf(PIXI.Text)
      expect(hostconfig.appendInitialChild.mock.calls[0][0]).toBeInstanceOf(PIXI.Container)
    })

    test('PIXI elements', () => {
      renderInContainer(
        <Container x={10} y={100} pivot={'0.5,0.5'}>
          <Text text="foobar" />
        </Container>
      )

      const container = hostconfig.appendInitialChild.mock.calls[0][0]
      expect(container.x).toEqual(10)
      expect(container.y).toEqual(100)
      expect(container.pivot.x).toEqual(0.5)
      expect(container.pivot.y).toEqual(0.5)

      const text = hostconfig.appendInitialChild.mock.calls[0][1]
      expect(text.text).toEqual('foobar')
    })
  })
})
