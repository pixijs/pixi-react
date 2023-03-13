import React, { createRef, Suspense } from 'react';
import { act } from 'react-dom/test-utils';
import type { DisplayObject } from '@pixi/display';
import { Container as PixiContainer } from '@pixi/display';
import { Text as PixiText } from '@pixi/text';

import { Container, Text } from '../src';
import { spyOnObjectMethods } from './__utils__/mock';
import { configure } from './__utils__/configure';
import type { lifeCycleConfigType, UpdatePayload } from '@pixi/react-types';
import type { PixiReactHostConfig } from '@pixi/react-fiber';
import type {
    createInstanceType,
    CreateRootType,
    PixiReactContainer,
    PixiReactText,
    PropsType,
    UnmountComponentAtNodeType,
} from '../src/types';

type CommitUpdateType<T extends DisplayObject> = (
    instance: T,
    updatePayload: UpdatePayload,
    type: string,
    prevProps: PropsType,
    nextProps: PropsType,
    internalHandle: any,
) => void;

describe('reconciler', () =>
{
    const prepareRenderToStage = (createRoot: CreateRootType, unmountComponentAtNode: UnmountComponentAtNodeType) =>
    {
        const container = new PixiContainer();

        // @ts-ignore - used for testing
        container.root = true;

        const root = createRoot(container);

        const renderToStage = (component: JSX.Element) =>
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
            cleanup,
        };
    };

    const prepare = (spyOnHostConfig = spyOnObjectMethods<PixiReactHostConfig<PixiReactContainer, PixiReactContainer>>) =>
    {
        const { roots, hostConfig, createRoot, unmountComponentAtNode } = configure({
            spyOnHostConfig,
        });

        const {
            container,
            renderToStage,
            cleanup: cleanupRenderToStage,
        } = prepareRenderToStage(createRoot, unmountComponentAtNode);

        const cleanup = () =>
        {
            cleanupRenderToStage();
            roots.clear();
        };

        return {
            hostConfig,
            createRoot,
            unmountComponentAtNode,
            container,
            renderToStage,
            cleanup,
        };
    };

    describe('single render', () =>
    {
        test('create instances', () =>
        {
            const { container, hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container x={0} y={0}>
                    <Text text="foo" />
                </Container>,
            );

            const mockedCreateInstance = hostConfig.createInstance as jest.MockedFunction<createInstanceType>;
            const { calls } = mockedCreateInstance.mock;

            expect(mockedCreateInstance).toHaveBeenCalledTimes(2);

            expect(calls[0][0]).toEqual('Text');
            expect(calls[0][1]).toEqual({ text: 'foo' });
            expect(calls[0][2]).toEqual(container);
            expect(calls[1][0]).toEqual('Container');
            expect(calls[1][1]).toEqual(expect.objectContaining({ x: 0, y: 0 }));
            expect(calls[1][1].children.type).toEqual('Text');
            expect(calls[1][2]).toEqual(container);

            cleanup();
        });

        test('append children', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container>
                    <Text text="bar" />
                </Container>,
            );

            const mockedAppendInitialChild = hostConfig.appendInitialChild as jest.MockedFunction<
                typeof hostConfig.appendInitialChild
            >;
            const { calls } = mockedAppendInitialChild.mock;

            expect(mockedAppendInitialChild).toHaveBeenCalledTimes(1);
            expect(calls[0][0]).toEqual(expect.any(PixiContainer));
            expect(calls[0][1]).toEqual(expect.any(PixiText));

            cleanup();
        });

        test('PIXI elements', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container x={10} y={100} pivot={'0.5,0.5'}>
                    <Text text="foobar" />
                </Container>,
            );

            const mockedAppendInitialChild = hostConfig.appendInitialChild as jest.MockedFunction<
                typeof hostConfig.appendInitialChild
            >;

            expect(mockedAppendInitialChild).toHaveBeenCalledTimes(1);

            const [childContainer, text] = mockedAppendInitialChild.mock.calls[0];

            expect(childContainer.x).toEqual(10);
            expect(childContainer.y).toEqual(100);
            expect(childContainer.pivot.x).toEqual(0.5);
            expect(childContainer.pivot.y).toEqual(0.5);

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
                </Container>,
            );

            renderToStage(
                <Container>
                    <Text text="one" />
                </Container>,
            );

            const mockedRemoveChild = hostConfig.removeChild as jest.MockedFunction<
                (parentInstance: PixiContainer, child: PixiText) => void
            >;

            expect(mockedRemoveChild).toHaveBeenCalledTimes(2);
            expect(mockedRemoveChild.mock.calls.map(([_, ins]) => ins.text)).toEqual(['two', 'three']);

            cleanup();
        });

        test('remove sub children', () =>
        {
            const a = createRef<PixiReactText>();
            const b = createRef<PixiReactText>();
            const c = createRef<PixiReactText>();
            const d = createRef<PixiReactText>();

            const { renderToStage, cleanup } = prepare();

            renderToStage(
                <Container>
                    <Container>
                        <Text ref={a} />
                        <Text ref={b} />
                        <Text ref={c} />
                        <Text ref={d} />
                    </Container>
                </Container>,
            );

            // assign willUnmounts
            const spyA = (a.current!.willUnmount = jest.fn());
            const spyB = (b.current!.willUnmount = jest.fn());
            const spyC = (c.current!.willUnmount = jest.fn());
            const spyD = (d.current!.willUnmount = jest.fn());

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
                </Container>,
            );

            renderToStage(
                <Container>
                    <Text key={1} text="one" />
                    <Text key={2} text="two" />
                    <Text key={3} text="three" />
                </Container>,
            );

            const mockedInsertBefore = hostConfig.insertBefore as jest.MockedFunction<
                (parentInstance: PixiContainer, child: PixiText, beforeChild: PixiText) => void
            >;

            const { calls } = mockedInsertBefore.mock;

            expect(calls[0][0]).toEqual(expect.any(PixiContainer)); // parent
            expect(calls[0][1].text).toEqual('two'); // child
            expect(calls[0][2].text).toEqual('three'); // beforeChild

            cleanup();
        });

        test('update elements', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(
                <Container>
                    <Text text="a" />
                </Container>,
            );

            renderToStage(
                <Container>
                    <Text text="b" />
                </Container>,
            );

            const mockedCommitUpdate = hostConfig.commitUpdate as jest.MockedFunction<CommitUpdateType<PixiText>>;
            const { calls } = mockedCommitUpdate.mock;

            expect(mockedCommitUpdate).toHaveBeenCalledTimes(1);
            expect(calls[0][3]).toHaveProperty('text', 'a');
            expect(calls[0][4]).toHaveProperty('text', 'b');
            expect(calls[0][0].text).toEqual('b');

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

            const mockedCommitUpdate = hostConfig.commitUpdate as jest.MockedFunction<CommitUpdateType<PixiText>>;
            const { calls } = mockedCommitUpdate.mock;

            expect(mockedCommitUpdate).toHaveBeenCalledTimes(1);

            expect(calls[0][0]).toEqual(expect.any(PixiText));
            expect(calls[0][1]).toEqual(['x', null]);
            expect(calls[0][2]).toEqual('Text');
            expect(calls[0][3]).toEqual({ x: 100 });
            expect(calls[0][4]).toEqual({});

            cleanup();
        });

        test('commitUpdate for prop change', () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();

            renderToStage(<Text x={100} />);
            renderToStage(<Text x={105} />);

            const mockedCommitUpdate = hostConfig.commitUpdate as jest.MockedFunction<CommitUpdateType<PixiText>>;
            const { calls } = mockedCommitUpdate.mock;

            expect(mockedCommitUpdate).toHaveBeenCalledTimes(1);

            expect(calls[0][0]).toEqual(expect.any(PixiText));
            expect(calls[0][1]).toEqual(['x', 105]);
            expect(calls[0][2]).toEqual('Text');
            expect(calls[0][3]).toEqual({ x: 100 });
            expect(calls[0][4]).toEqual({ x: 105 });

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
                </Container>,
            );

            const { calls } = didMount.mock;

            expect(didMount).toHaveBeenCalledTimes(2);
            expect(calls[0]).toEqual([expect.any(PixiText), expect.any(PixiContainer)]);
            expect(calls[0][1].root).toBeUndefined();

            expect(calls[1]).toEqual([expect.any(PixiContainer), expect.any(PixiContainer)]);
            expect(calls[1][0].root).toBeUndefined();
            expect(calls[1][1].root).toEqual(true);

            cleanup();
        });

        test('willUnmount', () =>
        {
            const { willUnmount, renderToStage, cleanup } = customLifeCyclePrepare();

            renderToStage(
                <Container>
                    <Text />
                </Container>,
            );

            renderToStage(<Container />);

            const { calls } = willUnmount.mock;

            expect(willUnmount).toHaveBeenCalledTimes(1);
            expect(calls[0]).toEqual([expect.any(PixiText), expect.any(PixiContainer)]);
            expect(calls[0][1].root).toBeUndefined();

            cleanup();
        });

        test('applyProps', () =>
        {
            const { applyProps, renderToStage, cleanup } = customLifeCyclePrepare();

            renderToStage(
                <Container>
                    <Text />
                </Container>,
            );

            renderToStage(
                <Container>
                    <Text x={100} />
                </Container>,
            );

            const { calls } = applyProps.mock;

            expect(applyProps).toHaveBeenCalledTimes(1);
            expect(calls[0]).toEqual([expect.any(PixiText), {}, { x: 100 }]);

            cleanup();
        });

        describe('config', () =>
        {
            const createInstances = (
                hostConfig: PixiReactHostConfig<PixiReactContainer, PixiReactContainer>,
                createInstance: createInstanceType,
                config: lifeCycleConfigType,
            ) =>
            {
                const instances: PixiContainer[] = [];

                const didMount = jest.fn();
                const willUnmount = jest.fn();
                const applyProps = jest.fn();

                (hostConfig.createInstance as jest.MockedFunction<createInstanceType>).mockImplementation((...args) =>
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
                let originalCreateInstance: createInstanceType;

                const { hostConfig, renderToStage, cleanup } = prepare((hostConfig) =>
                {
                    originalCreateInstance = hostConfig.createInstance;
                    jest.spyOn(hostConfig, 'createInstance');

                    return hostConfig;
                });

                const { instances: before } = createInstances(hostConfig, originalCreateInstance!, { destroy: true });

                renderToStage(<Container />);
                renderToStage(<></>);

                before.forEach((ins) => expect(ins.destroy).toHaveBeenCalled());

                const { instances: after } = createInstances(hostConfig, originalCreateInstance!, { destroy: false });

                renderToStage(<Container />);
                renderToStage(<></>);
                after.forEach((ins) => expect(ins.destroy).not.toHaveBeenCalled());

                cleanup();
            });

            test('destroyChildren', () =>
            {
                let originalCreateInstance: createInstanceType;

                const { hostConfig, renderToStage, cleanup } = prepare((hostConfig) =>
                {
                    originalCreateInstance = hostConfig.createInstance;
                    jest.spyOn(hostConfig, 'createInstance');

                    return hostConfig;
                });

                const { instances: before } = createInstances(hostConfig, originalCreateInstance!, {
                    destroyChildren: true,
                });

                renderToStage(
                    <Container>
                        <Text />
                    </Container>,
                );

                const spyBefore = jest.spyOn(before[1].children[0], 'destroy');

                renderToStage(<></>);
                expect(spyBefore).toHaveBeenCalled();

                const { instances: after } = createInstances(hostConfig, originalCreateInstance!, {
                    destroyChildren: false,
                });

                renderToStage(
                    <Container>
                        <Text />
                    </Container>,
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
        // fake Suspense API from https://codesandbox.io/s/frosty-hermann-bztrp?file=/src/fakeApi.js:395-857
        type WrappedPromise = { read: () => any };
        function wrapPromise(promise: Promise<any>): WrappedPromise
        {
            let status = 'pending';
            let result: any;
            const suspender = promise.then(
                (r: any) =>
                {
                    status = 'success';
                    result = r;
                },
                (e: any) =>
                {
                    status = 'error';
                    result = e;
                },
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
            let resolve: (...args: any[]) => any;

            const suspense = wrapPromise(
                new Promise((res) =>
                {
                    resolve = res;
                }),
            );

            return { suspense, resolve: resolve! };
        }

        function AsyncText({ suspense }: { suspense: WrappedPromise })
        {
            const text = suspense.read();

            return <Text text={text} />;
        }

        test('renders suspense fallback and content', async () =>
        {
            const { hostConfig, renderToStage, cleanup } = prepare();
            const { suspense, resolve } = getResolvableSuspenseAPI();

            const loadingTextRef = React.createRef<PixiText>();
            const siblingTextRef = React.createRef<PixiText>();

            renderToStage(
                <Suspense fallback={<Text text="loading" ref={loadingTextRef} />}>
                    <Text text="hidden" ref={siblingTextRef} />
                    <AsyncText suspense={suspense} />
                </Suspense>,
            );

            // loading Text should be rendered
            expect(loadingTextRef.current).toBeDefined();

            // content should be hidden
            const mockedHideInstance = hostConfig.hideInstance as jest.MockedFunction<
                (instance: PixiReactContainer) => void
            >;
            const mockedUnhideInstance = hostConfig.unhideInstance as jest.MockedFunction<
                (instance: PixiReactContainer) => void
            >;
            const mockedCreateInstance = hostConfig.createInstance as jest.MockedFunction<createInstanceType>;

            expect(mockedHideInstance).toHaveBeenCalledTimes(1);
            expect(siblingTextRef.current!.visible).toEqual(false);

            await act(async () =>
            {
                resolve('content');
            });

            // hidden content should be visible again
            expect(siblingTextRef.current!.visible).toEqual(true);

            // sibling text & AsyncText content is unhidden
            expect(mockedUnhideInstance).toHaveBeenCalledTimes(2);

            // loading text, sibling text, and async text content were all created
            expect(mockedCreateInstance.mock.calls.map(([ins]) => ins)).toEqual(['Text', 'Text', 'Text']);

            cleanup();
        });
    });

    describe('emits request render', () =>
    {
        function spyOnContainer(container: PixiReactContainer)
        {
            const spy = jest.fn();

            container.on('__REACT_PIXI_REQUEST_RENDER__', spy);

            return {
                spy,
                cleanup: () => container.off('__REACT_PIXI_REQUEST_RENDER__', spy),
            };
        }

        it('receives request events via root container', () =>
        {
            const { container, renderToStage, cleanup } = prepare();
            const { spy, cleanup: cleanupSpy } = spyOnContainer(container);

            renderToStage(
                <Container>
                    <Text text="one" />
                </Container>,
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
                cleanup: cleanupRenderToStage2,
            } = prepareRenderToStage(createRoot, unmountComponentAtNode);

            const { spy: spy2, cleanup: cleanupSpy2 } = spyOnContainer(container2);

            renderToStage(
                <Container>
                    <Text text="one" />
                </Container>,
            );

            renderToStage2(
                <Container>
                    <Text text="one" />
                </Container>,
            );

            renderToStage2(
                <Container>
                    <Text text="two" />
                </Container>,
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
