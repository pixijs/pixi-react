import {
    type Application as PixiApplication,
    Container,
    Graphics,
} from 'pixi.js';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { Application } from '../../../src/components/Application';
import { extend } from '../../../src/helpers/extend';
import {
    act,
    render,
} from '@testing-library/react';

extend({ Container, Graphics });

describe('Graphics lifecycle', () =>
{
    it('releases rendered descendant contexts when a Container subtree unmounts', async () =>
    {
        let app: PixiApplication;
        const onInit = (value: PixiApplication) =>
        {
            app = value;
            app.stop();
        };
        const draw = (graphics: Graphics) => graphics.rect(0, 0, 10, 10).fill(0xFF0000);
        const scene = (visible: boolean) => (
            <Application onInit={onInit} preference="webgl" autoStart={false}>
                {visible && (
                    <pixiContainer>
                        <pixiContainer>
                            <pixiGraphics draw={draw} />
                            <pixiGraphics draw={draw} />
                        </pixiContainer>
                    </pixiContainer>
                )}
            </Application>
        );
        const view = await act(async () => render(scene(true)));

        await expect.poll(() => app?.stage.children.length).toBe(1);

        const application = app!;

        for (let cycle = 0; cycle < 4; cycle++)
        {
            application.render();

            const subtree = application.stage.children[0];
            const graphics = [...subtree.children[0].children] as Graphics[];
            const contexts = graphics.map((child) => child.context);
            // The repository's PixiJS 8.2.6 registry; count non-null resources,
            // because destroyed entries leave null slots behind.
            const registry = (application.renderer as unknown as {
                graphicsContext: { _gpuContextHash: Record<string, unknown> };
            }).graphicsContext._gpuContextHash;

            expect(Object.values(registry).filter(Boolean)).toHaveLength(2);

            await act(async () => view.rerender(scene(false)));
            await expect.poll(() => application.stage.children.length).toBe(0);

            expect(graphics.every((child) => child.destroyed)).toBe(true);
            expect(contexts.every((context) => context.instructions === null)).toBe(true);
            expect(Object.values(registry).filter(Boolean)).toHaveLength(0);

            if (cycle < 3)
            {
                await act(async () => view.rerender(scene(true)));
                await expect.poll(() => application.stage.children.length).toBe(1);
            }
        }

        view.unmount();
    });
});
