import type { ErrorInfo } from 'react';
import React, { forwardRef } from 'react';
import type { Container } from '@pixi/display';
import type { IApplicationOptions } from '@pixi/app';
import { Application } from '@pixi/app';
import { Ticker } from '@pixi/ticker';
import PropTypes from 'prop-types';
import { invariant } from '@pixi/react-invariant';
import type {
    HTMLCanvasProps,
    MinimalPixiReactFiber,
    StageProps,
    StagePropsWithFiber,
} from '@pixi/react-types';
import { PROPS_DISPLAY_OBJECT } from '../utils/props';
import type { PixiReactContainer } from '../types';
import { AppProvider } from './provider';

/**
 * -------------------------------------------
 * Stage React Component (use this in react-dom)
 *
 * @usage
 *
 * const App = () => (
 *   <Stage
 *     width={500}
 *     height={500}
 *     options={ backgroundColor: 0xff0000 }
 *     onMount={( renderer, canvas ) => {
 *       console.log('PIXI renderer: ', renderer)
 *       console.log('Canvas element: ', canvas)
 *     }}>
 * );
 *
 * -------------------------------------------
 */

export const propTypes = {
    // dimensions
    width: PropTypes.number,
    height: PropTypes.number,

    // will return renderer
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,

    // run ticker at start?
    raf: PropTypes.bool,

    // render component on component lifecycle changes?
    renderOnComponentChange: PropTypes.bool,

    children: PropTypes.node,

    // PIXI options, see https://pixijs.download/dev/docs/PIXI.Application.html
    options: PropTypes.shape({
        autoStart: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        useContextAlpha: PropTypes.bool,
        backgroundAlpha: PropTypes.number,
        autoDensity: PropTypes.bool,
        antialias: PropTypes.bool,
        preserveDrawingBuffer: PropTypes.bool,
        resolution: PropTypes.number,
        forceCanvas: PropTypes.bool,
        backgroundColor: PropTypes.number,
        clearBeforeRender: PropTypes.bool,
        powerPreference: PropTypes.string,
        sharedTicker: PropTypes.bool,
        sharedLoader: PropTypes.bool,

        // resizeTo needs to be a window or HTMLElement
        resizeTo: (props, propName) =>
        {
            const el = props[propName];

            try
            {
                el
                    && invariant(
                        el === window || el instanceof HTMLElement,
                        `Invalid prop \`resizeTo\` of type ${typeof el}, expect \`window\` or an \`HTMLElement\`.`
                    );
            }
            catch (e)
            {
                return e instanceof Error ? e : null;
            }

            return null;
        },

        // view is optional, use if provided
        view: (props, propName, componentName) =>
        {
            const el = props[propName];

            try
            {
                el
                    && invariant(
                        el instanceof HTMLCanvasElement,
                        `Invalid prop \`view\` of type ${typeof el}, supplied to ${componentName}, expected \`<canvas> Element\``
                    );
            }
            catch (e)
            {
                return e instanceof Error ? e : null;
            }

            return null;
        },
    }),
};

const wrappedStagePropTypes = {
    ...propTypes,
    // passed in via configurePixiReactStage HOC
    pixiReactFiberInstance: PropTypes.object,
};

const noop = (_app: Application) => {};

const defaultProps = {
    width: 800,
    height: 600,
    onMount: noop,
    onUnmount: noop,
    options: {},
    raf: true,
    renderOnComponentChange: true,
};

type BaseStageProps = StagePropsWithFiber<
    Application,
    IApplicationOptions,
    Container
>;
type HOCStageProps = StageProps<Application, IApplicationOptions>;
// force optional to required props for defaults to prevent TS undefined errors
type BaseStagePropsWithDefaults = Required<BaseStageProps>;
type HOCStagePropsWithDefaults = Required<HOCStageProps>;

export function getCanvasProps(props: Partial<BaseStagePropsWithDefaults>)
{
    const reserved = [
        ...Object.keys(wrappedStagePropTypes),
        ...Object.keys(PROPS_DISPLAY_OBJECT),
    ];

    return Object.keys(props)
        .filter((p) => !reserved.includes(p))
        .reduce(
            (all, prop) => ({
                ...all,
                [prop]: props[prop as keyof HTMLCanvasProps],
            }),
            {}
        );
}

export class BaseStage extends React.Component<BaseStagePropsWithDefaults>
{
    _canvas: HTMLCanvasElement | null = null;
    _mediaQuery: MediaQueryList | null = null;
    _ticker: Ticker | null = null;
    _needsUpdate: boolean = true;
    app: Application | null = null;
    mountNode: any;

    static propTypes = wrappedStagePropTypes;
    static defaultProps = defaultProps;

    componentDidMount()
    {
        const {
            pixiReactFiberInstance,
            onMount,
            width,
            height,
            options,
            raf,
            renderOnComponentChange,
        } = this.props;

        this.app = new Application({
            width,
            height,
            view: this._canvas!,
            ...options,
            autoDensity: options?.autoDensity !== false,
        });

        if (process.env.NODE_ENV === 'development')
        {
            // workaround for React 18 Strict Mode unmount causing canvas
            // context to be lost
            // @ts-ignore - workaround for development only
            this.app.renderer.context.extensions.loseContext = null;
        }

        this.app.ticker.autoStart = false;
        this.app.ticker[raf ? 'start' : 'stop']();

        (this.app.stage as PixiReactContainer).__reactpixi = {
            root: this.app.stage,
            parent: null,
            previousAttach: null,
            attachedObjects: [],
        };
        // @ts-ignore - react reconciler lists several parameters as required that are optional
        this.mountNode = pixiReactFiberInstance.createContainer(this.app.stage);
        pixiReactFiberInstance.updateContainer(
            this.getChildren(),
            this.mountNode,
            this
        );

        onMount(this.app);

        // update size on media query resolution change?
        // only if autoDensity = true
        if (
            options?.autoDensity
            && window.matchMedia
            && options?.resolution === undefined
        )
        {
            this._mediaQuery = window.matchMedia(
                `(-webkit-min-device-pixel-ratio: 1.3), (min-resolution: 120dpi)`
            );
            this._mediaQuery.addListener(this.updateSize);
        }

        // listen for reconciler changes
        if (renderOnComponentChange && !raf)
        {
            this._ticker = new Ticker();
            this._ticker.autoStart = true;
            this._ticker.add(this.renderStage);
            this.app.stage.on(
                '__REACT_PIXI_REQUEST_RENDER__',
                this.needsRenderUpdate
            );
        }

        this.updateSize();
        this.renderStage();
    }

    componentDidUpdate(prevProps: BaseStageProps)
    {
        const {
            pixiReactFiberInstance,
            width,
            height,
            raf,
            renderOnComponentChange,
            options,
        } = this.props;

        // update resolution
        if (
            options?.resolution !== undefined
            && prevProps?.options?.resolution !== options?.resolution
        )
        {
            // @ts-ignore - resolution now settable see pixijs PR - https://github.com/pixijs/pixijs/pull/9209
            this.app!.renderer.resolution = options.resolution;
            this.resetInteractionManager();
        }

        // update size
        if (
            prevProps.height !== height
            || prevProps.width !== width
            || prevProps.options?.resolution !== options?.resolution
        )
        {
            this.updateSize();
        }

        // handle raf change
        if (prevProps.raf !== raf)
        {
            this.app!.ticker[raf ? 'start' : 'stop']();
        }

        // flush fiber
        pixiReactFiberInstance.updateContainer(
            this.getChildren(),
            this.mountNode,
            this
        );

        if (
            prevProps.width !== width
            || prevProps.height !== height
            || prevProps.raf !== raf
            || prevProps.renderOnComponentChange !== renderOnComponentChange
            || prevProps.options !== options
        )
        {
            this._needsUpdate = true;
            this.renderStage();
        }
    }

    updateSize = () =>
    {
        const { width, height, options } = this.props;

        if (!options?.resolution)
        {
            // @ts-ignore - resolution now settable see pixijs PR - https://github.com/pixijs/pixijs/pull/9209
            this.app!.renderer.resolution = window.devicePixelRatio;
            this.resetInteractionManager();
        }

        this.app!.renderer.resize(width, height);
    };

    needsRenderUpdate = () =>
    {
        this._needsUpdate = true;
    };

    renderStage = () =>
    {
        const { renderOnComponentChange, raf } = this.props;

        if (!raf && renderOnComponentChange && this._needsUpdate)
        {
            this._needsUpdate = false;
            this.app!.renderer.render(this.app!.stage);
        }
    };

    // provide support for Pixi v6 still
    resetInteractionManager()
    {
        // `interaction` property is absent in Pixi v7 and in v6 if user has installed Federated Events API plugin.
        // https://api.pixijs.io/@pixi/events.html
        // in v7 however, there's a stub object which displays a deprecation warning, so also check the resolution property:
        const { interaction: maybeInteraction } = this.app!.renderer.plugins;

        if (maybeInteraction?.resolution)
        {
            maybeInteraction.resolution = this.app!.renderer.resolution;
        }
    }

    getChildren()
    {
        const { children } = this.props;

        return <AppProvider value={this.app}>{children}</AppProvider>;
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo)
    {
        console.error(`Error occurred in \`Stage\`.`);
        console.error(error);
        console.error(errorInfo);
    }

    componentWillUnmount()
    {
        const { pixiReactFiberInstance, onUnmount } = this.props;

        onUnmount(this.app!);

        if (this._ticker)
        {
            this._ticker.remove(this.renderStage);
            this._ticker.destroy();
        }

        this.app!.stage.off(
            '__REACT_PIXI_REQUEST_RENDER__',
            this.needsRenderUpdate
        );

        pixiReactFiberInstance.updateContainer(null, this.mountNode, this);

        if (this._mediaQuery)
        {
            this._mediaQuery.removeListener(this.updateSize);
            this._mediaQuery = null;
        }

        this.app!.destroy();
    }

    render()
    {
        const { options } = this.props;

        if (options && options.view)
        {
            invariant(
                options.view instanceof HTMLCanvasElement,
                'options.view needs to be a `HTMLCanvasElement`'
            );

            return null;
        }

        return (
            <canvas
                {...getCanvasProps(this.props)}
                ref={(c: HTMLCanvasElement) => (this._canvas = c)}
            />
        );
    }
}

export function configurePixiReactStage(
    pixiReactFiberInstance: MinimalPixiReactFiber<Container>
)
{
    const StageWithPixiReactFiber = forwardRef<BaseStage, HOCStageProps>(
        (props, ref) =>
        {
            const normalizedProps = {
                ...defaultProps,
                ...props,
            };

            return (
                <BaseStage
                    ref={ref}
                    {...(normalizedProps as HOCStagePropsWithDefaults)}
                    pixiReactFiberInstance={pixiReactFiberInstance}
                />
            );
        }
    );

    StageWithPixiReactFiber.displayName = 'StageWithPixiReactFiber';

    return StageWithPixiReactFiber;
}
