import React from 'react'
import * as PIXI from 'pixi.js'

import hostconfig from '../src/reconciler/hostconfig'
import { createElement } from '../src/utils/element'
import { Text, Container, eventHandlers } from '../src'
import { createRoot } from '../src/render'
import { mockToSpy } from './__utils__/mock'

const CUSTOM_EVENT = 'customEvent'
const NOT_CUSTOM_EVENT = 'notCustomEvent'

jest.mock('../src/reconciler/hostconfig')

const act = React.unstable_act

describe('react', () => {
  let container = new PIXI.Container()
  container.root = true
  let root

  // render in container
  const renderInContainer = comp => root.render(comp)

  // keep track of real PIXI instances created
  let instances = []

  beforeEach(() => {
    instances = []
    jest.clearAllMocks()
    mockToSpy('../src/reconciler/hostconfig')
    root = createRoot(container)

    hostconfig.createInstance.mockImplementation((...args) => {
      const ins = createElement(...args)
      instances.push(ins)
      return ins
    })
  })

  afterEach(() => {
    root.unmount()
    const index = eventHandlers.indexOf(CUSTOM_EVENT)
    if (index >= 0) eventHandlers.splice(index, 1)
  })

  describe('events', () => {
    test('trigger click event', () => {
      let onClick = jest.fn()
      let text

      act(() =>
        renderInContainer(
          <Container>
            <Text ref={c => (text = c)} click={onClick} />
          </Container>
        )
      )

      text.emit('click', { type: 'click', data: 123 })

      expect(text).toBeInstanceOf(PIXI.Text)
      expect(text._eventsCount).toEqual(1)
      expect(onClick).toHaveBeenCalledTimes(1)
      expect(onClick.mock.calls[0][0]).toEqual({ type: 'click', data: 123 })
    })

    test('dispose old event and assign new', () => {
      let onClick = jest.fn()

      act(() => {
        renderInContainer(<Text click={onClick} />)
        renderInContainer(<Text click={onClick} />)
        renderInContainer(<Text click={onClick} />)
      })

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

      act(() => renderInContainer(<Text ref={c => (text = c)} {...{ [CUSTOM_EVENT]: onCustomEvent }} />))

      const customEvent = { type: CUSTOM_EVENT, data: 456 }

      text.emit(CUSTOM_EVENT, customEvent)

      expect(text._eventsCount).toEqual(1)
      expect(onCustomEvent).toHaveBeenCalledTimes(1)
      expect(onCustomEvent).toHaveBeenCalledWith(customEvent)

      act(() => renderInContainer(<Text ref={c => (text = c)} {...{ [NOT_CUSTOM_EVENT]: onNotCustomEvent }} />))

      text.emit(NOT_CUSTOM_EVENT, { type: NOT_CUSTOM_EVENT, data: 789 })

      expect(onNotCustomEvent).toHaveBeenCalledTimes(0)
    })
  })
})
