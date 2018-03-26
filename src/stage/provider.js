import React from 'react'
import PropTypes from 'prop-types'

/**
 * Provider for exposing the PIXI.Application
 *
 * @param {Function} children
 * @param {Object} app from context
 * @returns {React.Component}
 * @usage:
 *
 *   const App = () => (
 *     <Stage>
 *       <Provider>
 *         {app => <MyComponent app={app} />}
 *       </Provider>
 *     </Stage>
 *   )
 *
 */
const Provider = ({ children }, { app }) => children(app)
Provider.contextTypes = { app: PropTypes.object }
Provider.propTypes = { children: PropTypes.func }

/**
 * Or as a Higher Order Component
 *
 * @param {React.Component|Function} BaseComponent
 * @returns {React.Component|Function}
 * @usage
 *
 *  const App = withPIXIApp(({ app ) => ())
 *
 */
const withPixiApp = BaseComponent => {
  class WithPIXIApp extends React.Component {
    render() {
      return <BaseComponent {...this.props} app={this.context.app} />
    }
  }

  WithPIXIApp.contextTypes = { app: PropTypes.object }
  return WithPIXIApp
}

export { withPixiApp, Provider }
