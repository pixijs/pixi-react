import React from 'react'
import * as PIXI from 'pixi.js'
import { render, roots } from '../src/render'
import hostconfig from '../src/reconciler/hostconfig'
import { Container, Text } from '../src'
import { getCall, mockToSpy } from './__utils__/mock'

jest.mock('../src/reconciler/hostconfig')

describe('reconciler', () => {
  let container = new PIXI.Container()
  const renderInContainer = comp => render(comp, container)

  beforeEach(() => {
    jest.resetAllMocks()
    mockToSpy('../src/reconciler/hostconfig')
  })

  afterEach(() => roots.clear())

  describe('single render', () => {
    test('create instances', () => {
      renderInContainer(
        <Container x={0} y={0}>
          <Text text="foo" />
        </Container>
      )

      const m = getCall(hostconfig.createInstance)

      expect(m.fn).toHaveBeenCalledTimes(2)
      expect(m.all.map(([ins]) => ins)).toEqual(['Text', 'Container'])

      const text = m(0)
      expect(text.args[1]).toEqual({ text: 'foo' })
      expect(text.args[2]).toBeInstanceOf(PIXI.Container)

      const container = m(1).args[1]
      expect(container).toHaveProperty('x', 0)
      expect(container).toHaveProperty('y', 0)
      expect(container).toHaveProperty('children')
      expect(container.children.type).toEqual('Text')
    })

    test('append children', () => {
      renderInContainer(
        <Container>
          <Text text="bar" />
        </Container>
      )

      const m = getCall(hostconfig.appendInitialChild)
      expect(m.fn).toHaveBeenCalledTimes(2)
      expect(m(0).args[0]).toBeInstanceOf(PIXI.Container)
      expect(m(0).args[1]).toBeInstanceOf(PIXI.Text)
    })

    test('PIXI elements', () => {
      renderInContainer(
        <Container x={10} y={100} pivot={'0.5,0.5'}>
          <Text text="foobar" />
        </Container>
      )

      const m = getCall(hostconfig.appendInitialChild)(0)

      const container = m.args[0]
      expect(container.x).toEqual(10)
      expect(container.y).toEqual(100)
      expect(container.pivot.x).toEqual(0.5)
      expect(container.pivot.y).toEqual(0.5)

      const text = m.args[1]
      expect(text.text).toEqual('foobar')
    })
  })

  describe('rerender', () => {
    test('remove children', () => {
      renderInContainer(
        <Container>
          <Text text="one" />
          <Text text="two" />
          <Text text="three" />
        </Container>
      )

      renderInContainer(
        <Container>
          <Text text="one" />
        </Container>
      )

      const m = getCall(hostconfig.mutation.removeChild)
      expect(m.fn).toHaveBeenCalledTimes(2)
      expect(m.all.map(([_, ins]) => ins.text)).toEqual(['two', 'three'])
    })
  })

  test('insert before', () => {
    renderInContainer(
      <Container>
        <Text key={1} text="one" />
        <Text key={3} text="three" />
      </Container>
    )

    renderInContainer(
      <Container>
        <Text key={1} text="one" />
        <Text key={2} text="two" />
        <Text key={3} text="three" />
      </Container>
    )

    const m = getCall(hostconfig.mutation.insertBefore)(0)
    expect(m.args[0]).toBeInstanceOf(PIXI.Container) // parent
    expect(m.args[1].text).toEqual('two') // child
    expect(m.args[2].text).toEqual('three') // beforeChild
  })
})
