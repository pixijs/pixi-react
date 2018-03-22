import React from 'react'
import PropTypes from 'prop-types'
import renderer from 'react-test-renderer'
import * as context from '../src/context'

describe('context', () => {
  beforeEach(() => context.clearContext())
  afterEach(() => context.clearContext())

  describe('create Context', () => {
    test('uninitialized', () => {
      expect(context.Context).toBeUndefined()
    })

    test('initialize', () => {
      context.createContext()
      expect(context.Context).toBeDefined()
      expect(require('../src/context').Context).toBeDefined()
    })

    test('clear context', () => {
      context.createContext()
      expect(require('../src/context').Context).toBeDefined()

      context.clearContext()
      expect(require('../src/context').Context).toBeUndefined()
    })
  })

  describe('create Provider', () => {
    test('Provider based on react 16.3+ context api', () => {
      context.createContext()
      const provider = context.createProvider()

      expect(context.Context).toBe(provider)
      expect(require('../src/context').Context).toBe(provider)
    })

    test('Provider based on older context api -> use hoc', () => {
      context.clearContext()
      const provider = context.createProvider()
      expect(provider).toHaveProperty('displayName', 'PixiAppProvider')
    })
  })

  describe('react implementaion', () => {
    let Provider
    let Consumer

    const run = () => {
      const el = renderer.create(
        <Provider value={'pixi-app'}>
          <div>
            <div>
              <Consumer>{app => app}</Consumer>
            </div>
          </div>
        </Provider>
      )

      expect(el.toJSON()).toEqual({
        type: 'div',
        props: {},
        children: [
          {
            type: 'div',
            props: {},
            children: ['pixi-app'],
          },
        ],
      })
    }

    describe('react 16.3+', () => {
      beforeEach(() => {
        Provider = context.createContext().Provider
        Consumer = context.createProvider()
      })

      test('provide value to consumer', run)
    })

    describe('react < 16.3+', () => {
      beforeEach(() => {
        class ProviderComponent extends React.Component {
          getChildContext() {
            return { app: 'pixi-app' }
          }

          render() {
            return this.props.children
          }
        }
        ProviderComponent.childContextTypes = { app: PropTypes.string }
        ProviderComponent.propTypes = { children: PropTypes.any }
        Provider = ProviderComponent
        Consumer = context.createProvider()
      })

      test('provide value to consumer', run)
    })
  })
})
