import { type Application as PixiApplication } from 'pixi.js';
import { useEffect } from 'react';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { Application } from '../../../src/components/Application';
import { roots } from '../../../src/core/roots';
import { useApplication } from '../../../src/hooks/useApplication';
import { isAppMounted } from '../../utils/isAppMounted';
import { render } from '@testing-library/react';

describe('Application', () =>
{
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
