import {
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import { type Application as PixiApplication } from 'pixi.js';
import { render } from '@testing-library/react';
import { useEffect } from 'react';

import { Application } from '../../../src/components/Application';
import { isAppMounted } from '../../utils/isAppMounted';
import { useApplication } from '../../../src/hooks/useApplication';

describe('Application', () => {
    describe('onInit', () => {
        it('runs the callback once', async () => {
            const onInitSpy = vi.fn();

            const TestComponent = () => (
                <Application onInit={onInitSpy} />
            );

            render(<TestComponent />);

            await expect.poll(() => onInitSpy.mock.calls.length).toEqual(1);
        });
    });

    describe('unmount', () => {
        it('unmounts after init', async () => {
            let testApp = null as any as PixiApplication;
            let testAppIsInitialised = false;

            const TestChildComponent = () => {
                const {
                    app,
                    isInitialised,
                } = useApplication();

                useEffect(() => {
                    testApp = app
                    testAppIsInitialised = isInitialised

                    return () => {
                        testApp = app
                        testAppIsInitialised = isInitialised
                    }
                }, [
                    app,
                    isInitialised,
                ])

                return null;
            };

            const TestComponent = () => (
                <Application>
                    <TestChildComponent />
                </Application>
            );

            const { unmount } = render(<TestComponent />);

            await expect.poll(() => testAppIsInitialised).toEqual(true);

            unmount();

            await expect.poll(() => isAppMounted(testApp)).toBeFalsy();
        });

        it('unmounts during init', async () => {
            let testApp = null as any as PixiApplication;
            let testAppIsInitialised = false;

            const TestChildComponent = () => {
                const {
                    app,
                    isInitialised,
                } = useApplication();

                useEffect(() => {
                    testApp = app
                    testAppIsInitialised = isInitialised

                    return () => {
                        testApp = app
                        testAppIsInitialised = isInitialised
                    }
                }, [
                    app,
                    isInitialised,
                ])

                return null;
            };

            const TestComponent = () => (
                <Application>
                    <TestChildComponent />
                </Application>
            );

            const { unmount } = render(<TestComponent />);

            expect(testAppIsInitialised).to.be.false;

            unmount();

            await expect.poll(() => isAppMounted(testApp)).toBeFalsy();
        });
    });
});
