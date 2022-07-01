import React from 'react'
import { roots } from '../src/render'
import { PixiFiber, createRoot, AppConsumer, AppProvider, Container, Text, withPixiApp, Stage } from '../src'
import { ConcurrentRoot } from 'react-reconciler/constants'

const Element = () => <Text text="Hello Word!" />
const stageElement = () => (
  <Stage>
    <Text text="Hello Word!" />
  </Stage>
)
const canvas = document.createElement('canvas')

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
    PixiFiber.updateContainer.mockImplementation((element, root, _) => {})
  })

  test('invariant container', () => {
    expect(() => createRoot(null)).toThrow('Invalid argument `container`, expected instance of `HTMLCanvasElement`')
  })

  test('call createContainer', () => {
    const root = createRoot(canvas)
    const app = root.render(<Element />)
    expect(PixiFiber.createContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.createContainer).toHaveBeenLastCalledWith(app.stage, ConcurrentRoot, false, null)
  })

  test('call updateContainer', () => {
    const root = createRoot(canvas)
    root.render(<Element />)
    const fiber = roots.values().next().value

    expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.updateContainer).toHaveBeenLastCalledWith(expect.anything(), fiber, undefined)
  })

  test('store root', () => {
    createRoot(canvas)
    expect(roots.values().next().value).toEqual({ current: { child: { tag: 'TEXT' } } })
  })

  // TODO Should we test without invariant?
  // test('does not create root if it is already present', () => {
  //   const root = { current: { child: { tag: 'CUSTOM' } } }
  //   roots.set(canvas, root)

  //   const _root = createRoot(canvas)
  //   expect(PixiFiber.createContainer).toHaveBeenCalledTimes(0)
  // })

  describe('passdown `PIXI.Application`', () => {
    beforeEach(() => {
      const PF = jest.requireActual('../src/reconciler').PixiFiber

      PixiFiber.createContainer.mockImplementation(PF.createContainer)
      PixiFiber.updateContainer.mockImplementation(PF.updateContainer)
    })

    test('via `AppConsumer`', () => {
      const fn = jest.fn(() => <Text text="hi" />)

      const root = createRoot(canvas)
      const app = root.render(
        <Container>
          <AppConsumer>{fn}</AppConsumer>
        </Container>
      )

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(app)
    })

    test('via `withPixiApp`', () => {
      const Fn = jest.fn(({ app: _ }) => <Text text="hi" />)
      const Comp = withPixiApp(({ app }) => <Fn app={app} />)

      const root = createRoot(canvas)
      const app = root.render(
        <Container>
          <Comp />
        </Container>
      )

      expect(Fn).toHaveBeenCalledTimes(1)
      expect(Fn).toHaveBeenCalledWith(expect.objectContaining({ app }))
    })
  })
})
