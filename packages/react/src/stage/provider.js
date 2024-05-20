import React from 'react';

const Context = React.createContext(null);

const AppProvider = Context.Provider;
const AppConsumer = Context.Consumer;

const withPixiApp = (BaseComponent) =>
{
    const wrapper = React.forwardRef((props, ref) => (
        <AppConsumer>{(app) => <BaseComponent {...props} ref={ref} app={app} />}</AppConsumer>
    ));

    wrapper.displayName = `withPIXIApp(${BaseComponent.displayName || BaseComponent.name})`;

    return wrapper;
};

export { withPixiApp, AppProvider, AppConsumer, Context };
