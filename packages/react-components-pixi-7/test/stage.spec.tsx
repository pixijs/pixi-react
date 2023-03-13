import type { IApplicationOptions } from '@pixi/app';
import { Application } from '@pixi/app';
import { Container as PixiContainer } from '@pixi/display';
import type { ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
import renderer, { act } from 'react-test-renderer';
import * as reactTest from '@testing-library/react';

import type { PixiReactContainer } from '../src';
import { Container, Text, AppContext } from '../src';
import { configure } from './__utils__/configure';
import { spyOnObjectMethods } from './__utils__/mock';
import { BaseStage } from '../src/stage';
import type { ReactStageComponent, ReactStageProps } from '../src/types';
import { getCanvasProps } from '../src/stage';

// add events extension
import '@pixi/events';
import type { PixiReactReconciler } from '@pixi/react-fiber';
import { createRef } from 'react';

jest.useFakeTimers({
    doNotFake: ['performance'],
});

describe('getCanvasProps', () =>
{
    test('filter out reserved props from getCanvasProps', () =>
    {
        const props: ReactStageProps = {
            children: [],
            options: { width: 100, height: 200 },
            raf: true,
            onMount: () => {},
            width: 100,
            height: 400,
        };

        expect(getCanvasProps(props)).toEqual({});
    });
});

describe('stage', () =>
{
    let PixiReactFiber: PixiReactReconciler<PixiReactContainer, PixiReactContainer>;
    let Stage: ReactStageComponent;

    beforeEach(() =>
    {
        ({ PixiReactFiber, Stage } = configure({
            spyOnPixiFiber: (pixiReactFiber) => spyOnObjectMethods(pixiReactFiber),
        }));

        (window.matchMedia as jest.MockedFunction<any>).mockClear();
        jest.clearAllMocks();
    });

    test('prop types', () =>
    {
        expect(BaseStage.propTypes).toMatchSnapshot();
        expect(BaseStage.defaultProps).toMatchSnapshot();
        expect(Stage.propTypes).toMatchSnapshot();
    });

    test('renders a canvas element', () =>
    {
        const tree = renderer
            .create(
                <Stage>
                    <Container />
                </Stage>,
            )
            .toJSON();

        expect(tree).toHaveProperty('type', 'canvas');
        expect(tree).toMatchSnapshot();
    });

    test('renders null if view is passed in options', () =>
    {
        const options = {
            view: document.createElement('canvas'),
        };
        const tree = renderer
            .create(
                <Stage options={options}>
                    <Container />
                </Stage>,
            )
            .toJSON();

        expect(tree).toBeNull();
    });

    test('use autoDensity by default', () =>
    {
        let app: Application;

        const renderAutoDensity = (options: IApplicationOptions) =>
            renderer.create(
                <Stage
                    options={{
                        view: document.createElement('canvas'),
                        ...options,
                    }}
                    onMount={(_app) =>
                    {
                        app = _app;
                    }}
                >
                    <Container />
                </Stage>,
            );

        renderAutoDensity({});

        expect(app!.renderer.options.autoDensity).toBeTruthy();

        renderAutoDensity({ autoDensity: false });

        expect(app!.renderer.options.autoDensity).toBeFalsy();
    });

    test('validate options.view', () =>
    {
        const options = { view: 123 };

        expect(() =>
            renderer
                .create(
                    // @ts-ignore deliberately sending invalid view
                    <Stage options={options}>
                        <Container />
                    </Stage>,
                )
                .toJSON(),
        ).toThrow('options.view needs to be a `HTMLCanvasElement`');
    });

    test('passes options.view to Application', () =>
    {
        let app: Application;

        const view = document.createElement('canvas');

        renderer.create(
            <Stage options={{ view }} onMount={(_app) => (app = _app)}>
                <Container />
            </Stage>,
        );

        expect(app!.view).toBe(view);
    });

    test('passes props to canvas element', () =>
    {
        const id = 'stage';
        const className = 'canvas__element';
        const style = { border: '1px solid red' };
        const dataAttr = 'something';
        const tree = renderer
            .create(
                <Stage className={className} id={id} style={style} data-attr={dataAttr}>
                    <Container />
                </Stage>,
            )
            .toJSON() as ReactTestRendererJSON;

        expect(tree.props).toEqual({ className, id, style, 'data-attr': dataAttr });
    });

    test('does not pass reserved props to renderer canvas element', () =>
    {
        const options = { backgroundColor: 0xff0000 };
        const tree = renderer
            .create(
                <Stage height={500} width={500} options={options}>
                    <Container />
                </Stage>,
            )
            .toJSON() as ReactTestRendererJSON;

        expect(tree).toHaveProperty('type', 'canvas');
        expect(tree.props).toEqual({});
    });

    test('creates a Application with passed options', () =>
    {
        let app: Application;

        renderer.create(
            <Stage
                width={100}
                height={50}
                options={{ backgroundColor: 0xff0000 }}
                onMount={(_app) => (app = _app)}
            >
                <Container />
            </Stage>,
        );

        expect(app!.stage).toBeInstanceOf(PixiContainer);
        expect(app!).toBeInstanceOf(Application);
        expect(app!.renderer.options).toMatchObject({
            backgroundColor: 0xff0000,
            width: 100,
            height: 50,
        });
    });

    test('resize renderer when dimensions change', () =>
    {
        let app: Application;

        const App = ({ width, height }: { width: number; height: number }) => (
            <Stage width={width} height={height} onMount={(_app) => (app = _app)}>
                <Container />
            </Stage>
        );

        const el = renderer.create(<App width={100} height={100} />);

        expect(app!.renderer).toHaveProperty('width', 100);
        expect(app!.renderer).toHaveProperty('height', 100);

        el.update(<App width={1000} height={100} />);
        expect(app!.renderer).toHaveProperty('width', 1000);
        expect(app!.renderer).toHaveProperty('height', 100);

        el.update(<App width={1000} height={1000} />);
        expect(app!.renderer).toHaveProperty('width', 1000);
        expect(app!.renderer).toHaveProperty('height', 1000);

        el.update(<App width={100} height={100} />);
        expect(app!.renderer).toHaveProperty('width', 100);
        expect(app!.renderer).toHaveProperty('height', 100);
    });

    test('call onMount()', () =>
    {
        const spy = jest.fn();

        renderer.create(
            <Stage onMount={spy}>
                <Container />
            </Stage>,
        );

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toHaveLength(1);
        expect(spy.mock.calls[0][0]).toBeInstanceOf(Application);
    });

    test('destroys application on unmount', () =>
    {
        let app: Application;

        const el = renderer.create(
            <Stage onMount={(_app) => (app = _app)}>
                <Container />
            </Stage>,
        );

        jest.spyOn(app!, 'destroy');

        el.unmount();
        expect(app!.destroy).toBeCalled();
    });

    test('call PixiReactFiber.createContainer on componentDidMount', () =>
    {
        let app: Application;

        renderer.create(
            <Stage onMount={(_app) => (app = _app)}>
                <Container />
            </Stage>,
        );

        const stage = app!.stage;

        expect(PixiReactFiber.createContainer).toHaveBeenCalledTimes(1);
        expect(PixiReactFiber.createContainer).toHaveBeenCalledWith(stage);
    });

    test('call PixiReactFiber.updateContainer on componentDidMount', () =>
    {
        const stageRef = createRef<BaseStage>();

        renderer.create(
            <Stage ref={stageRef}>
                <Text text="Hello World!" />
            </Stage>,
        );

        expect(PixiReactFiber.updateContainer).toHaveBeenCalledTimes(1);
        expect(PixiReactFiber.updateContainer).toHaveBeenCalledWith(
            <AppContext.Provider value={stageRef.current!.app}>
                <Text text="Hello World!" />
            </AppContext.Provider>,
            stageRef.current!.mountNode,
            stageRef.current!,
        );
    });

    test('call PixiReactFiber.updateContainer on componentDidUpdate', () =>
    {
        const el = renderer.create(
            <Stage>
                <Container />
            </Stage>,
        );

        (PixiReactFiber.updateContainer as jest.MockedFunction<any>).mockClear();
        el.update(
            <Stage>
                <Container />
            </Stage>,
        );

        expect(PixiReactFiber.updateContainer).toHaveBeenCalledTimes(1);
    });

    test('call PixiReactFiber.updateContainer on componentWillUnmount', () =>
    {
        const stageRef = createRef<BaseStage>();
        const el = renderer.create(
            <Stage ref={stageRef}>
                <Container />
            </Stage>,
        );

        const app = stageRef.current!;
        const mountNode = stageRef.current!.mountNode;

        (PixiReactFiber.updateContainer as jest.MockedFunction<any>).mockClear();
        el.unmount();

        jest.advanceTimersByTime(1000);

        expect(PixiReactFiber.updateContainer).toHaveBeenCalledTimes(1);
        expect(PixiReactFiber.updateContainer).toHaveBeenCalledWith(null, mountNode, app);
    });

    describe('pixi application', () =>
    {
        const renderStage = (props: Partial<ReactStageProps> = {}) =>
        {
            const stageRef = createRef<BaseStage>();
            const el = renderer.create(
                <Stage ref={stageRef} {...props}>
                    <Container />
                </Stage>,
            );

            const rerender = (nextProps: Partial<ReactStageProps> = {}) =>
            {
                el.update(
                    <Stage ref={stageRef} {...nextProps}>
                        <Container />
                    </Stage>,
                );
            };

            return {
                el,
                rerender,
                app: stageRef.current!.app!,
            };
        };

        test('ticker running on mount', () =>
        {
            const { app } = renderStage();

            expect(app.ticker.started).toBeTruthy();
        });

        test('ticker not running on mount with prop raf to false', () =>
        {
            const { app } = renderStage({
                raf: false,
            });

            expect(app.ticker.started).toBeFalsy();
        });

        test('ticker to be toggable', () =>
        {
            const { app, rerender } = renderStage({ raf: false });

            expect(app.ticker.started).toBeFalsy();

            rerender({ raf: true });
            expect(app.ticker.started).toBeTruthy();

            rerender({ raf: false });
            expect(app.ticker.started).toBeFalsy();
        });

        test('render stage on component update with raf to false', () =>
        {
            const { app, rerender } = renderStage({ raf: false });

            jest.spyOn(app.renderer, 'render');

            rerender({ raf: false });
            expect(app.renderer.render).toHaveBeenCalledTimes(0);

            rerender({ raf: false, options: { backgroundColor: 0xff0000 } });
            expect(app.renderer.render).toHaveBeenCalledTimes(1);
        });

        test('not render stage on component update with renderOnComponentChange to false', () =>
        {
            const { app, rerender } = renderStage({ raf: false, renderOnComponentChange: false });

            jest.spyOn(app.renderer, 'render');
            rerender({ raf: false, renderOnComponentChange: false });

            expect(app.renderer.render).not.toHaveBeenCalled();
        });

        test('render stage on reconciliation `commitUpdate` using `renderOnComponentChange` to true', () =>
        {
            let el: ReactTestRenderer;
            const stageRef = createRef<BaseStage>();

            act(() =>
            {
                el = renderer.create(
                    <Stage ref={stageRef} raf={false} renderOnComponentChange={true}>
                        <Container>
                            <Text text="hi" />
                        </Container>
                    </Stage>,
                );
            });

            const app = stageRef.current!.app!;
            const ticker = stageRef.current!._ticker!;
            const spy = jest.spyOn(app.renderer, 'render');

            for (let i = 1; i <= 10; i++)
            {
                // eslint-disable-next-line no-loop-func
                act(() =>
                {
                    el.update(
                        <Stage ref={stageRef} raf={false} renderOnComponentChange={true}>
                            <Container x={i}>
                                <Text text="hi world" />
                            </Container>
                        </Stage>,
                    );
                    ticker.update();
                });
            }

            expect(spy).toBeCalledTimes(10);
        });
    });

    describe('resolution', () =>
    {
        test('app.resolution fallback to devicePixelRatio', () =>
        {
            window.devicePixelRatio = 3;

            const stageRef = createRef<BaseStage>();

            renderer.create(
                <Stage ref={stageRef}>
                    <Container />
                </Stage>,
            );

            expect(stageRef.current!.app!.renderer.resolution).toEqual(3);
        });

        test('styles on canvas should not exist if `autoDensity` is false', () =>
        {
            const { unmount, container } = reactTest.render(
                <Stage width={800} height={600} options={{ autoDensity: false }}>
                    <Container />
                </Stage>,
            );

            expect((container.firstChild as HTMLElement).getAttribute('style')).toEqual(null);
            unmount();
        });

        test('set styles on canvas if `autoDensity` is set', () =>
        {
            const { unmount, container } = reactTest.render(
                <Stage width={800} height={600} options={{ autoDensity: true }}>
                    <Container />
                </Stage>,
            );

            expect((container.firstChild as HTMLElement).getAttribute('style')).toEqual('width: 800px; height: 600px;');
            unmount();
        });

        test('setup resolution media query', () =>
        {
            expect(window.matchMedia).not.toHaveBeenCalled();

            const stageRef = createRef<BaseStage>();

            renderer.create(
                <Stage ref={stageRef} width={800} height={600} options={{ autoDensity: true }}>
                    <Container />
                </Stage>,
            );

            expect(stageRef.current!._mediaQuery!.addListener).toHaveBeenCalled();
            expect(window.matchMedia).toHaveBeenCalledTimes(1);
        });

        test('bypass resolution media query if `resolution` is set', () =>
        {
            const stageRef = createRef<BaseStage>();

            renderer.create(
                <Stage ref={stageRef} width={800} height={600} options={{ autoDensity: true, resolution: 1 }}>
                    <Container />
                </Stage>,
            );

            expect(stageRef.current!._mediaQuery).toEqual(null);
        });

        // TODO: when separate packages are added for v6/v7 make sure there are appropriate
        // separate tests for events/interaction manager
        test('update renderer resolution on `options.resolution` change', () =>
        {
            const stageRef = createRef<BaseStage>();

            const el = renderer.create(
                <Stage ref={stageRef} width={800} height={600} options={{ resolution: 1 }}>
                    <Container />
                </Stage>,
            );

            const appRenderer = stageRef.current!.app!.renderer;
            const spyResize = jest.spyOn(appRenderer, 'resize');
            const spyEventsResolutionChange = jest.spyOn(appRenderer.events, 'resolutionChange');

            el.update(
                <Stage ref={stageRef} width={800} height={600} options={{ resolution: 2 }}>
                    <Container />
                </Stage>,
            );

            expect(spyEventsResolutionChange).toHaveBeenCalledTimes(1);
            expect(spyEventsResolutionChange.mock.calls[0][0]).toEqual(2);
            expect(appRenderer.events.resolution).toEqual(2);

            expect(spyResize).toHaveBeenCalledTimes(1);
            expect(spyResize).toHaveBeenCalledWith(800, 600);
            expect(appRenderer.resolution).toEqual(2);
        });

        test('clean up media query on unmount', () =>
        {
            const stageRef = createRef<BaseStage>();

            const el = renderer.create(
                <div>
                    <Stage ref={stageRef} width={800} height={600} options={{ autoDensity: true }}>
                        <Container />
                    </Stage>
                </div>,
            );

            const stageInstance = stageRef.current!;
            const spyDestroy = jest.spyOn(stageInstance._mediaQuery!, 'removeListener');

            expect(stageInstance._mediaQuery).not.toEqual(null);

            el.update(<div />);

            expect(spyDestroy).toHaveBeenCalled();
            expect(stageInstance._mediaQuery).toEqual(null);
        });

        test('switch resolution if `autoDensity` is on without setting `resolution` specifically', () =>
        {
            const stageRef = createRef<BaseStage>();

            renderer.create(
                <Stage ref={stageRef} width={800} height={600} options={{ autoDensity: true }}>
                    <Container />
                </Stage>,
            );

            const app = stageRef.current!.app!;
            const mq = (stageRef.current!._mediaQuery!.addListener as jest.MockedFunction<any>).mock.calls[0][0]; // ?

            const validate = (res: number) =>
            {
                window.devicePixelRatio = res;
                mq();
                expect(app.renderer.resolution).toEqual(res);
                expect((app.view as HTMLCanvasElement).getAttribute('style')).toEqual('width: 800px; height: 600px;');
                expect(app.view.width).toEqual(800 * res);
                expect(app.view.height).toEqual(600 * res);
            };

            for (let i = 1; i <= 10; i++)
            {
                validate(i);
            }
        });
    });
});
