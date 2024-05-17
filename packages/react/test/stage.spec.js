import * as reactTest from '@testing-library/react';
import { Application, Container as PixiContainer } from 'pixi.js';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Container, PixiFiber, Stage, Text } from '../src';
import { getCanvasProps } from '../src/stage';
import { Context } from '../src/stage/provider';
import { mockToSpy } from './__utils__/mock';

jest.mock('../src/reconciler');
jest.useFakeTimers({
    doNotFake: ['performance']
});

describe('stage', () =>
{
    beforeEach(() =>
    {
        window.matchMedia.mockClear();
        jest.clearAllMocks();
        mockToSpy('../src/reconciler');
    });

    test('filter out reserved props from getCanvasProps', () =>
    {
        const props = {
            children: [],
            options: { foo: 'bar', bar: 'foo' },
            raf: true,
            onMount: () => {},
            width: 100,
            height: 400,
        };

        expect(getCanvasProps(props)).toEqual({});
    });

    test('prop types', () =>
    {
        expect(Stage.propTypes).toMatchSnapshot();
        expect(Stage.defaultProps).toMatchSnapshot();
    });

    test('renders a canvas element', () =>
    {
        const tree = renderer.create(<Stage />).toJSON();

        expect(tree).toHaveProperty('type', 'canvas');
        expect(tree).toMatchSnapshot();
    });

    test('renders null if canvas is passed in options', () =>
    {
        const options = {
            canvas: document.createElement('canvas'),
        };
        const tree = renderer.create(<Stage options={options} />).toJSON();

        expect(tree).toBeNull();
    });

    test('use autoDensity by default', async () =>
    {
        const renderAutoDensity = async (options) =>
        {
            const r = renderer
                .create(
                    <Stage
                        options={{
                            canvas: document.createElement('canvas'),
                            ...options,
                        }}
                    />
                );

            const instance = r.getInstance();

            await instance.appReady.promise;

            return instance.app.renderer._initOptions.autoDensity;
        };

        expect(await renderAutoDensity({})).toBeTruthy();
        expect(await renderAutoDensity({ autoDensity: false })).toBeFalsy();
    });

    test.skip('validate options.canvas', () =>
    {
        const options = { canvas: 123 };

        expect(() => renderer.create(<Stage options={options} />).toJSON()).toThrow(
            'options.canvas needs to be a `HTMLCanvasElement`'
        );
    });

    test('passes options.canvas to Application', async () =>
    {
        const canvas = document.createElement('canvas');
        const el = renderer.create(<Stage options={{ canvas }} />);
        const instance = el.getInstance();

        await instance.appReady.promise;

        expect(instance.app.canvas).toBe(canvas);
    });

    test('passes props to canvas element', () =>
    {
        const id = 'stage';
        const className = 'canvas__element';
        const style = { border: '1px solid red' };
        const dataAttr = 'something';
        const tree = renderer.create(<Stage className={className} id={id} style={style} data-attr={dataAttr} />).toJSON();

        expect(tree.props).toEqual({ className, id, style, 'data-attr': dataAttr });
    });

    test('does not pass reserved props to renderer canvas element', () =>
    {
        const options = { backgroundColor: 0xff0000 };
        const tree = renderer.create(<Stage height={500} width={500} options={options} />).toJSON();

        expect(tree).toHaveProperty('type', 'canvas');
        expect(tree.props).toEqual({});
    });

    test('creates a Application with passed options', async () =>
    {
        const el = renderer.create(<Stage width={100} height={50} options={{ backgroundColor: 0xff0000 }} />);
        const instance = el.getInstance();
        const app = el.getInstance().app;

        await instance.appReady.promise;

        expect(app.stage).toBeInstanceOf(PixiContainer);
        expect(app).toBeInstanceOf(Application);
        expect(app.renderer['_initOptions']).toMatchObject({
            backgroundColor: 0xff0000,
            width: 100,
            height: 50,
        });
    });

    test('resize renderer when dimensions change', async () =>
    {
        const el = renderer.create(<Stage width={100} height={100} />);
        const app = el.getInstance().app;

        await el.getInstance().appReady.promise;

        expect(app.renderer).toHaveProperty('width', 100);
        expect(app.renderer).toHaveProperty('height', 100);

        el.update(<Stage width={1000} height={100} />);
        expect(app.renderer).toHaveProperty('width', 1000);
        expect(app.renderer).toHaveProperty('height', 100);

        el.update(<Stage width={1000} height={1000} />);
        expect(app.renderer).toHaveProperty('width', 1000);
        expect(app.renderer).toHaveProperty('height', 1000);

        el.update(<Stage width={100} height={100} />);
        expect(app.renderer).toHaveProperty('width', 100);
        expect(app.renderer).toHaveProperty('height', 100);
    });

    test('call onMount()', async () =>
    {
        const spy = jest.fn();

        const el = renderer.create(<Stage onMount={spy} />);

        await el.getInstance().appReady.promise;

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0]).toHaveLength(1);
        expect(spy.mock.calls[0][0]).toBeInstanceOf(Application);
    });

    test('can be unmounted', () =>
    {
        const el = renderer.create(<Stage />);
        const instance = el.getInstance();

        jest.spyOn(instance, 'componentWillUnmount');

        el.unmount();
        expect(instance.componentWillUnmount).toBeCalled();
    });

    test('destroys application on unmount', async () =>
    {
        const el = renderer.create(<Stage />);
        const instance = el.getInstance();
        const app = instance.app;

        await el.getInstance().appReady.promise;

        jest.spyOn(app, 'destroy');

        el.unmount();

        // wait a little bit
        jest.useRealTimers();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        jest.useFakeTimers();

        expect(app.destroy).toBeCalled();
    }, 10000);

    test('call PixiFiber.createContainer on componentDidMount', async () =>
    {
        const el = renderer.create(<Stage />);

        await el.getInstance().appReady.promise;

        const stage = el.getInstance().app.stage;

        expect(PixiFiber.createContainer).toHaveBeenCalledTimes(1);
        expect(PixiFiber.createContainer).toHaveBeenCalledWith(stage);
    });

    test('call PixiFiber.updateContainer on componentDidMount', async () =>
    {
        const el = renderer.create(
            <Stage>
                <Text text="Hello World!" />
            </Stage>
        );

        const instance = el.getInstance();

        await el.getInstance().appReady.promise;

        expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1);
        expect(PixiFiber.updateContainer).toHaveBeenCalledWith(
            <Context.Provider value={instance.app}>
                <Text text="Hello World!" />
            </Context.Provider>,
            instance.mountNode,
            instance
        );
    });

    test('call PixiFiber.updateContainer on componentDidUpdate', async () =>
    {
        const el = renderer.create(<Stage />);

        await el.getInstance().appReady.promise;

        PixiFiber.updateContainer.mockClear();
        el.update(<Stage />);

        expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1);
    });

    test('call PixiFiber.updateContainer on componentWillUnmount', async () =>
    {
        const el = renderer.create(<Stage />);

        await el.getInstance().appReady.promise;

        const instance = el.getInstance();

        PixiFiber.updateContainer.mockClear();
        el.unmount();

        jest.advanceTimersByTime(1000);

        expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1);
        expect(PixiFiber.updateContainer).toHaveBeenCalledWith(null, instance.mountNode, instance);
    });

    describe('pixi application', () =>
    {
        test('ticker running on mount', async () =>
        {
            const el = renderer.create(<Stage />);

            await el.getInstance().appReady.promise;

            const app = el.getInstance().app;

            expect(app.ticker.started).toBeTruthy();
        });

        test('ticker not running on mount with prop raf to false', async () =>
        {
            const el = renderer.create(<Stage raf={false} />);

            await el.getInstance().appReady.promise;

            const app = el.getInstance().app;

            expect(app.ticker.started).toBeFalsy();
        });

        test('ticker to be toggable', async () =>
        {
            const el = renderer.create(<Stage raf={false} />);

            await el.getInstance().appReady.promise;

            const app = el.getInstance().app;

            expect(app.ticker.started).toBeFalsy();

            el.update(<Stage raf={true} />);
            expect(app.ticker.started).toBeTruthy();

            el.update(<Stage raf={false} />);
            expect(app.ticker.started).toBeFalsy();
        });

        test('render stage on component update with raf to false', async () =>
        {
            const el = renderer.create(<Stage raf={false} />);

            await el.getInstance().appReady.promise;

            const app = el.getInstance().app;

            jest.spyOn(app.renderer, 'render');

            el.update(<Stage raf={false} />);
            expect(app.renderer.render).toHaveBeenCalledTimes(0);

            el.update(<Stage raf={false} options={{ backgroundColor: 0xff0000 }} />);
            expect(app.renderer.render).toHaveBeenCalledTimes(1);
        });

        test('not render stage on component update with renderOnComponentChange to false', async () =>
        {
            const el = renderer.create(<Stage raf={false} renderOnComponentChange={false} />);

            await el.getInstance().appReady.promise;

            const app = el.getInstance().app;

            jest.spyOn(app.renderer, 'render');
            el.update(<Stage raf={false} renderOnComponentChange={false} />);

            expect(app.renderer.render).not.toHaveBeenCalled();
        });

        test.skip('render stage on reconciliation `commitUpdate` using `renderOnComponentChange` to true', async () =>
        {
            let el;

            act(() =>
            {
                el = renderer.create(
                    <Stage raf={false} renderOnComponentChange={true}>
                        <Container>
                            <Text text="hi" />
                        </Container>
                    </Stage>
                );
            });

            await el.getInstance().appReady.promise;

            const app = el.getInstance().app;
            const ticker = el.getInstance()._ticker;
            const spy = jest.spyOn(app.renderer, 'render');

            for (let i = 1; i <= 10; i++)
            {
                // eslint-disable-next-line no-loop-func
                act(() =>
                {
                    el.update(
                        <Stage raf={false} renderOnComponentChange={true}>
                            <Container x={i}>
                                <Text text="hi world" />
                            </Container>
                        </Stage>
                    );
                    ticker.update();
                });
            }

            expect(spy).toBeCalledTimes(10);
        });
    });

    describe('resolution', () =>
    {
        test('app.resolution fallback to devicePixelRatio', async () =>
        {
            window.devicePixelRatio = 3;

            const el = renderer.create(<Stage />);

            await el.getInstance().appReady.promise;

            expect(el.getInstance().app.renderer.resolution).toEqual(3);
        });

        test.skip('styles on canvas should not exist if `autoDensity` is false', () =>
        {
            const { unmount, container } = reactTest.render(
                <Stage width={800} height={600} options={{ autoDensity: false }} />
            );

            expect(container.firstChild.getAttribute('style')).toEqual(null);
            unmount();
        });

        test.skip('set styles on canvas if `autoDensity` is set', () =>
        {
            const { unmount, container } = reactTest.render(
                <Stage width={800} height={600} options={{ autoDensity: true }} />
            );

            expect(container.firstChild.getAttribute('style')).toEqual('width: 800px; height: 600px;');
            unmount();
        });

        test('setup resolution media query', async () =>
        {
            expect(window.matchMedia).not.toHaveBeenCalled();

            const el = renderer.create(<Stage width={800} height={600} options={{ autoDensity: true }} />);

            await el.getInstance().appReady.promise;

            expect(el.getInstance()._mediaQuery.addListener).toHaveBeenCalled();
            expect(window.matchMedia).toHaveBeenCalledTimes(1);
        });

        test('bypass resolution media query if `resolution` is set', async () =>
        {
            const el = renderer.create(<Stage width={800} height={600} options={{ autoDensity: true, resolution: 1 }} />);

            await el.getInstance().appReady.promise;

            expect(el.getInstance()._mediaQuery).toEqual(null);
        });

        // TODO: when separate packages are added for v6/v7 make sure there are appropriate
        // separate tests for events/interaction manager
        test('update renderer resolution on `options.resolution` change', async () =>
        {
            const el = renderer.create(<Stage width={800} height={600} options={{ resolution: 1 }} />);

            await el.getInstance().appReady.promise;

            const appRenderer = el.getInstance().app.renderer;
            const spyResize = jest.spyOn(appRenderer, 'resize');
            const spyEventsResolutionChange = jest.spyOn(appRenderer.events, 'resolutionChange');

            el.update(<Stage width={800} height={600} options={{ resolution: 2 }} />);

            expect(spyEventsResolutionChange).toHaveBeenCalledTimes(1);
            expect(spyEventsResolutionChange.mock.calls[0][0]).toEqual(2);
            expect(appRenderer.events.resolution).toEqual(2);

            expect(spyResize).toHaveBeenCalledTimes(1);
            expect(spyResize).toHaveBeenCalledWith(800, 600);
            expect(appRenderer.resolution).toEqual(2);
        });

        test.skip('clean up media query on unmount', () =>
        {
            let el = renderer.create(
                <div>
                    <Stage width={800} height={600} options={{ autoDensity: true }} />
                </div>
            );

            const app = el.toTree().rendered[0].instance;
            const spyDestroy = jest.spyOn(app._mediaQuery, 'removeListener');

            expect(app._mediaQuery).not.toEqual(null);

            el = el.update(<div />);

            expect(spyDestroy).toHaveBeenCalled();
            expect(app._mediaQuery).toEqual(null);
        });

        test('switch resolution if `autoDensity` is on without setting `resolution` specifically', async () =>
        {
            const el = renderer.create(<Stage width={800} height={600} options={{ autoDensity: true }} />);

            await el.getInstance().appReady.promise;

            const app = el.getInstance().app;
            const mq = el.getInstance()._mediaQuery.addListener.mock.calls[0][0]; // ?

            const validate = (res) =>
            {
                window.devicePixelRatio = res;
                mq();
                expect(app.renderer.resolution).toEqual(res);
                expect(app.canvas.getAttribute('style')).toEqual('width: 800px; height: 600px;');
                expect(app.canvas.width).toEqual(800 * res);
                expect(app.canvas.height).toEqual(600 * res);
            };

            for (let i = 1; i <= 10; i++)
            {
                validate(i);
            }
        });
    });
});
