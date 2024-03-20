import React, { useCallback, useEffect, useRef } from 'react';
import renderer, { act } from 'react-test-renderer';
import * as reactTest from '@testing-library/react';
import { Application } from '@pixi/app';
import { Ticker } from '@pixi/ticker';
import { Container, Stage, useTick, useApp } from '../src';

jest.useFakeTimers({
    doNotFake: ['performance']
});

describe('hooks', () =>
{
    describe('useApp', () =>
    {
        test('throw `no context` error', () =>
        {
            const Comp = () =>
            {
                useApp();

                return null;
            };

            const createApp = () =>
                act(() =>
                {
                    renderer.create(
                        <Container>
                            <Comp />
                        </Container>
                    );
                });

            expect(createApp).toThrow(
                'No Context found with `Application`. Make sure to wrap component with `AppProvider`'
            );
        });

        test('receive PIXI.Application', () =>
        {
            const Comp = () =>
            {
                const app = useApp();

                expect(app).toBeInstanceOf(Application);

                return null;
            };

            act(() =>
            {
                renderer.create(
                    <Stage>
                        <Comp />
                    </Stage>
                );
            });
        });
    });

    describe('useTick', () =>
    {
        const App = ({ children, cb }) =>
        {
            const app = useRef();
            const setApp = useCallback((_) => (app.current = _), []);

            useEffect(() => cb(app.current), [app.current]);

            return <Stage onMount={setApp}>{children}</Stage>;
        };

        test('throw `no context` error', () =>
        {
            const Comp = () =>
            {
                useTick(() => {});

                return null;
            };

            const createApp = () =>
                act(() =>
                {
                    renderer.create(
                        <Container>
                            <Comp />
                        </Container>
                    );
                });

            expect(createApp).toThrow(
                'No Context found with `Application`. Make sure to wrap component with `AppProvider`'
            );
        });

        test('mount & unmount', () =>
        {
            const Comp = () =>
            {
                useTick(() => {});

                return null;
            };

            const mount = () => (
                <Stage>
                    <Container>
                        <Comp />
                    </Container>
                </Stage>
            );

            const unmount = () => (
                <Stage>
                    <Container />
                </Stage>
            );

            let render;

            act(() =>
            {
                render = renderer.create(unmount());
            });
            const app = render.getInstance().app;

            jest.spyOn(app.ticker, 'add');
            jest.spyOn(app.ticker, 'remove');

            jest.runOnlyPendingTimers();
            expect(app.ticker.add).toHaveBeenCalledTimes(0);
            expect(app.ticker.remove).toHaveBeenCalledTimes(0);

            act(() =>
            {
                render.update(mount());
                render.update(mount());
                render.update(mount());
            });

            jest.runOnlyPendingTimers();
            expect(app.ticker.add).toHaveBeenCalledTimes(1);
            expect(app.ticker.remove).toHaveBeenCalledTimes(0);

            act(() =>
            {
                render.update(unmount());
            });

            jest.runOnlyPendingTimers();
            expect(app.ticker.remove).toHaveBeenCalledTimes(1);
        });

        test('update state', () =>
        {
            const fn = jest.fn();

            const Counter = () =>
            {
                useTick(fn);

                return null;
            };

            const render = () => (
                <App
                    cb={(app) =>
                    {
                        for (let i = 0; i < 10; i++) app.ticker.update();
                    }}
                >
                    <Counter />
                </App>
            );

            const { rerender, unmount } = reactTest.render(render());

            rerender(render());

            unmount();
            expect(fn).toHaveBeenCalledTimes(10);
        });

        test('enable/disable', () =>
        {
            const fn = jest.fn();

            const Counter = ({ enabled }) =>
            {
                useTick(fn, enabled);

                return null;
            };

            const render = (enabled) => (
                <App
                    cb={(app) =>
                    {
                        app.ticker.update();
                        app.ticker.update();
                        app.ticker.update();
                    }}
                >
                    <Counter enabled={enabled} />
                </App>
            );

            const testState = (enabled, calledTimes) =>
            {
                fn.mockClear();

                const { rerender, unmount } = reactTest.render(render(enabled));

                reactTest.act(() =>
                {
                    rerender(render(enabled));
                    rerender(render(enabled));
                });

                unmount();
                expect(fn).toHaveBeenCalledTimes(calledTimes);
            };

            testState(true, 3);
            testState(false, 0);
        });

        test('ticker fn.this should be ticker instance', () =>
        {
            const fn = jest.fn();

            const Counter = () =>
            {
                useTick(function tick()
                {
                    fn(this);
                });

                return null;
            };

            const render = () => (
                <App cb={(app) => app.ticker.update()}>
                    <Counter />
                </App>
            );

            const { rerender, unmount } = reactTest.render(render());

            rerender(render());
            unmount();

            expect(fn.mock.calls[0][0]).toBeInstanceOf(Ticker);
        });

        test('ticker fn second argument as ticker instance', () =>
        {
            const fn = jest.fn();

            const Counter = () =>
            {
                useTick(fn);

                return null;
            };

            const render = () => (
                <App cb={(app) => app.ticker.update()}>
                    <Counter />
                </App>
            );

            const { rerender, unmount } = reactTest.render(render());

            rerender(render());
            unmount();

            expect(typeof fn.mock.calls[0][0]).toBe('number');
            expect(fn.mock.calls[0][1]).toBeInstanceOf(Ticker);
        });

        test('clean up after unmount', () =>
        {
            const fn = jest.fn();
            let app;
            let add;
            let remove;

            const Comp = () =>
            {
                useTick(fn);

                return null;
            };

            const render = (withStage, withComp) => (
                <div>
                    {withStage && (
                        <App
                            cb={(_app) =>
                            {
                                if (!app)
                                {
                                    app = _app;
                                    add = jest.spyOn(app.ticker, 'add');
                                    remove = jest.spyOn(app.ticker, 'remove');
                                }

                                app.ticker.update();
                            }}
                        >
                            {withComp && <Comp />}
                        </App>
                    )}
                </div>
            );

            const { rerender, unmount } = reactTest.render(null);
            const updateRender = (stage, child) =>
            {
                if (add && remove)
                {
                    add.mockClear();
                    remove.mockClear();
                }

                rerender(render(stage, child));

                // jest modern fake timers trigger RAF, old ones didn't - this line didn't do anything in old jest, but now
                // triggers app.render
                // jest.advanceTimersByTime(1000);
            };

            // add all
            updateRender(true, true);
            expect(add).toBeCalledTimes(1);
            expect(remove).toBeCalledTimes(0);

            // remove comp only
            updateRender(true, false);
            expect(add).toBeCalledTimes(0);
            expect(remove).toBeCalledTimes(1);

            // add all and remove all
            updateRender(true, true);
            expect(add).toBeCalledTimes(1);
            expect(remove).toBeCalledTimes(0);

            updateRender(false, false);
            expect(add).toBeCalledTimes(0);
            expect(remove).toBeCalledTimes(1);

            // the call back should be called once
            expect(fn).toBeCalledTimes(1);

            unmount();
        });
    });
});
