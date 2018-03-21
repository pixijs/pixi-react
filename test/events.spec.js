import React from 'react'
import * as PIXI from 'pixi.js'

import hostconfig from '../src/reconciler/hostconfig'
import { Text, Container, render } from '../src'
import { roots } from '../src/render'
import { mockToSpy } from './__utils__/mock'
import { createElement } from '../src/utils/element'

jest.mock('../src/reconciler/hostconfig')

describe('react', () => {
  let container = new PIXI.Container()
  container.root = true
  const renderInContainer = comp => render(comp, container)

  // keep track of real PIXI instances created
  let instances

  beforeEach(() => {
    jest.resetAllMocks()
    mockToSpy('../src/reconciler/hostconfig')

    instances = []

    hostconfig.createInstance.mockImplementation((...args) => {
      const ins = createElement(...args)
      instances.push(ins)
      return ins
    })
  })

  afterEach(() => roots.clear())

  describe('events', () => {
    test('trigger click event', () => {
      let onClick = jest.fn()
      let text

      renderInContainer(
        <Container>
          <Text ref={c => (text = c)} click={onClick} />
        </Container>
      )

      text.emit('click', { type: 'click', data: 123 })

      expect(text).toBeInstanceOf(PIXI.Text)
      expect(text._eventsCount).toEqual(1)
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick.mock.calls[0][0]).toEqual({ type: 'click', data: 123 })
    })

    test('dispose old event and assign new', () => {
      let onClick = jest.fn()

      renderInContainer(<Text click={onClick} />)
      renderInContainer(<Text click={onClick} />)
      renderInContainer(<Text click={onClick} />)

      instances[0].emit('click', { type: 'click', data: 123 })

      expect(instances).toHaveLength(1)
      expect(instances[0]._eventsCount).toEqual(1)
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })
})
