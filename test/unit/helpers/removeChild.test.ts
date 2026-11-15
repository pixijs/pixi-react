import {
    Container,
    Graphics,
    GraphicsContext,
} from 'pixi.js';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { prepareInstance } from '../../../src/helpers/prepareInstance';
import { removeChild } from '../../../src/helpers/removeChild';

describe('removeChild', () =>
{
    it('destroys descendant Graphics and their owned contexts when removing a subtree', () =>
    {
        const stage = new Container();
        const subtree = new Container();
        const nested = new Container();
        const graphics = new Graphics().rect(0, 0, 10, 10).fill(0xFF0000);
        const context = graphics.context;

        stage.addChild(subtree);
        subtree.addChild(nested);
        nested.addChild(graphics);

        removeChild(prepareInstance(stage), prepareInstance(subtree));

        expect(stage.children).toHaveLength(0);
        expect(nested.destroyed).toBe(true);
        expect(graphics.destroyed).toBe(true);
        expect(context.instructions).toBeNull();
    });

    it('preserves a supplied context still used by Graphics outside the removed subtree', () =>
    {
        const stage = new Container();
        const subtree = new Container();
        const context = new GraphicsContext().rect(0, 0, 10, 10).fill(0xFF0000);
        const removed = new Graphics({ context });
        const survivor = new Graphics({ context });

        stage.addChild(subtree, survivor);
        subtree.addChild(removed);

        removeChild(prepareInstance(stage), prepareInstance(subtree));

        expect(removed.destroyed).toBe(true);
        expect(survivor.destroyed).toBe(false);
        expect(survivor.context).toBe(context);
        expect(context.instructions).toHaveLength(1);
        expect(survivor.bounds.width).toBe(10);

        survivor.destroy();
        stage.destroy();
        context.destroy();
    });
});
