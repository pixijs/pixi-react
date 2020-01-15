import React from 'react'
import * as PIXI from 'pixi.js'

import hostconfig from '../src/reconciler/hostconfig'
import { Text, Container, render, eventHandlers } from '../src'
import { roots } from '../src/render'
import { mockToSpy } from './__utils__/mock'
import { createElement } from '../src/utils/element'

jest.mock('../src/reconciler/hostconfig')

const CUSTOM_EVENT = 'customEvent'
const NOT_CUSTOM_EVENT = 'notCustomEvent'

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

  afterEach(() => {
    roots.clear()
    const index = eventHandlers.indexOf(CUSTOM_EVENT)
    if (index >= 0) eventHandlers.splice(index, 1)
  })

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

    test('custom events', () => {
      let text
      let onCustomEvent = jest.fn()
      let onNotCustomEvent = jest.fn()

      eventHandlers.push(CUSTOM_EVENT)

      renderInContainer(
        <Text ref={c => (text = c)} {...{[CUSTOM_EVENT]: onCustomEvent }} />
      )

      const customEvent = { type: CUSTOM_EVENT, data: 456 }

      text.emit(CUSTOM_EVENT, customEvent)

      expect(text._eventsCount).toEqual(1)
      expect(onCustomEvent).toHaveBeenCalledTimes(1)
      expect(onCustomEvent).toHaveBeenCalledWith(customEvent)

      renderInContainer(
        <Text ref={c => (text = c)} {...{[NOT_CUSTOM_EVENT]: onNotCustomEvent }} />
      )

      text.emit(NOT_CUSTOM_EVENT, { type: NOT_CUSTOM_EVENT, data: 789 })

      expect(onNotCustomEvent).toHaveBeenCalledTimes(0)
    })
  })
})
