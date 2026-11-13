import { Graphics } from 'pixi.js';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { applyProps } from '../../../src/helpers/applyProps';
import { prepareInstance } from '../../../src/helpers/prepareInstance';

describe('applyProps Graphics draw updates', () =>
{
    it('reuses one context and keeps drawing instructions bounded across changing callbacks', () =>
    {
        const graphics = prepareInstance(new Graphics());
        const context = graphics.context;

        for (let frame = 0; frame < 20; frame++)
        {
            const draw = (target: Graphics) =>
            {
                target.rect(0, 0, frame + 1, 10).fill(0xFF0000);
            };

            applyProps(graphics, { draw });

            expect(graphics.context).toBe(context);
            expect(context.instructions).toHaveLength(1);
        }

        graphics.destroy();
    });

    it('clears stale drawing commands when the draw prop is removed', () =>
    {
        const graphics = prepareInstance(new Graphics());

        applyProps(graphics, {
            draw: (target: Graphics) =>
            {
                target.rect(0, 0, 10, 10).fill(0xFF0000);
            },
        });

        expect(graphics.context.instructions).toHaveLength(1);

        applyProps(graphics, {
            changes: [
                [
                    'draw',
                    '__defaultremove',
                    false,
                    [],
                ],
            ],
        });

        expect(graphics.context.instructions).toHaveLength(0);

        graphics.destroy();
    });
});
