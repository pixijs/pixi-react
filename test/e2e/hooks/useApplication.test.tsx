import { type Application as PixiApplication } from 'pixi.js';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { Application } from '../../../src/components/Application';
import { useApplication } from '../../../src/hooks/useApplication';
import {
    act,
    render,
    renderHook,
} from '@testing-library/react';

import type { ReactNode } from 'react';

describe('useApplication', () =>
{
    it('returns the nearest application', async () =>
    {
        let initApp: PixiApplication | null = null;
        let testApp: PixiApplication | null = null;

        const TestComponentWrapper = (props: {
            children?: ReactNode,
        }) =>
        {
            const { children } = props;

            const handleInit = (app: PixiApplication) => (initApp = app);

            return (
                <Application onInit={handleInit}>
                    {children}
                </Application>
            );
        };

        const TestComponent = () =>
        {
            const { app } = useApplication();

            if (app)
            {
                testApp = app;
            }

            return null;
        };

        await act(async () => render(<TestComponent />, {
            wrapper: TestComponentWrapper,
        }));

        await new Promise<void>((resolve) =>
        {
            const intervalID = setInterval(() =>
            {
                if (initApp)
                {
                    clearInterval(intervalID);
                    setTimeout(resolve, 10);
                }
            }, 10);
        });

        expect(testApp).toEqual(initApp);
    });

    it('throws when not in a React Pixi tree', () =>
    {
        const renderer = () => act(() => renderHook(() => useApplication()));

        expect(renderer).toThrowError(/no context found/i);
    });
});
