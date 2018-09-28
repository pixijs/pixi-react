import React from 'react'
import * as PIXI from 'pixi.js'
import renderer from 'react-test-renderer'
import { PixiFiber, PACKAGE_NAME, VERSION } from '../src/reconciler'
import { runningInBrowser } from '../src/helpers'
import { Stage, AppConsumer, withPixiApp, Container, Text } from '../src'
import { Context } from '../src/stage/provider'
import { getCanvasProps } from '../src/stage'
import { mockToSpy } from './__utils__/mock'

jest.mock('../src/helpers', () => ({
  ...require.requireActual('../src/helpers'),
  runningInBrowser: jest.fn(),
}))

jest.mock('../src/reconciler')

describe('stage', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockToSpy('../src/reconciler')
    runningInBrowser.mockImplementation(() => true)
  })

  test('filter out reserved props from getCanvasProps', () => {
    const props = {
      children: [],
      options: { foo: 'bar', bar: 'foo' },
      raf: true,
      onMount: () => {},
      width: 100,
      height: 400,
    }
    expect(getCanvasProps(props)).toEqual({})
  })

  test('prop types', () => {
    expect(Stage.propTypes).toMatchSnapshot()
    expect(Stage.defaultProps).toMatchSnapshot()
  })

  test('prevent mount when window is not found', () => {
    runningInBrowser.mockImplementation(() => false)
    expect(() => renderer.create(<Stage />)).toThrow('Cannot mount Stage, window object is not defined')
  })

  test('renders a canvas element', () => {
    const tree = renderer.create(<Stage />).toJSON()
    expect(tree).toHaveProperty('type', 'canvas')
    expect(tree).toMatchSnapshot()
  })

  test('renders null if view is passed in options', () => {
    const options = {
      view: document.createElement('canvas'),
    }
    const tree = renderer.create(<Stage options={options} />).toJSON()
    expect(tree).toBeNull()
  })

  test('validate options.view', () => {
    const options = { view: 123 }
    expect(() => renderer.create(<Stage options={options} />).toJSON()).toThrow(
      'options.view needs to be a `HTMLCanvasElement`'
    )
  })

  test('passes props to canvas element', () => {
    const id = 'stage'
    const className = 'canvas__element'
    const style = { border: '1px solid red' }
    const dataAttr = 'something'
    const tree = renderer.create(<Stage className={className} id={id} style={style} data-attr={dataAttr} />).toJSON()
    expect(tree.props).toEqual({ className, id, style, 'data-attr': dataAttr })
  })

  test('does not pass reserved props to renderer canvas element', () => {
    const options = { backgroundColor: 0xff0000 }
    const tree = renderer.create(<Stage height={500} width={500} options={options} />).toJSON()
    expect(tree).toHaveProperty('type', 'canvas')
    expect(tree.props).toEqual({})
  })

  test('creates a PIXI.Application with passed options', () => {
    const el = renderer.create(<Stage width={100} height={50} options={{ backgroundColor: 0xff0000 }} />)
    const app = el.getInstance().app

    expect(app.stage).toBeInstanceOf(PIXI.Container)
    expect(app).toBeInstanceOf(PIXI.Application)
    expect(app._options).toMatchObject({
      backgroundColor: 0xff0000,
      width: 100,
      height: 50,
    })
  })

  test('resize renderer when dimensions change', () => {
    const el = renderer.create(<Stage width={100} height={100} />)
    const app = el.getInstance().app

    expect(app.renderer).toHaveProperty('width', 100)
    expect(app.renderer).toHaveProperty('height', 100)

    el.update(<Stage width={1000} height={100} />)
    expect(app.renderer).toHaveProperty('width', 1000)
    expect(app.renderer).toHaveProperty('height', 100)

    el.update(<Stage width={1000} height={1000} />)
    expect(app.renderer).toHaveProperty('width', 1000)
    expect(app.renderer).toHaveProperty('height', 1000)

    el.update(<Stage width={100} height={100} />)
    expect(app.renderer).toHaveProperty('width', 100)
    expect(app.renderer).toHaveProperty('height', 100)
  })

  test('call onMount()', () => {
    const spy = jest.fn()
    renderer.create(<Stage onMount={spy} />)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0]).toHaveLength(1)
    expect(spy.mock.calls[0][0]).toBeInstanceOf(PIXI.Application)
  })

  test('can be unmounted', () => {
    const el = renderer.create(<Stage />)
    const instance = el.getInstance()

    jest.spyOn(instance, 'componentWillUnmount')

    el.unmount()
    expect(instance.componentWillUnmount).toBeCalled()
  })

  test('destroys application on unmount', () => {
    const el = renderer.create(<Stage />)
    const instance = el.getInstance()

    jest.spyOn(instance.app, 'destroy')

    el.unmount()
    expect(instance.app.destroy).toBeCalled()
  })

  test('call PixiFiber.createContainer on componentDidMount', () => {
    const el = renderer.create(<Stage />)
    const stage = el.getInstance().app.stage

    expect(PixiFiber.createContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.createContainer).toHaveBeenCalledWith(stage)
  })

  test('call PixiFiber.updateContainer on componentDidMount', () => {
    const el = renderer.create(
      <Stage>
        <Text text="Hello World!" />
      </Stage>
    )

    const instance = el.getInstance()

    expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.updateContainer).toHaveBeenCalledWith(
      <Context.Provider value={instance.app}>
        <Text text="Hello World!" />
      </Context.Provider>, instance.mountNode, instance)
  })

  test('call PixiFiber.injectIntoDevtools on componentDidMount', () => {
    renderer.create(<Stage />)

    expect(PixiFiber.injectIntoDevTools).toHaveBeenCalledTimes(1)
    expect(PixiFiber.injectIntoDevTools).toHaveBeenCalledWith(
      expect.objectContaining({
        findHostInstanceByFiber: PixiFiber.findHostInstance,
        bundleType: 1,
        version: VERSION,
        rendererPackageName: PACKAGE_NAME,
      })
    )
  })

  test('call PixiFiber.updateContainer on componentDidUpdate', () => {
    const el = renderer.create(<Stage />)

    PixiFiber.updateContainer.mockClear()
    el.update(<Stage />)

    expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1)
  })

  test('call PixiFiber.updateContainer on componentWillUnmount', () => {
    const el = renderer.create(<Stage />)
    const instance = el.getInstance()

    PixiFiber.updateContainer.mockClear()
    el.unmount()

    expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.updateContainer).toHaveBeenCalledWith(null, instance.mountNode, instance)
  })

  describe('pixi application', () => {
    test('ticker running on mount', async () => {
      const el = renderer.create(<Stage />)
      const app = el.getInstance().app
      expect(app.ticker.started).toBeTruthy()
    })

    test('ticker not running on mount with prop raf to false', async () => {
      const el = renderer.create(<Stage raf={false} />)
      const app = el.getInstance().app
      expect(app.ticker.started).toBeFalsy()
    })

    test('ticker to be toggable', async () => {
      const el = renderer.create(<Stage raf={false} />)
      const app = el.getInstance().app
      expect(app.ticker.started).toBeFalsy()

      el.update(<Stage raf={true} />)
      expect(app.ticker.started).toBeTruthy()

      el.update(<Stage raf={false} />)
      expect(app.ticker.started).toBeFalsy()
    })

    test('render stage on component update with raf to false', () => {
      const el = renderer.create(<Stage raf={false} />)
      const app = el.getInstance().app

      jest.spyOn(app.renderer, 'render')
      el.update(<Stage raf={false} />)

      expect(app.renderer.render).toHaveBeenCalledTimes(1)
    })

    test('not render stage on component update with renderOnComponentChange to false', () => {
      const el = renderer.create(<Stage raf={false} renderOnComponentChange={false} />)
      const app = el.getInstance().app

      jest.spyOn(app.renderer, 'render')
      el.update(<Stage raf={false} renderOnComponentChange={false} />)

      expect(app.renderer.render).not.toHaveBeenCalled()
    })
  })

  describe('provider', () => {
    test('pass down app to child component', () => {
      const fn = jest.fn(() => <Container />)
      const el = renderer.create(
        <Stage>
          <Container>
            <Container>
              <Container>
                <AppConsumer>{fn}</AppConsumer>
              </Container>
            </Container>
          </Container>
        </Stage>
      )

      const instance = el.getInstance()

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(instance.app)
    })
  })

  describe('provider as a higher order component', () => {
    test('pass down app to child component', () => {
      const fn = jest.fn(() => <Container />)
      const Comp = withPixiApp(({ app }) => fn(app))

      const el = renderer.create(
        <Stage>
          <Container>
            <Comp />
          </Container>
        </Stage>
      )

      const instance = el.getInstance()

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(instance.app)
    })
  })
})
