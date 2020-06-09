import * as PIXI from 'pixi.js'
import React from 'react'
import Stage from '../src/stage'
import { AppConsumer, AppProvider, Container, Text, withPixiApp } from '../src'
import { render, roots } from '../src/render'
import { PACKAGE_NAME, PixiFiber, REACT_DOM_VERSION } from '../src/reconciler'

const app = new PIXI.Application()
const callback = jest.fn()
const element = () => (
  <Stage>
    <Text text="Hello Word!" />
  </Stage>
)

jest.mock('../src/reconciler')

describe('render', () => {
  let spies

  beforeEach(() => {
    roots.clear()
    jest.resetAllMocks()

    spies = {
      createContainer: jest.fn(),
      updateContainer: jest.fn(),
      getPublicInstance: jest.fn(),
      injectIntoDevTools: jest.fn(),
    }

    PixiFiber.mockImplementation(() => ({ ...jest.requireActual('../src/reconciler').PixiFiber(), ...spies }))

    spies.createContainer.mockReturnValue({ current: { child: { tag: 'TEXT' } } })
    spies.updateContainer.mockImplementation((element, root, _, c) => c())
  })

  test('invariant container', () => {
    expect(() => render('something', null)).toThrow(
      'Invalid argument `container`, expected instance of `PIXI.Container`'
    )
  })

  test('call createContainer', () => {
    render(element, app.stage, callback)
    expect(spies.createContainer).toHaveBeenCalledTimes(1)
    expect(spies.createContainer).toHaveBeenLastCalledWith(app.stage)
  })

  test('call updateContainer', () => {
    render(element, app.stage, callback)
    const root = roots.values().next().value

    expect(spies.updateContainer).toHaveBeenCalledTimes(1)
    expect(spies.updateContainer).toHaveBeenLastCalledWith(element, root, undefined, callback)
  })

  test('call injectDevtools', () => {
    render(element, app.stage, callback)

    expect(spies.injectIntoDevTools).toHaveBeenCalledTimes(1)
    expect(spies.injectIntoDevTools.mock.calls).toMatchSnapshot()
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
    expect(spies.createContainer).toHaveBeenCalledTimes(0)
  })

  describe('passdown `PIXI.Application`', () => {
    beforeEach(() => {
      const pf = jest.requireActual('../src/reconciler').PixiFiber()
      spies.createContainer.mockImplementation(pf.createContainer)
      spies.updateContainer.mockImplementation(pf.updateContainer)
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
