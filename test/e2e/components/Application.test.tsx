import { Application as PixiApplication, type DestroyOptions, extensions as PixiExtensions, ExtensionType, type RendererDestroyOptions } from 'pixi.js';
import {
    createContext,
    createRef,
    type RefObject,
    useContext,
    useEffect,
} from 'react';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { Application } from '../../../src/components/Application';
import { roots } from '../../../src/core/roots';
import { useApplication } from '../../../src/hooks/useApplication';
import { type ApplicationRef } from '../../../src/typedefs/ApplicationRef';
import { isAppMounted } from '../../utils/isAppMounted';
import {
    act,
    render,
} from '@testing-library/react';

describe('Application', () =>
{
    it('mounts correctly', async () =>
    {
        const renderer = await act(async () => render(<Application />));

        expect(renderer.container).toMatchSnapshot();
    });

    it('forwards its ref', async () =>
    {
        const onInitSpy = vi.fn();
        const ref = createRef<ApplicationRef>();

        await act(async () => render((
            <Application
                ref={ref}
                onInit={onInitSpy} />
        )));

        await expect.poll(() => onInitSpy.mock.calls.length).toEqual(1);

        expect(ref.current?.getApplication()).toBeInstanceOf(PixiApplication);
        expect(ref.current?.getCanvas()).toBeInstanceOf(HTMLCanvasElement);
    });

    it('supports resizeTo refs from another window', async () =>
    {
        const onInitSpy = vi.fn();
        const appRef = createRef<ApplicationRef>();
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);

        const iframeDocument = iframe.contentDocument!;
        const resizeTarget = iframeDocument.createElement('div');
        iframeDocument.body.appendChild(resizeTarget);

        const resizeToRef = { current: resizeTarget } as RefObject<HTMLElement | null>;

        await act(async () => render((
            <Application
                ref={appRef}
                resizeTo={resizeToRef}
                onInit={onInitSpy} />
        )));

        await expect.poll(() => onInitSpy.mock.calls.length).toEqual(1);
        await expect.poll(() => appRef.current?.getApplication()?.resizeTo).toBe(resizeTarget);

        iframe.remove();
    });

    it('forwards context', async () =>
    {
        const onInitSpy = vi.fn();
        const ParentContext = createContext<boolean>(null!);
        let receivedValue!: boolean;

        function Test()
        {
            receivedValue = useContext(ParentContext);

            return null;
        }

        await act(async () => render((
            <ParentContext.Provider value={true}>
                <Application onInit={onInitSpy}>
                    <Test />
                </Application>
            </ParentContext.Provider>
        )));

        await expect.poll(() => onInitSpy.mock.calls.length).toEqual(1);

        expect(receivedValue).toBe(true);
    });

    describe('onInit', () =>
    {
        it('runs the callback once', async () =>
        {
            const onInitSpy = vi.fn();

            const TestComponent = () => (
                <Application onInit={onInitSpy} />
            );

            await act(async () => render((
                <TestComponent />
            )));

            await expect.poll(() => onInitSpy.mock.calls.length).toEqual(1);
        });
    });

    describe('unmount', () =>
    {
        it('unmounts after init', async () =>
        {
            let testApp = null as any as PixiApplication;
            let testAppIsInitialised = false;

            const TestChildComponent = () =>
            {
                const {
                    app,
                    isInitialised,
                } = useApplication();

                useEffect(() =>
                {
                    testApp = app;
                    testAppIsInitialised = isInitialised;

                    return () =>
                    {
                        testApp = app;
                        testAppIsInitialised = isInitialised;
                    };
                }, [
                    app,
                    isInitialised,
                ]);

                return null;
            };

            const TestComponent = () => (
                <Application>
                    <TestChildComponent />
                </Application>
            );

            expect(roots.size).toEqual(0);

            const { unmount } = await act(() => render(<TestComponent />));

            expect(roots.size).toEqual(1);

            await expect.poll(() => testAppIsInitialised).toEqual(true);

            unmount();

            expect(roots.size).toEqual(0);

            await expect.poll(() => isAppMounted(testApp)).toBeFalsy();
        });

        it('unmounts with destroyOptions', async () =>
        {
            let testApp = null as any as PixiApplication;
            let testAppIsInitialised = false;

            const destroyOptions: DestroyOptions = { children: true };

            const TestChildComponent = () =>
            {
                const {
                    app,
                    isInitialised,
                } = useApplication();

                useEffect(() =>
                {
                    testApp = app;
                    testAppIsInitialised = isInitialised;

                    return () =>
                    {
                        testApp = app;
                        testAppIsInitialised = isInitialised;
                    };
                }, [
                    app,
                    isInitialised,
                ]);

                return null;
            };

            const TestComponent = () => (
                <Application destroyOptions={destroyOptions}>
                    <TestChildComponent />
                </Application>
            );

            expect(roots.size).toEqual(0);

            const { unmount } = await act(() => render(<TestComponent />));

            expect(roots.size).toEqual(1);

            await expect.poll(() => testAppIsInitialised).toEqual(true);

            const destroySpy = vi.spyOn(testApp, 'destroy');

            unmount();

            expect(roots.size).toEqual(0);

            await expect.poll(() => isAppMounted(testApp)).toBeFalsy();

            expect(destroySpy).toHaveBeenCalledTimes(1);
            expect(destroySpy).toHaveBeenCalledWith(undefined, destroyOptions);
        });

        it('unmounts with rendererDestroyOptions', async () =>
        {
            let testApp = null as any as PixiApplication;
            let testAppIsInitialised = false;

            const rendererDestroyOptions: RendererDestroyOptions = { removeView: true };

            const TestChildComponent = () =>
            {
                const {
                    app,
                    isInitialised,
                } = useApplication();

                useEffect(() =>
                {
                    testApp = app;
                    testAppIsInitialised = isInitialised;

                    return () =>
                    {
                        testApp = app;
                        testAppIsInitialised = isInitialised;
                    };
                }, [
                    app,
                    isInitialised,
                ]);

                return null;
            };

            const TestComponent = () => (
                <Application rendererDestroyOptions={rendererDestroyOptions}>
                    <TestChildComponent />
                </Application>
            );

            expect(roots.size).toEqual(0);

            const { unmount } = await act(() => render(<TestComponent />));

            expect(roots.size).toEqual(1);

            await expect.poll(() => testAppIsInitialised).toEqual(true);

            const destroySpy = vi.spyOn(testApp, 'destroy');

            unmount();

            expect(roots.size).toEqual(0);

            await expect.poll(() => isAppMounted(testApp)).toBeFalsy();

            expect(destroySpy).toHaveBeenCalledTimes(1);
            expect(destroySpy).toHaveBeenCalledWith(rendererDestroyOptions, undefined);
        });

        it('unmounts during init', async () =>
        {
            let testApp = null as any as PixiApplication;
            let testAppIsInitialised = false;

            const TestChildComponent = () =>
            {
                const {
                    app,
                    isInitialised,
                } = useApplication();

                useEffect(() =>
                {
                    testApp = app;
                    testAppIsInitialised = isInitialised;

                    return () =>
                    {
                        testApp = app;
                        testAppIsInitialised = isInitialised;
                    };
                }, [
                    app,
                    isInitialised,
                ]);

                return null;
            };

            const TestComponent = () => (
                <Application>
                    <TestChildComponent />
                </Application>
            );

            expect(roots.size).toEqual(0);

            const { unmount } = await act(() => render(<TestComponent />));

            expect(roots.size).toEqual(1);

            expect(testAppIsInitialised).toBeFalsy();

            unmount();

            await expect.poll(() => isAppMounted(testApp)).toBeFalsy();

            expect(roots.size).toEqual(0);
        });
    });

    it('loads extensions provided in the extensions prop', async () =>
    {
        const customLoader = {
            extension: {
                type: ExtensionType.LoadParser,
                name: 'custom-loader',
                priority: 100,
            },
        };

        const addSpy = vi.spyOn(PixiExtensions, 'add');

        await act(async () => render((
            <Application extensions={[customLoader]} />
        )));

        expect(addSpy).toHaveBeenCalledWith(customLoader);
        addSpy.mockRestore();
    });
});
