import { type Application as PixiApplication } from 'pixi.js';
import { useEffect } from 'react';
import {
    createContext,
    createRef,
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
import { render } from '@testing-library/react';

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

            render(<TestComponent />);

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

            const { unmount } = render(<TestComponent />);

            expect(roots.size).toEqual(1);

            await expect.poll(() => testAppIsInitialised).toEqual(true);

            unmount();

            expect(roots.size).toEqual(0);

            await expect.poll(() => isAppMounted(testApp)).toBeFalsy();
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

            const { unmount } = render(<TestComponent />);

            expect(roots.size).toEqual(1);

            expect(testAppIsInitialised).toBeFalsy();

            unmount();

            await expect.poll(() => isAppMounted(testApp)).toBeFalsy();

            expect(roots.size).toEqual(0);
        });
    });
});
