import React from 'react'
import { roots, createRoot } from '../src/render'
import { PixiFiber, AppConsumer, AppProvider, Container, Text, withPixiApp, Stage } from '../src'
import { ConcurrentRoot } from 'react-reconciler/constants'
import * as PIXI from 'pixi.js'

const act = React.unstable_act

const Element = () => <Text text="Hello Word!" />
const stageElement = () => (
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
  let app
  let container
  beforeAll(() => {
    app = new PIXI.Application()
    container = app.stage
  })

  afterAll(() => {
    app.destroy()
  })

  beforeEach(() => {
    roots.clear()
    jest.clearAllMocks()

    PixiFiber.createContainer.mockReturnValue({ current: { child: { tag: 'TEXT' } } })
    PixiFiber.updateContainer.mockImplementation((element, root, _) => {})
  })

  test('invariant container', () => {
    expect(() => createRoot(null)).toThrow('Invalid argument `container`, expected instance of `PIXI.Container`')
  })

  test('call createContainer', () => {
    const root = createRoot(container)
    expect(PixiFiber.createContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.createContainer).toHaveBeenLastCalledWith(container, ConcurrentRoot, false, null)
  })

  test('call updateContainer', () => {
    const root = createRoot(container)
    act(() => root.render(<Element />))
    const fiber = roots.values().next().value

    expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.updateContainer).toHaveBeenLastCalledWith(expect.anything(), fiber, undefined)
  })

  test('store root', () => {
    createRoot(container)
    expect(roots.values().next().value).toEqual({ current: { child: { tag: 'TEXT' } } })
  })

  // TODO Should we test without invariant?
  // test('does not create root if it is already present', () => {
  //   const root = { current: { child: { tag: 'CUSTOM' } } }
  //   roots.set(canvas, root)

  //   const _root = createRoot(container)
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

      const root = createRoot(container)
      act(() =>
        root.render(
          <AppProvider value={app}>
            <Container>
              <AppConsumer>{fn}</AppConsumer>
            </Container>
          </AppProvider>
        )
      )

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(app)
    })

    test('via `withPixiApp`', () => {
      const Fn = jest.fn(({ app: _ }) => <Text text="hi" />)
      const Comp = withPixiApp(({ app }) => <Fn app={app} />)

      const root = createRoot(container)
      act(() =>
        root.render(
          <AppProvider value={app}>
            <Container>
              <Comp />
            </Container>
          </AppProvider>
        )
      )

      expect(Fn).toHaveBeenCalledTimes(1)
      expect(Fn).toHaveBeenCalledWith(expect.objectContaining({ app }), expect.anything())
    })
  })
})
