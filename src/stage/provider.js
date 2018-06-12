import React from 'react'

const context = React.createContext(null)

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
const Provider = context.Consumer

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
  const wrapper = props => <context.Consumer>{app => <BaseComponent {...props} app={app} />}</context.Consumer>
  wrapper.displayName = `withPIXIApp(${BaseComponent.displayName || BaseComponent.name})`
  return wrapper
}

export { withPixiApp, Provider, context }
