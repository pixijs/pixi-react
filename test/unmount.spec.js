import * as PIXI from 'pixi.js'
import React from 'react'
import { roots } from '../src/render'
import { Text, render, unmountComponentAtNode, Stage } from '../src'

jest.useFakeTimers()

const app = new PIXI.Application()
const element = () => (
  <Stage>
    <Text text="Hello Word!" />
  </Stage>
)

describe('unmount render', () => {
  beforeEach(() => {
    roots.clear()
  })

  test('remove root', () => {
    expect(roots.size).toBe(0)

    render(element, app.stage)
    expect(roots.size).toBe(1)

    unmountComponentAtNode(app.stage)
    expect(roots.size).toBe(0)
  })

  test('unmount component', () => {
    const unmount = jest.fn()

    const App = () => {
      React.useEffect(() => unmount)
      return null
    }

    render(<App />, app.stage)

    unmountComponentAtNode(app.stage)
    jest.advanceTimersByTime(1000)

    expect(unmount).toBeCalledTimes(1)
  })
})
