import React from 'react';
import { Application, RendererType, Ticker } from 'pixi.js';
import PropTypes from 'prop-types';
import invariant from '../utils/invariant';
import { PROPS_CONTAINER } from '../utils/props';
import { PixiFiber } from '../reconciler';
import { AppProvider } from './provider';
import { TrackablePromise } from './promise';

const noop = () => {};

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

const propTypes = {
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

    // PIXI options, see https://pixijs.download/dev/docs/app.Application.html
    options: PropTypes.shape({
        antialias: PropTypes.bool,
        autoDensity: PropTypes.bool,
        autoStart: PropTypes.bool,
        background: PropTypes.number,
        backgroundAlpha: PropTypes.number,
        backgroundColor: PropTypes.number,
        bezierSmoothness: PropTypes.number,
        clearBeforeRender: PropTypes.bool,
        context: PropTypes.any,
        eventFeatures: PropTypes.object,
        eventMode: PropTypes.string,
        failIfMajorPerformanceCaveat: PropTypes.bool,
        forceFallbackAlpha: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        hello: PropTypes.bool,
        manageImports: PropTypes.bool,
        multiView: PropTypes.bool,
        powerPreference: PropTypes.string,
        preferences: PropTypes.object,
        preferWebGLVersion: PropTypes.number,
        premultipliedAlpha: PropTypes.bool,
        preserveDrawingBuffer: PropTypes.bool,
        resolution: PropTypes.number,
        roundPixels: PropTypes.bool,
        sharedTicker: PropTypes.bool,
        sharedLoader: PropTypes.bool,
        textureGCActive: PropTypes.bool,
        textureGCMaxIdle: PropTypes.number,
        textureGCCheckCountMax: PropTypes.number,
        useBackBuffer: PropTypes.bool,
        webgl: PropTypes.object,
        webgpu: PropTypes.object,

        // resizeTo needs to be a window or HTMLElement
        resizeTo: (props, propName) =>
        {
            const el = props[propName];

            el
                && invariant(
                    el === window || el instanceof HTMLElement,
                    `Invalid prop \`resizeTo\` of type ${typeof el}, expect \`window\` or an \`HTMLElement\`.`
                );
        },

        // canvas is optional, use if provided
        canvas: (props, propName, componentName) =>
        {
            const el = props[propName];

            el
                && invariant(
                    el instanceof HTMLCanvasElement,
                    // eslint-disable-next-line max-len
                    `Invalid prop \`canvas\` of type ${typeof el}, supplied to ${componentName}, expected \`<canvas> Element\``
                );
        },
    }),
};

const defaultProps = {
    width: 800,
    height: 600,
    onMount: noop,
    onUnmount: noop,
    raf: true,
    renderOnComponentChange: true,
};

export function getCanvasProps(props)
{
    const reserved = [
        ...Object.keys(propTypes),
        ...Object.keys(PROPS_CONTAINER),
    ];

    return Object.keys(props)
        .filter((p) => !reserved.includes(p))
        .reduce((all, prop) => ({ ...all, [prop]: props[prop] }), {});
}

class Stage extends React.Component
{
    _canvas = null;
    _mediaQuery = null;
    _ticker = null;
    _needsUpdate = true;
    app = null;
    appReady = null;

    componentDidMount()
    {
        const {
            width,
            height,
            options,
        } = this.props;

        if (this.app && this.appReady)
        {
            this.appReady.destroy();
            this.appReady = null;
        }

        this.app = new Application();
        // eslint-disable-next-line no-void
        this.appReady = new TrackablePromise(this.app.init({
            width,
            height,
            canvas: this._canvas,
            ...options,
            autoDensity: options?.autoDensity !== false,
        }));

        this.appReady.promiseCallback = () => this._initStage();
    }

    componentDidUpdate(prevProps, prevState, prevContext)
    {
        if (this.appReady?.isPending) return;
        const { width, height, raf, renderOnComponentChange, options }
            = this.props;

        // update resolution
        if (
            options?.resolution !== undefined
            && prevProps?.options.resolution !== options?.resolution
        )
        {
            this.app.renderer.resolution = options.resolution;
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
            this.app.ticker[raf ? 'start' : 'stop']();
        }

        // flush fiber
        PixiFiber.updateContainer(this.getChildren(), this.mountNode, this);

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
            this.app.renderer.resolution = window.devicePixelRatio;
        }

        this.app.renderer.resize(width, height);
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
            this.app.renderer.render(this.app.stage);
        }
    };

    getChildren()
    {
        const { children } = this.props;

        return <AppProvider value={this.app}>{children}</AppProvider>;
    }

    componentDidCatch(error, errorInfo)
    {
        console.error(`Error occurred in \`Stage\`.`);
        console.error(error);
        console.error(errorInfo);
    }

    componentWillUnmount()
    {
        // check if appReady is fulfilled
        if (this.appReady?.isPending)
        {
            this.appReady.destroy();
            this.appReady = null;
            this.app = null;

            return;
        }

        this.props.onUnmount(this.app);

        if (this._ticker)
        {
            this._ticker.remove(this.renderStage);
            this._ticker.destroy();
        }

        this.app.stage.off(
            '__REACT_PIXI_REQUEST_RENDER__',
            this.needsRenderUpdate
        );

        PixiFiber.updateContainer(null, this.mountNode, this);

        if (this._mediaQuery)
        {
            this._mediaQuery.removeListener(this.updateSize);
            this._mediaQuery = null;
        }

        this.app.destroy();
    }

    render()
    {
        const { options } = this.props;

        if (options && options.canvas)
        {
            invariant(
                options.canvas instanceof HTMLCanvasElement,
                'options.canvas needs to be a `HTMLCanvasElement`'
            );

            return null;
        }

        return (
            <canvas
                {...getCanvasProps(this.props)}
                ref={(c) => (this._canvas = c)}
            />
        );
    }

    _initStage()
    {
        const {
            onMount,
            options,
            raf,
            renderOnComponentChange,
        } = this.props;

        if (process.env.NODE_ENV === 'development' && this.app.renderer.type === RendererType.WEBGL)
        {
            // workaround for React 18 Strict Mode unmount causing
            // webgl canvas context to be lost
            if (this.app.renderer.context?.extensions)
            {
                this.app.renderer.context.extensions.loseContext = null;
            }
        }

        this.app.ticker.autoStart = false;
        this.app.ticker[raf ? 'start' : 'stop']();

        this.app.stage.__reactpixi = { root: this.app.stage, app: this.app };
        this.mountNode = PixiFiber.createContainer(this.app.stage);
        PixiFiber.updateContainer(this.getChildren(), this.mountNode, this);

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
}

Stage.propTypes = propTypes;
Stage.defaultProps = defaultProps;

export default Stage;
