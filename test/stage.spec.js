import React from 'react'
import * as PIXI from 'pixi.js'
import renderer from 'react-test-renderer'
import { PixiFiber } from '../src/reconciler'
import { runningInBrowser } from '../src/helpers'
import { Stage, Container, Text } from '../src'
import { mockToSpy } from './__utils__/mock'

jest.mock('../src/helpers', () => ({
  ...require.requireActual('../src/helpers'),
  runningInBrowser: jest.fn(),
}))

jest.mock('../src/reconciler')

describe.only('stage', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockToSpy('../src/reconciler')
    runningInBrowser.mockImplementation(() => true)
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

  test('invariant options.view', () => {
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
    const el = renderer.create(<Stage onMount={spy} />)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0]).toHaveLength(1)
    expect(spy.mock.calls[0][0]).toBeInstanceOf(PIXI.CanvasRenderer)
  })

  test('can be unmounted', () => {
    const el = renderer.create(<Stage />)
    const instance = el.getInstance()

    jest.spyOn(instance, 'componentWillUnmount')

    el.unmount()
    expect(instance.componentWillUnmount).toBeCalled()
  })

  test('call PixiFiber.createContainer on componentDidMount', () => {
    const el = renderer.create(<Stage />)
    const stage = el.getInstance().app.stage

    expect(PixiFiber.createContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.createContainer).toHaveBeenCalledWith(stage)
  })

  test('call PixiFiber.updateContainer on componentDidMount', () => {
    PixiFiber.updateContainer.mockClear()

    const el = renderer.create(
      <Stage>
        <Text text="Hello World!" />
      </Stage>
    )

    const instance = el.getInstance()

    expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1)
    expect(PixiFiber.updateContainer).toHaveBeenCalledWith(<Text text="Hello World!" />, instance.mountNode, instance)
  })
})
