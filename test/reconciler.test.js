import React, { createRef, Suspense } from 'react'
import * as PIXI from 'pixi.js'
import { render, roots } from '../src/render'
import hostconfig from '../src/reconciler/hostconfig'
import { createElement } from '../src/utils/element'
import { Container, Text } from '../src'
import { getCall, mockToSpy } from './__utils__/mock'

jest.mock('../src/reconciler/hostconfig')

describe('reconciler', () => {
  let container = new PIXI.Container()
  container.root = true
  const renderInContainer = comp => render(comp, container)

  beforeEach(() => {
    jest.clearAllMocks()
    mockToSpy('../src/reconciler/hostconfig')
  })

  afterEach(() => {
    roots.clear()
  })

  describe('single render', () => {
    test('create instances', () => {
      renderInContainer(
        <Container x={0} y={0}>
          <Text text="foo" />
        </Container>
      )

      const m = getCall(hostconfig.createInstance)

      expect(m.fn).toHaveBeenCalledTimes(2)
      expect(m.all.map(([ins]) => ins)).toEqual(['Text', 'Container'])

      const text = m(0)
      expect(text.args[1]).toEqual({ text: 'foo' })
      expect(text.args[2]).toBeInstanceOf(PIXI.Container)

      const container = m(1).args[1]
      expect(container).toHaveProperty('x', 0)
      expect(container).toHaveProperty('y', 0)
      expect(container).toHaveProperty('children')
      expect(container.children.type).toEqual('Text')
    })

    test('append children', () => {
      renderInContainer(
        <Container>
          <Text text="bar" />
        </Container>
      )

      const m = getCall(hostconfig.appendInitialChild)
      expect(m.fn).toHaveBeenCalledTimes(1)
      expect(m(0).args[0]).toBeInstanceOf(PIXI.Container)
      expect(m(0).args[1]).toBeInstanceOf(PIXI.Text)
    })

    test('PIXI elements', () => {
      renderInContainer(
        <Container x={10} y={100} pivot={'0.5,0.5'}>
          <Text text="foobar" />
        </Container>
      )

      const m = getCall(hostconfig.appendInitialChild)(0)

      const container = m.args[0]
      expect(container.x).toEqual(10)
      expect(container.y).toEqual(100)
      expect(container.pivot.x).toEqual(0.5)
      expect(container.pivot.y).toEqual(0.5)

      const text = m.args[1]
      expect(text.text).toEqual('foobar')
    })
  })

  describe('rerender', () => {
    test('remove children', () => {
      renderInContainer(
        <Container>
          <Text text="one" />
          <Text text="two" />
          <Text text="three" />
        </Container>
      )

      renderInContainer(
        <Container>
          <Text text="one" />
        </Container>
      )

      const m = getCall(hostconfig.removeChild)
      expect(m.fn).toHaveBeenCalledTimes(2)
      expect(m.all.map(([_, ins]) => ins.text)).toEqual(['two', 'three'])
    })

    test('remove sub children', () => {
      const a = createRef()
      const b = createRef()
      const c = createRef()
      const d = createRef()

      renderInContainer(
        <Container>
          <Container>
            <Text ref={a} />
            <Text ref={b} />
            <Text ref={c} />
            <Text ref={d} />
          </Container>
        </Container>
      )

      // assign willUnmounts
      const spyA = (a.current['willUnmount'] = jest.fn())
      const spyB = (b.current['willUnmount'] = jest.fn())
      const spyC = (c.current['willUnmount'] = jest.fn())
      const spyD = (d.current['willUnmount'] = jest.fn())

      renderInContainer(<Container />)

      expect(spyA).toHaveBeenCalled()
      expect(spyB).toHaveBeenCalled()
      expect(spyC).toHaveBeenCalled()
      expect(spyD).toHaveBeenCalled()
    })

    test('insert before', () => {
      renderInContainer(
        <Container>
          <Text key={1} text="one" />
          <Text key={3} text="three" />
        </Container>
      )

      renderInContainer(
        <Container>
          <Text key={1} text="one" />
          <Text key={2} text="two" />
          <Text key={3} text="three" />
        </Container>
      )

      const m = getCall(hostconfig.insertBefore)(0)
      expect(m.args[0]).toBeInstanceOf(PIXI.Container) // parent
      expect(m.args[1].text).toEqual('two') // child
      expect(m.args[2].text).toEqual('three') // beforeChild
    })

    test('update elements', () => {
      renderInContainer(
        <Container>
          <Text text="a" />
        </Container>
      )

      renderInContainer(
        <Container>
          <Text text="b" />
        </Container>
      )

      const m = getCall(hostconfig.commitUpdate)
      expect(m.fn).toHaveBeenCalledTimes(1)
      expect(m(0).args[3]).toHaveProperty('text', 'a')
      expect(m(0).args[4]).toHaveProperty('text', 'b')
      expect(m(0).args[0].text).toEqual('b')
    })
  })

  describe('prepare updates', () => {
    test('prevent commitUpdate when prop is not changed, ', () => {
      renderInContainer(<Text x={100} />)
      renderInContainer(<Text x={100} />)

      expect(hostconfig.commitUpdate).not.toBeCalled()
    })

    test('commitUpdate for prop removal', () => {
      renderInContainer(<Text x={100} />)
      renderInContainer(<Text />)

      const m = getCall(hostconfig.commitUpdate)
      expect(m.fn).toHaveBeenCalledTimes(1)

      const args = m(0).args

      expect(args[0]).toBeInstanceOf(PIXI.Text)
      expect(args[1]).toEqual(['x', null])
      expect(args[2]).toEqual('Text')
      expect(args[3]).toEqual({ x: 100 })
      expect(args[4]).toEqual({})
    })

    test('commitUpdate for prop change', () => {
      renderInContainer(<Text x={100} />)
      renderInContainer(<Text x={105} />)

      const m = getCall(hostconfig.commitUpdate)
      expect(m.fn).toHaveBeenCalledTimes(1)

      const args = m(0).args

      expect(args[0]).toBeInstanceOf(PIXI.Text)
      expect(args[1]).toEqual(['x', 105])
      expect(args[2]).toEqual('Text')
      expect(args[3]).toEqual({ x: 100 })
      expect(args[4]).toEqual({ x: 105 })
    })
  })

  describe('custom lifecycles', () => {
    let didMount = jest.fn()
    let willUnmount = jest.fn()
    let applyProps = jest.fn()

    beforeEach(() => {
      hostconfig.createInstance.mockImplementation((...args) => {
        const ins = createElement(...args)
        ins.didMount = (...args) => didMount(...args)
        ins.willUnmount = (...args) => willUnmount(...args)
        ins.applyProps = (...args) => applyProps(...args)
        return ins
      })
    })

    test('didMount', () => {
      renderInContainer(
        <Container>
          <Text />
        </Container>
      )

      expect(didMount).toHaveBeenCalledTimes(2)

      const text = getCall(didMount)(0).args
      expect(text[0]).toBeInstanceOf(PIXI.Text)
      expect(text[1]).toBeInstanceOf(PIXI.Container)
      expect(text[1].root).toBeUndefined()

      const container = getCall(didMount)(1).args
      expect(container[0]).toBeInstanceOf(PIXI.Container)
      expect(container[0].root).toBeUndefined()
      expect(container[1]).toBeInstanceOf(PIXI.Container)
      expect(container[1].root).toEqual(true)
    })

    test('willUnmount', () => {
      renderInContainer(
        <Container>
          <Text />
        </Container>
      )

      renderInContainer(<Container />)

      expect(willUnmount).toHaveBeenCalledTimes(1)

      const m = getCall(willUnmount)(0).args
      expect(m[0]).toBeInstanceOf(PIXI.Text)
      expect(m[1]).toBeInstanceOf(PIXI.Container)
      expect(m[1].root).toBeUndefined()
    })

    test('applyProps', () => {
      renderInContainer(
        <Container>
          <Text />
        </Container>
      )

      renderInContainer(
        <Container>
          <Text x={100} />
        </Container>
      )

      expect(applyProps).toHaveBeenCalledTimes(1)

      const m = getCall(applyProps)

      expect(m(0).args[0]).toBeInstanceOf(PIXI.Text)
      expect(m(0).args[1]).toEqual({})
      expect(m(0).args[2]).toEqual({ x: 100 })
    })

    describe('config', () => {
      const createInstances = config => {
        const instances = []
        hostconfig.createInstance.mockImplementation((...args) => {
          const ins = createElement(...args)
          ins.didMount = (...args) => didMount(...args)
          ins.willUnmount = (...args) => willUnmount(...args)
          ins.applyProps = (...args) => applyProps(...args)
          ins.config = config
          instances.push(ins)
          jest.spyOn(ins, 'destroy')
          return ins
        })
        return instances
      }

      test('destroy', () => {
        const before = createInstances({ destroy: true })
        renderInContainer(<Container />)
        renderInContainer(<></>)
        before.forEach(ins => expect(ins.destroy).toHaveBeenCalled())

        const after = createInstances({ destroy: false })
        renderInContainer(<Container />)
        renderInContainer(<></>)
        after.forEach(ins => expect(ins.destroy).not.toHaveBeenCalled())
      })

      test('destroyChildren', () => {
        const before = createInstances({ destroyChildren: true })
        renderInContainer(
          <Container>
            <Text />
          </Container>
        )
        const spyBefore = jest.spyOn(before[1].children[0], 'destroy')

        renderInContainer(<></>)
        expect(spyBefore).toHaveBeenCalled()

        const after = createInstances({ destroyChildren: false })
        renderInContainer(
          <Container>
            <Text />
          </Container>
        )
        const spyAfter = jest.spyOn(after[1].children[0], 'destroy')

        renderInContainer(<></>)
        expect(spyAfter).not.toHaveBeenCalled()
      })
    })
  })

  describe('suspense', () => {
    let asyncLoaded = false

    beforeEach(() => {
      asyncLoaded = false
    })

    function AsyncText({ ms, text }) {
      if (!asyncLoaded) {
        const promise = new Promise(res => {
          setTimeout(() => {
            asyncLoaded = true
            res()
          }, ms)
        })
        throw promise
      }

      return <Text text={text} />
    }

    test('renders suspense fallback', () => {
      jest.useFakeTimers()

      const loadingTextRef = React.createRef(null)
      const siblingTextRef = React.createRef(null)

      renderInContainer(
        <Suspense fallback={<Text text="loading" ref={loadingTextRef} />}>
          <Text text="hidden" ref={siblingTextRef} />
          <AsyncText ms={500} text="content" />
        </Suspense>
      )

      jest.runAllTimers()

      // loading Text should be rendered
      expect(loadingTextRef.current).toBeDefined()

      // content should be hidden
      const hideInstanceMock = getCall(hostconfig.hideInstance)
      expect(hideInstanceMock.fn).toHaveBeenCalledTimes(1)
      expect(siblingTextRef.current.visible).toEqual(false)
    })

    test('renders suspense content', () => {
      jest.useFakeTimers()

      const siblingTextRef = React.createRef(null)

      renderInContainer(
        <Suspense fallback={<Text text="loading" />}>
          <Text text="A" ref={siblingTextRef} />
          <AsyncText ms={500} text={'content'} />
        </Suspense>
      )

      jest.runAllTimers()

      renderInContainer(
        <Suspense fallback={<Text text="loading" />}>
          <Text text="A" ref={siblingTextRef} />
          <AsyncText ms={500} text={'content'} />
        </Suspense>
      )

      // hidden content should be visible again
      expect(siblingTextRef.current.visible).toEqual(true)

      // sibling text & AsyncText content is unhidden
      const unhideInstanceMock = getCall(hostconfig.unhideInstance)
      expect(unhideInstanceMock.fn).toHaveBeenCalledTimes(2)

      // loading text, sibling text, and async text content were all created
      const createInstanceMock = getCall(hostconfig.createInstance)
      expect(createInstanceMock.all.map(([ins]) => ins)).toEqual(['Text', 'Text', 'Text'])
    })
  })

  describe('emits request render', () => {
    let spy = jest.fn()

    beforeEach(() => {
      spy.mockReset()
      window.addEventListener('__REACT_PIXI_REQUEST_RENDER__', spy)
    })

    afterEach(() => {
      window.removeEventListener('__REACT_PIXI_REQUEST_RENDER__', spy)
    })

    it('receives request events via `window` object', function () {
      renderInContainer(
        <Container>
          <Text text="one" />
        </Container>
      )

      expect(spy).toHaveBeenCalled()
    })
  })
})
