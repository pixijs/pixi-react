import { Application as PixiApplication, Container, Graphics } from 'pixi.js';
import { useEffect, useState } from 'react';
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { createApplication } from '../../../src/core/createApplication';
import { extend } from '../../../src/helpers/extend';
import { act, render } from '@testing-library/react';

// Make Graphics available for JSX
extend({ Graphics, Container });

describe('createApplication', () =>
{
    let app1: PixiApplication;
    let app2: PixiApplication;
    let container1: Container;
    let container2: Container;

    beforeEach(async () =>
    {
        // Create two separate Pixi applications for testing isolation
        app1 = new PixiApplication();
        app2 = new PixiApplication();

        // Wait for applications to fully initialize
        await app1.init({
            width: 400,
            height: 300,
            backgroundColor: 0x1000bb,
            backgroundAlpha: 1,
        });
        await app2.init({
            width: 400,
            height: 300,
            backgroundColor: 0x1099bb,
            backgroundAlpha: 1,
        });

        container1 = new Container();
        container2 = new Container();

        app1.stage.addChild(container1);
        app2.stage.addChild(container2);

        // Start the tickers explicitly to ensure they're running
        app1.ticker.start();
        app2.ticker.start();

        // Add canvas to the document body for rendering
        document.body.appendChild(app1.canvas);
        document.body.appendChild(app2.canvas);

        // Wait for applications to be ready
        await new Promise((resolve) => setTimeout(resolve, 100));
    });

    afterEach(async () =>
    {
        // Clean up applications
        if (app1?.ticker)
        {
            app1.ticker.stop();
        }
        if (app2?.ticker)
        {
            app2.ticker.stop();
        }

        if (app1?.stage)
        {
            app1.destroy({ removeView: true });
        }
        if (app2?.stage)
        {
            app2.destroy({ removeView: true });
        }

        // Reset variables
        app1 = null as any;
        app2 = null as any;
        container1 = null as any;
        container2 = null as any;
    });

    it('useApp returns the correct application instance', async () =>
    {
        const { useApp, createRoot } = createApplication(app1);
        let capturedApp: PixiApplication | null = null;

        const TestComponent = () =>
        {
            const app = useApp();

            useEffect(() =>
            {
                capturedApp = app;
            }, [app]);

            return null;
        };

        let root: any;

        void act(() =>
        {
            root = createRoot(container1, <TestComponent />);
        });

        await expect.poll(() => capturedApp).toBe(app1);
        expect(capturedApp).toBeInstanceOf(PixiApplication);

        void act(() => root?.unmount());
    });

    it('useApp throws when used outside of createRoot context', () =>
    {
        const { useApp } = createApplication(app1);

        const TestComponent = () =>
        {
            useApp(); // This should throw

            return null;
        };

        expect(() =>
        {
            void act(() => render(<TestComponent />));
        }).toThrow();
    });

    it('useTick integrates with application ticker', async () =>
    {
        const { useTick, createRoot } = createApplication(app1);
        const tickCallback = vi.fn();
        let callbackExecuted = false;

        const TestComponent = () =>
        {
            useTick((ticker) =>
            {
                tickCallback(ticker);
                callbackExecuted = true;
            });

            return <pixiGraphics draw={
                () =>
                {
                    // Do nothing
                }
            } />;
        };

        let root: any;

        void act(() =>
        {
            root = createRoot(container1, <TestComponent />);
        });

        // Wait for ticker to execute with longer timeout
        await expect.poll(() => callbackExecuted, { timeout: 3000 }).toBe(true);
        expect(tickCallback.mock.calls.length).toBeGreaterThan(0);
        expect(tickCallback.mock.lastCall?.[0]).toBe(app1.ticker);

        void act(() => root?.unmount());
    });

    it('useTick with options object works correctly', async () =>
    {
        const { useTick, createRoot } = createApplication(app1);
        const tickCallback = vi.fn();
        let callbackExecuted = false;

        const TestComponent = () =>
        {
            useTick({
                callback: (ticker) =>
                {
                    tickCallback(ticker);
                    callbackExecuted = true;
                }
            });

            return <pixiGraphics draw={() =>
            {
                // Do nothing
            }} />;
        };

        let root: any;

        void act(() =>
        {
            root = createRoot(container1, <TestComponent />);
        });

        await expect.poll(() => callbackExecuted, { timeout: 3000 }).toBe(true);
        expect(tickCallback.mock.lastCall?.[0]).toBe(app1.ticker);

        void act(() => root?.unmount());
    });

    it('useTick can be disabled', async () =>
    {
        const { useTick, createRoot } = createApplication(app1);
        const tickCallback = vi.fn();

        const TestComponent = () =>
        {
            useTick({
                callback: tickCallback,
                isEnabled: false,
            });

            return <pixiGraphics draw={() =>
            {
                // Do nothing
            }} />;
        };

        let root: any;

        void act(() =>
        {
            root = createRoot(container1, <TestComponent />);
        });

        // Wait a bit to ensure ticker doesn't execute
        await new Promise((resolve) => setTimeout(resolve, 500));
        expect(tickCallback).not.toHaveBeenCalled();

        void act(() => root?.unmount());
    });

    it('createRoot mounts and unmounts React components', () =>
    {
        const { createRoot } = createApplication(app1);
        let mounted = false;
        let unmounted = false;

        const TestComponent = () =>
        {
            useEffect(() =>
            {
                mounted = true;

                return () =>
                {
                    unmounted = true;
                };
            }, []);

            return <pixiGraphics draw={() =>
            {
                // Do nothing
            }} />;
        };

        let root: any;

        void act(() =>
        {
            root = createRoot(container1, <TestComponent />);
        });

        expect(mounted).toBe(true);
        expect(container1.children.length).toBeGreaterThan(0);

        void act(() => root?.unmount());

        expect(unmounted).toBe(true);
        expect(container1.children.length).toBe(0);
    });

    it('maintains context isolation between different application instances', async () =>
    {
        const { useApp: useApp1, createRoot: createRoot1 } = createApplication(app1);
        const { useApp: useApp2, createRoot: createRoot2 } = createApplication(app2);

        let capturedApp1: PixiApplication | null = null;
        let capturedApp2: PixiApplication | null = null;

        const TestComponent1 = () =>
        {
            const app = useApp1();

            useEffect(() =>
            {
                capturedApp1 = app;
            }, [app]);

            return <pixiGraphics draw={() =>
            {
                // Do nothing
            }} />;
        };

        const TestComponent2 = () =>
        {
            const app = useApp2();

            useEffect(() =>
            {
                capturedApp2 = app;
            }, [app]);

            return <pixiGraphics draw={() =>
            {
                // Do nothing
            }} />;
        };

        let root1: any; let
            root2: any;

        void act(() =>
        {
            root1 = createRoot1(container1, <TestComponent1 />);
            root2 = createRoot2(container2, <TestComponent2 />);
        });

        await expect.poll(() => capturedApp1).toBe(app1);
        await expect.poll(() => capturedApp2).toBe(app2);
        expect(capturedApp1).not.toBe(capturedApp2);

        void act(() =>
        {
            root1?.unmount();
            root2?.unmount();
        });
    });

    it('supports multiple roots on the same application', () =>
    {
        const { createRoot } = createApplication(app1);

        const TestComponent = () => <pixiGraphics draw={() =>
        {
            // Do nothing
        }} />;

        let root1: any; let
            root2: any;

        void act(() =>
        {
            root1 = createRoot(container1, <TestComponent />);
            root2 = createRoot(container2, <TestComponent />);
        });

        expect(container1.children.length).toBeGreaterThan(0);
        expect(container2.children.length).toBeGreaterThan(0);

        void act(() =>
        {
            root1?.unmount();
            root2?.unmount();
        });

        expect(container1.children.length).toBe(0);
        expect(container2.children.length).toBe(0);
    });

    it('handles remounting correctly', () =>
    {
        const { createRoot } = createApplication(app1);
        const TestComponent = () => <pixiGraphics draw={() =>
        {
            // Do nothing
        }} />;

        // Mount
        let root: any;

        void act(() =>
        {
            root = createRoot(container1, <TestComponent />);
        });
        expect(container1.children.length).toBeGreaterThan(0);

        // Unmount
        void act(() => root?.unmount());
        expect(container1.children.length).toBe(0);

        // Remount
        void act(() =>
        {
            root = createRoot(container1, <TestComponent />);
        });
        expect(container1.children.length).toBeGreaterThan(0);

        // Final cleanup
        void act(() => root?.unmount());
    });

    it('should eacute example code without errors', async () =>
    {
        type RotatingSquareOpts = {
            x: number;
            y: number;
            color: number;
            rotation: number;
        };

        type TestComponentOpts = {
            x: number;
            y: number;
            color: number;
            speed: number;
        };

        const { createRoot: createRoot1, useTick: useTick1 } = createApplication(app1);
        const { createRoot: createRoot2, useTick: useTick2 } = createApplication(app2);

        const RotatingSquare = ({ x, y, color, rotation }: RotatingSquareOpts) =>
            (
                <pixiContainer x={x} y={y} rotation={rotation}>
                    <pixiGraphics
                        draw={(graphics) =>
                        {
                            graphics.clear();
                            graphics.rect(-50, -50, 100, 100);
                            graphics.fill(color);
                        }}
                    />
                </pixiContainer>
            );

        const TestComponent1 = ({ x, y, color, speed }: TestComponentOpts) =>
        {
            const [rotation, setRotation] = useState(0);

            // Use the tick hook to animate
            useTick1((ticker) =>
            {
                setRotation((r) => r + speed * ticker.deltaTime);
            });

            return (<RotatingSquare x={x} y={y} color={color} rotation={rotation} />);
        };

        const TestComponent2 = ({ x, y, color, speed }: TestComponentOpts) =>
        {
            const [rotation, setRotation] = useState(0);

            // Use the tick hook to animate
            useTick2((ticker) =>
            {
                setRotation((r) => r - speed * ticker.deltaTime);
            });

            return (<RotatingSquare x={x} y={y} color={color} rotation={rotation} />);
        };

        let red: any;
        let green: any;
        let blue: any;
        let yellow: any;

        void act(() =>
        {
            red = createRoot1(container1, <TestComponent1 x={200} y={100} color={0xff0000} speed={0.01} />);
            green = createRoot1(container1, <TestComponent1 x={200} y={200} color={0x00ff00} speed={-0.01} />);
            blue = createRoot2(container2, <TestComponent2 x={200} y={100} color={0x0000ff} speed={0.01} />);
            yellow = createRoot2(container2, <TestComponent2 x={200} y={200} color={0xffff00} speed={-0.01} />);
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Final cleanup
        void act(() =>
        {
            red?.unmount();
            green?.unmount();
            blue?.unmount();
            yellow?.unmount();
        });
    });
});
