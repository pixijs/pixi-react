import * as PIXI from 'pixi.js'
import React from 'react'
import Stage from '../src/stage'
import { Text } from '../src'
import { render, renderFromComponent, roots } from '../src/render'
import { PixiFiber, VERSION, PACKAGE_NAME } from '../src/reconciler'

const app = new PIXI.Application()
const callback = jest.fn()
const element = () => (
  <Stage>
    <Text text="Hello Word!" />
  </Stage>
)

jest.mock('../src/reconciler', () => ({
  PixiFiber: {
    ...require.requireActual('../src/reconciler').PixiFiber,
    createContainer: jest.fn(),
    updateContainer: jest.fn(),
    getPublicInstance: jest.fn(),
    injectIntoDevTools: jest.fn(),
  },
}))

describe('render', () => {
  beforeEach(() => {
    roots.clear()
    jest.resetAllMocks()
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

  test('call injectDevtools', () => {
    render(element, app.stage, callback)

    expect(PixiFiber.injectIntoDevTools).toHaveBeenCalledTimes(1)
    expect(PixiFiber.injectIntoDevTools).toHaveBeenLastCalledWith(
      expect.objectContaining({
        bundleType: 1,
        version: VERSION,
        rendererPackageName: PACKAGE_NAME,
        findFiberByHostInstance: PixiFiber.findFiberByHostInstance,
      })
    )
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
})
