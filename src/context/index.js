import React from 'react'
import PropTypes from 'prop-types'
import invariant from 'fbjs/lib/invariant'
import idx from 'idx'

let Context

function clearContext() {
  Context = undefined
}

function createContext() {
  if ('createContext' in React && typeof React.createContext === 'function') {
    Context = React.createContext('pixi-app')
  }
  return Context
}

function createProvider() {
  let Provider = Context && Context.Consumer
  if (!Provider) {
    class PixiAppProvider extends React.Component {
      componentWillMount() {
        const app = idx(this, _ => _.context.app)
        invariant(
          !!app,
          'Cannot provide `PIXI.Application` via React Context. You probably forgot to wrap your PIXI application with' +
            ' <Stage /> object'
        )
      }

      render() {
        return this.props.children(this.context.app)
      }
    }

    PixiAppProvider.propTypes = {
      children: PropTypes.func,
    }

    PixiAppProvider.defaultProps = {
      children: () => {},
    }

    PixiAppProvider.contextTypes = {
      app: PropTypes.object,
    }

    Provider = PixiAppProvider
    Provider.displayName = 'PixiAppProvider'
  }

  return Provider
}

export { Context, createProvider, createContext, clearContext }
