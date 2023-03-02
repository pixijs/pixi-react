import React from 'react';
import type { Application } from '@pixi/app';

const Context = React.createContext<Application | null>(null);

const AppProvider = Context.Provider;
const AppConsumer = Context.Consumer;

type WithPixiAppProps = {
    app: Application;
};

const withPixiApp = <P extends WithPixiAppProps>(BaseComponent: React.ComponentType<P>) => {
    const Wrapper = React.forwardRef((props: Omit<P, keyof WithPixiAppProps>, ref) => (
        <AppConsumer>{(app) => <BaseComponent {...(props as P)} ref={ref} app={app} />}</AppConsumer>
    ));

    Wrapper.displayName = `withPIXIApp(${BaseComponent.displayName || BaseComponent.name})`;

    return Wrapper;
};

export { withPixiApp, AppProvider, AppConsumer, Context };
