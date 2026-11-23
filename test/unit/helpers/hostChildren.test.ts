import {
    Container,
    Filter,
    Graphics,
    GraphicsContext,
    Sprite,
    Texture,
} from 'pixi.js';
import { createElement } from 'react';
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { reconciler } from '../../../src/core/reconciler';
import { appendChild } from '../../../src/helpers/appendChild';
import { applyProps } from '../../../src/helpers/applyProps';
import { createInstance } from '../../../src/helpers/createInstance';
import { extend } from '../../../src/helpers/extend';
import { hideInstance } from '../../../src/helpers/hideInstance';
import { insertBefore } from '../../../src/helpers/insertBefore';
import { prepareInstance } from '../../../src/helpers/prepareInstance';
import { removeChild } from '../../../src/helpers/removeChild';
import { unhideInstance } from '../../../src/helpers/unhideInstance';

/**
 * A minimal scene graph that isn't made of pixi.js Containers, with the child API they share,
 * standing in for 3D nodes.
 */
class Node
{
    public children: Node[] = [];
    public parent: Node | null = null;
    public visible = true;
    public position = { x: 0, y: 0, z: 0 };
    public destroyed = false;

    public addChild(child: Node)
    {
        return this.addChildAt(child, child.parent === this ? this.children.length - 1 : this.children.length);
    }

    public addChildAt(child: Node, index: number)
    {
        if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1);
        this.children.splice(index, 0, child);
        child.parent = this;

        return child;
    }

    public getChildIndex(child: Node)
    {
        return this.children.indexOf(child);
    }

    public removeChild(child: Node)
    {
        this.children.splice(this.children.indexOf(child), 1);
        child.parent = null;

        return child;
    }

    public destroy()
    {
        this.destroyed = true;
    }
}

/** A subclass that can't be constructed without arguments. */
class RequiredNode extends Node
{
    constructor(options: { name: string })
    {
        super();
        if (!options) throw new Error('options required');
    }
}

/** Filters that construct quietly in jsdom, tagged with a name for assertions. */
class FilterA extends Filter
{
    public n = '';

    constructor(options: { n?: string } = {})
    {
        super({} as any);
        Object.assign(this, options);
    }
}

class FilterB extends FilterA {}

/** Renders elements into a stage through the real reconciler. */
function createTestRoot()
{
    extend({ Container, FilterA, FilterB });

    const stage = prepareInstance(new Container());
    const root = (reconciler as any).createContainer(
        stage, 1, null, false, null, '', console.error, console.error, console.error, null,
    );

    return {
        stage: stage as unknown as Container,
        render(element: any)
        {
            (reconciler as any).updateContainerSync(element, root, null, null);
            (reconciler as any).flushSyncWork();
        },
    };
}

const container = (key: string) => createElement('pixiContainer', { key, label: key });
const filterA = (key: string) => createElement('pixiFilterA', { key, n: key });
const filterB = (key: string) => createElement('pixiFilterB', { key, n: key });

describe('host children', () =>
{
    afterEach(() =>
    {
        vi.restoreAllMocks();
    });

    it('warns once, instead of dropping silently, when a child can\'t be placed', () =>
    {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const parent = prepareInstance(new Container());

        appendChild(parent, prepareInstance({ unplaceable: true } as any, { type: 'unplaceable' }));
        appendChild(parent, prepareInstance({ unplaceable: true } as any, { type: 'unplaceable' }));

        expect(parent.children).toHaveLength(0);
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain('<unplaceable>');
    });

    it('nests any nodes with the shared child API, without an extension', () =>
    {
        const parent = prepareInstance(new Node() as any) as any;
        const a = prepareInstance(new Node() as any) as any;
        const b = prepareInstance(new Node() as any) as any;

        appendChild(parent, a);
        insertBefore(parent, b, a);
        expect(parent.children).toEqual([b, a]);

        removeChild(parent, b);
        expect(parent.children).toEqual([a]);
        expect(b.parent).toBeNull();
        expect(b.destroyed).toBe(true);
    });

    it('won\'t nest a pixi.js Container in another kind of node, or the other way round', () =>
    {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const node3D = prepareInstance(new Node() as any, { type: 'node' }) as any;
        const sprite = prepareInstance(new Container(), { type: 'sprite' });
        const parent = prepareInstance(new Container(), { type: 'container' });

        appendChild(node3D, sprite);
        appendChild(parent, node3D);

        expect(node3D.children).toHaveLength(0);
        expect(parent.children).toHaveLength(0);
        expect(warn).toHaveBeenCalledTimes(2);
    });

    it('moves a keyed filter to the end without duplicating it', () =>
    {
        const { stage, render } = createTestRoot();
        const filters = () => ((stage.children[0] as Container).filters as FilterA[]).map((filter) => filter.n);

        render(createElement('pixiContainer', null, [filterA('a'), filterB('b')]));
        render(createElement('pixiContainer', null, [filterB('b'), filterA('a')]));
        expect(filters()).toEqual(['b', 'a']);

        render(createElement('pixiContainer', null, [filterB('b')]));
        expect(filters()).toEqual(['b']);
    });

    it('places a container before the next container when its React sibling is a filter', () =>
    {
        const { stage, render } = createTestRoot();
        const labels = () => (stage.children[0] as Container).children.map((child) => child.label);

        render(createElement('pixiContainer', null, [container('A'), filterA('f'), container('B')]));
        render(createElement('pixiContainer', null, [container('A'), container('C'), filterA('f'), container('B')]));
        expect(labels()).toEqual(['A', 'C', 'B']);

        render(createElement('pixiContainer', null, [container('B'), filterA('f'), container('A'), container('C')]));
        expect(labels()).toEqual(['B', 'A', 'C']);
    });

    it('places a filter before the next filter when its React sibling is a container', () =>
    {
        const { stage, render } = createTestRoot();
        const filters = () => ((stage.children[0] as Container).filters as FilterA[]).map((filter) => filter.n);

        render(createElement('pixiContainer', null, [filterA('f1'), container('x'), filterB('f2')]));
        render(createElement('pixiContainer', null, [filterA('f1'), filterB('f0'), container('x'), filterB('f2')]));
        expect(filters()).toEqual(['f1', 'f0', 'f2']);

        render(createElement('pixiContainer', null, [container('x'), filterB('f2'), filterA('f1')]));
        expect(filters()).toEqual(['f2', 'f1']);
    });

    it('registers a moved child\'s `onRender` once, and none after unmount', () =>
    {
        extend({ Container });

        const stage = prepareInstance(new Container({ isRenderGroup: true }));
        const root = (reconciler as any).createContainer(
            stage, 1, null, false, null, '', console.error, console.error, console.error, null,
        );
        const render = (element: any) =>
        {
            (reconciler as any).updateContainerSync(element, root, null, null);
            (reconciler as any).flushSyncWork();
        };
        const onRender = () => undefined;
        const rendering = (keys: string[]) => keys.map((key) => createElement('pixiContainer', { key, onRender }));
        const registered = () => (stage.renderGroup as any)._onRenderContainers as Container[];

        render(rendering(['a', 'b', 'c']));
        render(rendering(['b', 'a', 'c']));
        render(rendering(['a', 'b', 'c']));
        expect(registered()).toHaveLength(3);

        render(rendering([]));
        expect(registered()).toHaveLength(0);
    });

    it('hides and unhides anything with a boolean `visible`', () =>
    {
        const instance = prepareInstance(new Node() as any) as any;

        hideInstance(instance);
        expect(instance.visible).toBe(false);

        unhideInstance(instance);
        expect(instance.visible).toBe(true);
    });
});

/** A node whose `size` setter counts how often it runs. */
class SizeHolder extends Container
{
    public sizeSets = 0;
    private _size = 0;

    constructor(options: { size?: number } = {})
    {
        super();
        if (options.size !== undefined) this._size = options.size;
    }

    get size()
    {
        return this._size;
    }

    set size(value)
    {
        this.sizeSets++;
        this._size = value;
    }
}

describe('createInstance', () =>
{
    it('skips initial props the constructor already set to the same value', () =>
    {
        extend({ SizeHolder });

        const instance = createInstance('pixiSizeHolder' as any, { size: 5 }, null as any) as any;

        expect(instance.size).toEqual(5);
        expect(instance.sizeSets).toEqual(0);
    });

    it('still applies an unchanged-looking prop that an earlier prop overwrote', () =>
    {
        extend({ Container, Sprite });

        const container = createInstance('pixiContainer', { position: { x: 5, y: 5 }, x: 0 }, null as any) as any;

        expect(container.x).toEqual(0);

        const sprite = createInstance(
            'pixiSprite',
            { texture: Texture.WHITE, scale: { x: -1, y: 1 }, width: 64, height: 64 },
            null as any,
        ) as any;

        expect(sprite.width).toEqual(64);
        expect(sprite.height).toEqual(64);
        expect(sprite.scale.x).toBeLessThan(0);
    });

    it('applies dashed props on mount', () =>
    {
        extend({ Container });

        const instance = createInstance('pixiContainer', { 'position-x': 5, y: 7 }, null as any) as any;

        expect(instance.x).toEqual(5);
        expect(instance.y).toEqual(7);
        expect(Object.keys(instance)).not.toContain('position-x');
    });

    it('sets a dashed prop that isn\'t a path into the instance as written', () =>
    {
        extend({ Container });

        const instance = createInstance('pixiContainer', { 'hitArea-x': 40, 'data-testid': 'box' }, null as any) as any;

        expect(instance.x).toEqual(0);
        expect(instance.hitArea).toBeFalsy();
        expect(instance['hitArea-x']).toEqual(40);
        expect(instance['data-testid']).toEqual('box');

        applyProps(instance, { changes: [['data-testid', '__defaultremove', false, ['data', 'testid']]] });
        expect('data-testid' in instance).toBe(false);
    });
});

describe('applyProps prop removal', () =>
{
    it('resets dashed props on pixi.js containers to their defaults', () =>
    {
        const instance = prepareInstance(new Container());

        applyProps(instance, { 'scale-x': 3 });
        expect(instance.scale.x).toEqual(3);

        applyProps(instance, { changes: [['scale-x', '__defaultremove', false, ['scale', 'x']]] });
        expect(instance.scale.x).toEqual(1);
    });

    it('resets props on non-Container nodes from a blank of their class', () =>
    {
        const instance = prepareInstance(new Node() as any) as any;

        instance.visible = false;
        instance.position = { x: 1, y: 2, z: 3 };

        applyProps(instance, {
            changes: [
                ['visible', '__defaultremove', false, []],
                ['position', '__defaultremove', false, []],
            ],
        });

        expect(instance.visible).toBe(true);
        expect(instance.position).toEqual({ x: 0, y: 0, z: 0 });

        const other = prepareInstance(new Node() as any) as any;

        applyProps(other, { changes: [['position', '__defaultremove', false, []]] });
        expect(other.position).not.toBe(instance.position);
    });

    it('leaves removed props unchanged when the class needs constructor arguments', () =>
    {
        const instance = prepareInstance(new RequiredNode({ name: 'n' }) as any) as any;

        instance.visible = false;
        instance.speed = 2;

        applyProps(instance, {
            changes: [
                ['visible', '__defaultremove', false, []],
                ['speed', '__defaultremove', false, []],
            ],
        });

        expect(instance.visible).toBe(false);
        expect(instance.speed).toEqual(2);
    });

    it('leaves a removed resource unchanged rather than copying the blank\'s', () =>
    {
        const graphics = new Graphics(new GraphicsContext());
        const context = graphics.context;

        applyProps(prepareInstance(graphics), { changes: [['context', '__defaultremove', false, []]] });
        expect(graphics.context).toBe(context);
    });

    it('resets a field the class declares but doesn\'t initialise', () =>
    {
        const instance = prepareInstance(new Container());

        applyProps(instance, { cursor: 'pointer' });
        expect(instance.cursor).toEqual('pointer');

        applyProps(instance, { changes: [['cursor', '__defaultremove', false, []]] });
        expect(instance.cursor).toBeUndefined();
    });

    it('clears a removed callback when the class needs constructor arguments', () =>
    {
        const instance = prepareInstance(new RequiredNode({ name: 'n' }) as any) as any;

        instance.onComplete = () => undefined;

        applyProps(instance, { changes: [['onComplete', '__defaultremove', false, []]] });
        expect(instance.onComplete).toBeNull();
    });

    it('deletes removed event handlers', () =>
    {
        const instance = prepareInstance(new Container());

        applyProps(instance, { onClick: () => undefined });
        expect(instance.onclick).toBeTypeOf('function');

        applyProps(instance, { changes: [['onClick', '__defaultremove', true, []]] });
        expect(instance.onclick).toBeFalsy();
    });
});
