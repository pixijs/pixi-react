import React, { createRef, Suspense } from 'react';
import { act } from 'react-dom/test-utils';
import { Container as PixiContainer } from '@pixi/display';
import { Text as PixiText } from '@pixi/text';

import { Container, Text } from '../src';
import { getCall, spyOnObjectMethods } from './__utils__/mock';
import { clearComponents, configure } from './__utils__/configure';

describe('reconciler', () =>
{
    const prepareRenderToStage = (createRoot, unmountComponentAtNode) =>
    {
        const container = new PixiContainer();

        container.root = true;

        const root = createRoot(container);

        const renderToStage = (component) =>
            act(() =>
            {
                root.render(component);
            });

        const cleanup = () =>
        {
            unmountComponentAtNode(container);
        };

        return {
            container,
            renderToStage,
            cleanup
        };
    };

    const prepare = (spyOnHostConfig = spyOnObjectMethods) =>
    {
        const { roots, hostConfig, createRoot, unmountComponentAtNode } = configure({
            spyOnHostConfig
        });

        const {
            container,
            renderToStage,
            cleanup: cleanupRenderToStage
        } = prepareRenderToStage(createRoot, unmountComponentAtNode);

        const cleanup = () =>
        {
            cleanupRenderToStage();
            clearComponents();
            roots.clear();
        };

        return {
            hostConfig,
            createRoot,
            unmountComponentAtNode,
            container,
            renderToStage,
            cleanup
        };
    };

    describe('single render', () =>
    {
        test('create instances', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container x={0} y={0}>
                    <Text text="foo" />
                </Container>
            );

            const m = getCall(hostConfig.createInstance);

            expect(m.fn).toHaveBeenCalledTimes(2);
            expect(m.all.map(([ins]) => ins)).toEqual(['Text', 'Container']);

            const text = m(0);

            expect(text.args[1]).toEqual({ text: 'foo' });
            expect(text.args[2]).toBeInstanceOf(PixiContainer);

            const container = m(1).args[1];

            expect(container).toHaveProperty('x', 0);
            expect(container).toHaveProperty('y', 0);
            expect(container).toHaveProperty('children');
            expect(container.children.type).toEqual('Text');

            cleanup();
        });

        test('append children', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container>
                    <Text text="bar" />
                </Container>
            );

            const m = getCall(hostConfig.appendInitialChild);

            expect(m.fn).toHaveBeenCalledTimes(1);
            expect(m(0).args[0]).toBeInstanceOf(PixiContainer);
            expect(m(0).args[1]).toBeInstanceOf(PixiText);

            cleanup();
        });

        test('PIXI elements', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container x={10} y={100} pivot={'0.5,0.5'}>
                    <Text text="foobar" />
                </Container>
            );

            const m = getCall(hostConfig.appendInitialChild)(0);

            const container = m.args[0];

            expect(container.x).toEqual(10);
            expect(container.y).toEqual(100);
            expect(container.pivot.x).toEqual(0.5);
            expect(container.pivot.y).toEqual(0.5);

            const text = m.args[1];

            expect(text.text).toEqual('foobar');

            cleanup();
        });
    });

    describe('rerender', () =>
    {
        test('remove children', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container>
                    <Text text="one" />
                    <Text text="two" />
                    <Text text="three" />
                </Container>
            );

            renderToStage(
                <Container>
                    <Text text="one" />
                </Container>
            );

            const m = getCall(hostConfig.removeChild);

            expect(m.fn).toHaveBeenCalledTimes(2);
            expect(m.all.map(([_, ins]) => ins.text)).toEqual(['two', 'three']);

            cleanup();
        });

        test('remove sub children', () =>
        {
            const a = createRef();
            const b = createRef();
            const c = createRef();
            const d = createRef();

            const { renderToStage, cleanup } = prepare();

            renderToStage(
                <Container>
                    <Container>
                        <Text ref={a} />
                        <Text ref={b} />
                        <Text ref={c} />
                        <Text ref={d} />
                    </Container>
                </Container>
            );

            // assign willUnmounts
            const spyA = (a.current.willUnmount = jest.fn());
            const spyB = (b.current.willUnmount = jest.fn());
            const spyC = (c.current.willUnmount = jest.fn());
            const spyD = (d.current.willUnmount = jest.fn());

            renderToStage(<Container />);

            expect(spyA).toHaveBeenCalled();
            expect(spyB).toHaveBeenCalled();
            expect(spyC).toHaveBeenCalled();
            expect(spyD).toHaveBeenCalled();

            cleanup();
        });

        test('insert before', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container>
                    <Text key={1} text="one" />
                    <Text key={3} text="three" />
                </Container>
            );

            renderToStage(
                <Container>
                    <Text key={1} text="one" />
                    <Text key={2} text="two" />
                    <Text key={3} text="three" />
                </Container>
            );

            const m = getCall(hostConfig.insertBefore)(0);

            expect(m.args[0]).toBeInstanceOf(PixiContainer); // parent
            expect(m.args[1].text).toEqual('two'); // child
            expect(m.args[2].text).toEqual('three'); // beforeChild

            cleanup();
        });

        test('update elements', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container>
                    <Text text="a" />
                </Container>
            );

            renderToStage(
                <Container>
                    <Text text="b" />
                </Container>
            );

            const m = getCall(hostConfig.commitUpdate);

            expect(m.fn).toHaveBeenCalledTimes(1);
            expect(m(0).args[3]).toHaveProperty('text', 'a');
            expect(m(0).args[4]).toHaveProperty('text', 'b');
            expect(m(0).args[0].text).toEqual('b');

            cleanup();
        });
    });

    describe('prepare updates', () =>
    {
        test('prevent commitUpdate when prop is not changed, ', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(<Text x={100} />);
            renderToStage(<Text x={100} />);

            expect(hostConfig.commitUpdate).not.toBeCalled();

            cleanup();
        });

        test('commitUpdate for prop removal', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(<Text x={100} />);
            renderToStage(<Text />);

            const m = getCall(hostConfig.commitUpdate);

            expect(m.fn).toHaveBeenCalledTimes(1);

            const args = m(0).args;

            expect(args[0]).toBeInstanceOf(PixiText);
            expect(args[1]).toEqual(['x', null]);
            expect(args[2]).toEqual('Text');
            expect(args[3]).toEqual({ x: 100 });
            expect(args[4]).toEqual({});

            cleanup();
        });

        test('commitUpdate for prop change', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(<Text x={100} />);
            renderToStage(<Text x={105} />);

            const m = getCall(hostConfig.commitUpdate);

            expect(m.fn).toHaveBeenCalledTimes(1);

            const args = m(0).args;

            expect(args[0]).toBeInstanceOf(PixiText);
            expect(args[1]).toEqual(['x', 105]);
            expect(args[2]).toEqual('Text');
            expect(args[3]).toEqual({ x: 100 });
            expect(args[4]).toEqual({ x: 105 });

            cleanup();
        });
    });

    describe('custom lifecycles', () =>
    {
        const customLifeCyclePrepare = () =>
        {
            const didMount = jest.fn();
            const willUnmount = jest.fn();
            const applyProps = jest.fn();

            const result = prepare((hostConfig) =>
            {
                const { createInstance } = hostConfig;

                jest.spyOn(hostConfig, 'createInstance').mockImplementation((...args) =>
                {
                    const instance = createInstance(...args);

                    instance.didMount = (...args) => didMount(...args);
                    instance.willUnmount = (...args) => willUnmount(...args);
                    instance.applyProps = (...args) => applyProps(...args);

                    return instance;
                });

                return hostConfig;
            });

            return {
                ...result,
                didMount,
                willUnmount,
                applyProps,
            };
        };

        test('didMount', () =>
        {
            const { didMount, renderToStage, cleanup } = customLifeCyclePrepare();

            renderToStage(
                <Container>
                    <Text />
                </Container>
            );

            expect(didMount).toHaveBeenCalledTimes(2);

            const text = getCall(didMount)(0).args;

            expect(text[0]).toBeInstanceOf(PixiText);
            expect(text[1]).toBeInstanceOf(PixiContainer);
            expect(text[1].root).toBeUndefined();

            const container = getCall(didMount)(1).args;

            expect(container[0]).toBeInstanceOf(PixiContainer);
            expect(container[0].root).toBeUndefined();
            expect(container[1]).toBeInstanceOf(PixiContainer);
            expect(container[1].root).toEqual(true);

            cleanup();
        });

        test('willUnmount', () =>
        {
            const { willUnmount, renderToStage, cleanup } = customLifeCyclePrepare();

            renderToStage(
                <Container>
                    <Text />
                </Container>
            );

            renderToStage(<Container />);

            expect(willUnmount).toHaveBeenCalledTimes(1);

            const m = getCall(willUnmount)(0).args;

            expect(m[0]).toBeInstanceOf(PixiText);
            expect(m[1]).toBeInstanceOf(PixiContainer);
            expect(m[1].root).toBeUndefined();

            cleanup();
        });

        test('applyProps', () =>
        {
            const { applyProps, renderToStage, cleanup } = customLifeCyclePrepare();

            renderToStage(
                <Container>
                    <Text />
                </Container>
            );

            renderToStage(
                <Container>
                    <Text x={100} />
                </Container>
            );

            expect(applyProps).toHaveBeenCalledTimes(1);

            const m = getCall(applyProps);

            expect(m(0).args[0]).toBeInstanceOf(PixiText);
            expect(m(0).args[1]).toEqual({});
            expect(m(0).args[2]).toEqual({ x: 100 });

            cleanup();
        });

        describe('config', () =>
        {
            const identity = (val) => val;

            const createInstances = (hostConfig, createInstance, config) =>
            {
                const instances = [];

                const didMount = jest.fn();
                const willUnmount = jest.fn();
                const applyProps = jest.fn();

                hostConfig.createInstance.mockImplementation((...args) =>
                {
                    const instance = createInstance(...args);

                    instance.didMount = (...args) => didMount(...args);
                    instance.willUnmount = (...args) => willUnmount(...args);
                    instance.applyProps = (...args) => applyProps(...args);
                    instance.config = config;
                    instances.push(instance);
                    jest.spyOn(instance, 'destroy');

                    return instance;
                });

                return {
                    instances,
                    didMount,
                    willUnmount,
                    applyProps,
                };
            };

            test('destroy', () =>
            {
                let originalCreateInstance;

                const { hostConfig, renderToStage, cleanup } = prepare((hostConfig) =>
                {
                    originalCreateInstance = hostConfig.createInstance;
                    jest.spyOn(hostConfig, 'createInstance');

                    return hostConfig;
                });

                const { instances: before } = createInstances(hostConfig, originalCreateInstance, { destroy: true });

                renderToStage(<Container />);
                renderToStage(<></>);

                before.forEach((ins) => expect(ins.destroy).toHaveBeenCalled());

                const { instances: after } = createInstances(hostConfig, originalCreateInstance, { destroy: false });

                renderToStage(<Container />);
                renderToStage(<></>);
                after.forEach((ins) =>
                    expect(ins.destroy).not.toHaveBeenCalled()
                );

                cleanup();
            });

            test('destroyChildren', () =>
            {
                let originalCreateInstance;

                const { hostConfig, renderToStage, cleanup } = prepare((hostConfig) =>
                {
                    originalCreateInstance = hostConfig.createInstance;
                    jest.spyOn(hostConfig, 'createInstance');

                    return hostConfig;
                });

                const { instances: before } = createInstances(hostConfig, originalCreateInstance, { destroyChildren: true });

                renderToStage(
                    <Container>
                        <Text />
                    </Container>
                );

                const spyBefore = jest.spyOn(before[1].children[0], 'destroy');

                renderToStage(<></>);
                expect(spyBefore).toHaveBeenCalled();

                const { instances: after } = createInstances(hostConfig, originalCreateInstance, { destroyChildren: false });

                renderToStage(
                    <Container>
                        <Text />
                    </Container>
                );
                const spyAfter = jest.spyOn(after[1].children[0], 'destroy');

                renderToStage(<></>);
                expect(spyAfter).not.toHaveBeenCalled();

                cleanup();
            });
        });
    });

    describe('suspense', () =>
    {
        let asyncLoaded = false;

        beforeEach(() =>
        {
            asyncLoaded = false;
        });

        // fake Suspense API from https://codesandbox.io/s/frosty-hermann-bztrp?file=/src/fakeApi.js:395-857
        function wrapPromise(promise)
        {
            let status = 'pending';
            let result;
            const suspender = promise.then(
                (r) =>
                {
                    status = 'success';
                    result = r;
                },
                (e) =>
                {
                    status = 'error';
                    result = e;
                }
            );

            return {
                // eslint-disable-next-line consistent-return
                read()
                {
                    if (status === 'pending')
                    {
                        throw suspender;
                    }
                    else if (status === 'error')
                    {
                        throw result;
                    }
                    else if (status === 'success')
                    {
                        return result;
                    }
                },
            };
        }

        function getResolvableSuspenseAPI()
        {
            let resolve;

            const suspense = wrapPromise(
                new Promise((res) =>
                {
                    resolve = res;
                })
            );

            return { suspense, resolve };
        }

        function AsyncText({ suspense })
        {
            const text = suspense.read();

            return <Text text={text} />;
        }

        test('renders suspense fallback and content', async () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();
            const { suspense, resolve } = getResolvableSuspenseAPI();

            const loadingTextRef = React.createRef(null);
            const siblingTextRef = React.createRef(null);

            renderToStage(
                <Suspense
                    fallback={<Text text="loading" ref={loadingTextRef} />}
                >
                    <Text text="hidden" ref={siblingTextRef} />
                    <AsyncText suspense={suspense} />
                </Suspense>
            );

            // loading Text should be rendered
            expect(loadingTextRef.current).toBeDefined();

            // content should be hidden
            const hideInstanceMock = getCall(hostConfig.hideInstance);

            expect(hideInstanceMock.fn).toHaveBeenCalledTimes(1);
            expect(siblingTextRef.current.visible).toEqual(false);

            await act(async () =>
            {
                resolve('content');
            });

            // hidden content should be visible again
            expect(siblingTextRef.current.visible).toEqual(true);

            // sibling text & AsyncText content is unhidden
            const unhideInstanceMock = getCall(hostConfig.unhideInstance);

            expect(unhideInstanceMock.fn).toHaveBeenCalledTimes(2);

            // loading text, sibling text, and async text content were all created
            const createInstanceMock = getCall(hostConfig.createInstance);

            expect(createInstanceMock.all.map(([ins]) => ins)).toEqual([
                'Text',
                'Text',
                'Text',
            ]);

            cleanup();
        });
    });

    describe('emits request render', () =>
    {
        function spyOnContainer(container)
        {
            const spy = jest.fn();

            container.on('__REACT_PIXI_REQUEST_RENDER__', spy);

            return {
                spy,
                cleanup: () =>
                    container.off('__REACT_PIXI_REQUEST_RENDER__', spy),
            };
        }

        it('receives request events via root container', () =>
        {
            const { container, renderToStage, cleanup } = prepare();
            const { spy, cleanup: cleanupSpy } = spyOnContainer(container);

            renderToStage(
                <Container>
                    <Text text="one" />
                </Container>
            );

            expect(spy).toHaveBeenCalled();

            cleanup();
            cleanupSpy();
        });

        it('receives different events in different containers', () =>
        {
            const { container, renderToStage, createRoot, unmountComponentAtNode, cleanup } = prepare();
            const { spy, cleanup: cleanupSpy } = spyOnContainer(container);

            const {
                container: container2,
                renderToStage: renderToStage2,
                cleanup: cleanupRenderToStage2
            } = prepareRenderToStage(createRoot, unmountComponentAtNode);

            const { spy: spy2, cleanup: cleanupSpy2 } = spyOnContainer(container2);

            renderToStage(
                <Container>
                    <Text text="one" />
                </Container>
            );

            renderToStage2(
                <Container>
                    <Text text="one" />
                </Container>
            );

            renderToStage2(
                <Container>
                    <Text text="two" />
                </Container>
            );

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy2).toHaveBeenCalledTimes(2);

            cleanupSpy();
            cleanupSpy2();
            cleanupRenderToStage2();
            cleanup();
        });
    });
});
