import * as PIXI from 'pixi.js'
import React from 'react'
import { roots } from '../src/render'
import { PixiFiber, render, AppConsumer, AppProvider, Container, Text, withPixiApp, Stage } from '../src'

const app = new PIXI.Application()
const callback = jest.fn()
const element = () => (
  <Stage>
    <Text text="Hello Word!" />
  </Stage>
)

jest.mock('../src/reconciler', () => ({
  ...jest.requireActual('../src/reconciler'),
  PixiFiber: {
    ...jest.requireActual('../src/reconciler').PixiFiber,
    createContainer: jest.fn(),
    updateContainer: jest.fn(),
    getPublicInstance: jest.fn(),
    injectIntoDevTools: jest.fn(),
  },
}))

describe('render', () => {
  beforeEach(() => {
    roots.clear()
    jest.clearAllMocks()

    PixiFiber.createContainer.mockReturnValue({ current: { child: { tag: 'TEXT' } } })
    PixiFiber.updateContainer.mockImplementation((element, root, _, c) => c())
  })

  test('invariant container', () => {
    expect(() => render('something', null)).toThrow(
      'Invalid argument `container`, expected instance of `PIXI.Container`'
    )
  })

  test('call createContainer', () => {
    render(element, app.stage, callback)
    expect(PixiFiber.createContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.createContainer).toHaveBeenLastCalledWith(app.stage)
  })

  test('call updateContainer', () => {
    render(element, app.stage, callback)
    const root = roots.values().next().value

    expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.updateContainer).toHaveBeenLastCalledWith(element, root, undefined, callback)
  })

  test('invoke callback in updateContainer', () => {
    render(element, app.stage, callback)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('store root', () => {
    render(element, app.stage, callback)
    expect(roots.values().next().value).toEqual({ current: { child: { tag: 'TEXT' } } })
  })

  test('does not create root if it is already present', () => {
    const root = { current: { child: { tag: 'CUSTOM' } } }
    roots.set(app.stage, root)

    render(element, app.stage, callback)
    expect(PixiFiber.createContainer).toHaveBeenCalledTimes(0)
  })

  describe('passdown `PIXI.Application`', () => {
    beforeEach(() => {
      const PF = jest.requireActual('../src/reconciler').PixiFiber

      PixiFiber.createContainer.mockImplementation(PF.createContainer)
      PixiFiber.updateContainer.mockImplementation(PF.updateContainer)
    })

    test('via `AppConsumer`', () => {
      const fn = jest.fn(() => <Text text="hi" />)

      render(
        <AppProvider value={app}>
          <Container>
            <AppConsumer>{fn}</AppConsumer>
          </Container>
        </AppProvider>,
        app.stage,
        callback
      )

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(app)
    })

    test('via `withPixiApp`', () => {
      const fn = jest.fn(() => <Text text="hi" />)
      const Comp = withPixiApp(({ app }) => fn(app))

      render(
        <AppProvider value={app}>
          <Container>
            <Comp />
          </Container>
        </AppProvider>,
        app.stage,
        callback
      )

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(app)
    })
  })
})
