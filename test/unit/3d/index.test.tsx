import {
    ColorMatrixFilter,
    Container,
    RenderTexture,
    Sprite,
} from 'pixi.js';
import {
    useLayoutEffect,
    useRef,
} from 'react';
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    Camera3D,
    Container3D,
    DirectionalLight,
    type Pointer3DEvent,
    View3D,
} from '@pixi/3d';
import { reconciler } from '../../../src/core/reconciler';
import { extend } from '../../../src/helpers/extend';
import { hideInstance } from '../../../src/helpers/hideInstance';
import { prepareInstance } from '../../../src/helpers/prepareInstance';
import { unhideInstance } from '../../../src/helpers/unhideInstance';
import '../../../src/3d';

extend({ Camera3D, ColorMatrixFilter, Container, Container3D, DirectionalLight, Sprite, View3D });

/** Renders elements into a stage through the real reconciler. */
function createTestRoot()
{
    const stage = prepareInstance(new Container());
    const root = (reconciler as any).createContainer(
        stage, 1, null, false, null, '', console.error, console.error, console.error, null,
    );

    return {
        stage: stage as unknown as Container,
        view: () => (stage as unknown as Container).children[0] as unknown as View3D,
        render(element: any)
        {
            (reconciler as any).updateContainerSync(element, root, null, null);
            (reconciler as any).flushSyncWork();
        },
    };
}

/** The labels of the children React made, skipping the view's own camera. */
const labels = (node: Container3D) => node.children.filter((child) => '__pixireact' in child).map((child) => child.label);

describe('@pixi/react/3d', () =>
{
    afterEach(() =>
    {
        vi.restoreAllMocks();
    });

    it('puts a view\'s children in its scene, nested as declared', () =>
    {
        const { view, render } = createTestRoot();

        render(
            <pixiView3D>
                <pixiDirectionalLight label="sun" />
                <pixiContainer3D label="group">
                    <pixiContainer3D label="inner" position-x={2} />
                </pixiContainer3D>
            </pixiView3D>,
        );

        const group = view().root.children.find((child) => child.label === 'group')!;

        expect(view().children).toHaveLength(0);
        expect(labels(view().root)).toEqual(['sun', 'group']);
        expect(labels(group)).toEqual(['inner']);
        expect(group.children[0].position.x).toEqual(2);
    });

    it('keeps keyed 3D children in React order, moving them in place', () =>
    {
        const { view, render } = createTestRoot();
        const scene = (keys: string[]) => (
            <pixiView3D>
                {keys.map((key) => <pixiContainer3D key={key} label={key} />)}
            </pixiView3D>
        );

        render(scene(['a', 'b', 'c']));
        const a = view().root.children.find((child) => child.label === 'a')!;
        const b = view().root.children.find((child) => child.label === 'b')!;
        const removed = vi.fn();

        a.on('removed', removed);
        b.on('removed', removed);

        render(scene(['c', 'a', 'b']));
        render(scene(['b', 'c', 'a']));
        expect(labels(view().root)).toEqual(['b', 'c', 'a']);
        expect(a.view3d).toBe(view());
        expect(removed).not.toHaveBeenCalled();

        render(scene(['b', 'c']));
        expect(labels(view().root)).toEqual(['b', 'c']);
        expect(a.parent).toBeNull();
    });

    it('applies a filter to the view, and warns instead of crashing on a 2D child', () =>
    {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const { view, render } = createTestRoot();

        render(
            <pixiView3D>
                <pixiColorMatrixFilter />
                <pixiSprite />
                <pixiContainer3D label="kept" />
            </pixiView3D>,
        );

        expect(view().filters).toHaveLength(1);
        expect(view().children).toHaveLength(0);
        expect(labels(view().root)).toEqual(['kept']);
        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn.mock.calls[0][0]).toContain('<sprite>');
    });

    it('leaves a `<pixiCamera3D>` as a scene node', () =>
    {
        const { view, render } = createTestRoot();

        render(<pixiView3D><pixiCamera3D label="minimap" /></pixiView3D>);
        expect(view().camera.label).not.toEqual('minimap');
    });

    it('renders with a camera the app assigns, and its own again once React removes or hides it', () =>
    {
        const { view, render } = createTestRoot();
        const scene = (rig: boolean) => (
            <pixiView3D>
                {rig && (
                    <pixiContainer3D key="rig" label="rig">
                        <pixiCamera3D label="rigCamera" />
                    </pixiContainer3D>
                )}
            </pixiView3D>
        );

        render(scene(true));
        const own = view().camera;
        const rig = view().root.children.find((child) => child.label === 'rig')!;

        view().camera = rig.children[0] as Camera3D;
        hideInstance(rig as any);
        expect(view().camera).toBe(own);

        unhideInstance(rig as any, {});
        view().camera = rig.children[0] as Camera3D;
        render(scene(false));
        expect(view().camera).toBe(own);
    });

    it('renders with a rig camera assigned in a layout effect, and its own once the rig unmounts', () =>
    {
        const { view, render } = createTestRoot();
        const Rig = () =>
        {
            const camera = useRef<Camera3D>(null);

            useLayoutEffect(() =>
            {
                camera.current!.view3d!.camera = camera.current!;
            }, []);

            return <pixiContainer3D><pixiCamera3D label="rigCamera" ref={camera} /></pixiContainer3D>;
        };

        render(<pixiView3D />);
        const own = view().camera;

        render(<pixiView3D><Rig /></pixiView3D>);
        expect(view().camera.label).toEqual('rigCamera');

        render(<pixiView3D />);
        expect(view().camera).toBe(own);
    });

    it('falls back when its camera starts rendering to a texture', () =>
    {
        const { view, render } = createTestRoot();
        const renderTexture = RenderTexture.create({ width: 4, height: 4 });
        const scene = (texture: RenderTexture | null) => <pixiView3D><pixiCamera3D label="a" renderTexture={texture} /></pixiView3D>;

        render(scene(null));
        const own = view().camera;

        view().camera = view().root.children.find((child) => child.label === 'a') as Camera3D;
        render(scene(renderTexture));
        expect(view().camera).toBe(own);
    });

    it('gives the view a new camera when the app moved its own into a rig that leaves', () =>
    {
        const { view, render } = createTestRoot();
        const scene = (rig: boolean) => <pixiView3D>{rig && <pixiContainer3D key="rig" label="rig" />}</pixiView3D>;
        const drawable = (camera: Camera3D) => camera.view3d === view() && camera.visible && !camera.destroyed;

        render(scene(true));
        const rig = view().root.children.find((child) => child.label === 'rig')!;

        rig.addChild(view().camera);
        hideInstance(rig as any);
        expect(drawable(view().camera)).toBe(true);
        unhideInstance(rig as any);

        rig.addChild(view().camera);
        render(scene(false));
        expect(drawable(view().camera)).toBe(true);
    });

    it('falls back when React removes a rig the app moved', () =>
    {
        const { view, render } = createTestRoot();
        const scene = (rig: boolean) => (
            <pixiView3D>
                {rig && (
                    <pixiContainer3D key="rig" label="rig">
                        <pixiCamera3D label="rigCamera" />
                    </pixiContainer3D>
                )}
            </pixiView3D>
        );

        render(scene(true));
        const own = view().camera;
        const rig = view().root.children.find((child) => child.label === 'rig')!;
        const holder = new Container3D();

        view().root.addChild(holder);
        holder.addChild(rig);
        view().camera = rig.children[0] as Camera3D;

        render(scene(false));
        expect(view().camera).toBe(own);
    });

    it('configures the view\'s own camera with `camera` props', () =>
    {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const { view, render } = createTestRoot();

        render(<pixiView3D camera={{ fov: 40, near: 1 }} camera-position-z={4} />);
        const own = view().camera;

        expect([own.fov, own.near, own.position.z]).toEqual([40, 1, 4]);

        render(<pixiView3D camera={{ fov: 50 }} />);
        expect([own.fov, own.near, own.position.z]).toEqual([50, new Camera3D().near, 0]);

        const assigned = new Camera3D();

        view().camera = assigned;
        render(<pixiView3D camera={{ fov: 60 }} />);
        expect(view().camera).toBe(assigned);
        expect(own.fov).toEqual(60);

        // @ts-expect-error Only props
        render(<pixiView3D camera={new Camera3D()} />);
        expect(view().camera).toBe(assigned);
        expect(warn.mock.calls[0][0]).toContain('`view.camera`');
    });

    it('lets `camera-*` props win over the `camera` object, in any order', () =>
    {
        const { view, render } = createTestRoot();
        const z = () => view().camera.position.z;

        render(<pixiView3D camera-position-z={4} camera={{ position: { x: 0, y: 0, z: 1 } }} />);
        expect(z()).toEqual(4);

        render(<pixiView3D camera-position-z={5} camera={{ position: { x: 0, y: 0, z: 2 } }} />);
        expect(z()).toEqual(5);

        render(<pixiView3D camera-position-z={5} camera={{ position: { x: 0, y: 0, z: 3 } }} />);
        expect(z()).toEqual(5);
    });

    describe('overlapping `camera` props', () =>
    {
        const at = (z: number) => ({ x: 0, y: 0, z });
        const dashed = (props: Record<string, unknown>) =>
            Object.fromEntries(Object.entries(props).map(([key, value]) => [`camera-${key}`, value]));

        const cases: [string, Record<string, unknown>[], number][] = [
            ['mounting, narrow first', [{ 'position-z': 4, position: at(1) }], 4],
            ['the broad one changes', [{ position: at(1), 'position-z': 4 }, { position: at(2), 'position-z': 4 }], 4],
            ['the broad one changes, narrow first', [{ 'position-z': 4, position: at(1) }, { 'position-z': 4, position: at(2) }], 4],
            ['both change, narrow first', [{ 'position-z': 4, position: at(1) }, { 'position-z': 5, position: at(2) }], 5],
            ['the broad one goes', [{ position: at(1), 'position-z': 4 }, { 'position-z': 4 }], 4],
            ['the narrow one goes', [{ position: at(1), 'position-z': 4 }, { position: at(1) }], 1],
            ['the narrow one goes as the broad one changes', [{ position: at(1), 'position-z': 4 }, { position: at(2) }], 2],
        ];

        it.each(cases)('resolves them like any element: %s', (_name, renders, expected) =>
        {
            const viewDashed = createTestRoot();
            const viewObject = createTestRoot();
            const viewMixed = createTestRoot();
            const element = createTestRoot();

            renders.forEach((props) =>
            {
                const { position, ...narrow } = props;

                viewDashed.render(<pixiView3D {...dashed(props)} />);
                viewObject.render(<pixiView3D camera={props} />);
                viewMixed.render(<pixiView3D {...dashed(narrow)} camera={position ? { position: position as any } : {}} />);
                element.render(<pixiView3D><pixiContainer3D label="node" {...props} /></pixiView3D>);
            });

            const node = element.view().root.children.find((child) => child.label === 'node')!;

            expect(node.position.z).toEqual(expected);
            expect(viewDashed.view().camera.position.z).toEqual(expected);
            expect(viewObject.view().camera.position.z).toEqual(expected);
            expect(viewMixed.view().camera.position.z).toEqual(expected);
        });

        it('uses the `camera` object\'s value again once the dashed prop for it goes', () =>
        {
            const { view, render } = createTestRoot();

            render(<pixiView3D camera={{ fov: 40 }} camera-fov={50} />);
            expect(view().camera.fov).toEqual(50);

            render(<pixiView3D camera={{ fov: 40 }} />);
            expect(view().camera.fov).toEqual(40);
        });

        it('lets a narrow prop in the object win over a broad dashed one', () =>
        {
            const { view, render } = createTestRoot();
            const scene = (z: number) => <pixiView3D {...{ camera: { 'position-z': 4 } as any }} camera-position={at(z)} />;

            render(scene(1));
            expect(view().camera.position.z).toEqual(4);

            render(scene(2));
            expect(view().camera.position.z).toEqual(4);
        });

        it('keeps the declared order of props that set the same value under different names', () =>
        {
            const z = (...renders: Record<string, unknown>[]) =>
            {
                const { view, render } = createTestRoot();

                renders.forEach((props) => render(<pixiView3D {...props} />));

                return view().camera.position.z;
            };

            expect(z({ 'camera-position-z': 4, 'camera-z': 5 })).toEqual(5);
            expect(z({ 'camera-z': 5, 'camera-position-z': 4 })).toEqual(4);
            expect(z({ camera: { 'position-z': 4 }, 'camera-z': 5 })).toEqual(5);
            expect(z({ camera: { z: 1, position: at(2) }, 'camera-z': 5 })).toEqual(5);

            // Whichever was declared first on an earlier render
            expect(z({ 'camera-z': 1 }, { 'camera-position-z': 4, 'camera-z': 5 })).toEqual(5);
            expect(z({ 'camera-z': 1 }, {}, { 'camera-position-z': 4, 'camera-z': 5 })).toEqual(5);
        });

        it('leaves the other axes where the app moved them when a narrow prop changes', () =>
        {
            const { view, render } = createTestRoot();
            const scene = (z: number) => <pixiView3D camera-position={at(1)} camera-position-z={z} />;

            render(scene(4));
            view().camera.position.x = 10;

            render(scene(5));
            expect([view().camera.position.x, view().camera.position.z]).toEqual([10, 5]);
        });

        it('keeps the remaining narrow props when one goes', () =>
        {
            const { view, render } = createTestRoot();

            render(<pixiView3D camera-position={at(1)} camera-position-x={3} camera-position-z={4} />);
            render(<pixiView3D camera-position={at(1)} camera-position-x={3} />);
            expect([view().camera.position.x, view().camera.position.z]).toEqual([3, 1]);
        });

        it('gives a replacement own camera the props still set', () =>
        {
            const { view, render } = createTestRoot();
            const rigOf = () => view().root.children.find((child) => child.label === 'rig')!;

            render(
                <pixiView3D camera={{ fov: 40, near: undefined }} camera-fov={50} camera-position={at(1)} camera-position-z={4}>
                    <pixiContainer3D key="rig" label="rig" />
                </pixiView3D>,
            );
            render(
                <pixiView3D camera={{ fov: 40, near: undefined }} camera-position={at(2)} camera-position-z={4}>
                    <pixiContainer3D key="rig" label="rig" />
                </pixiView3D>,
            );

            const own = view().camera;

            rigOf().addChild(own);
            render(<pixiView3D camera={{ fov: 40, near: undefined }} camera-position={at(2)} camera-position-z={4} />);

            expect(view().camera).not.toBe(own);
            expect([view().camera.fov, view().camera.near, view().camera.position.z]).toEqual([40, new Camera3D().near, 4]);
        });
    });

    it('applies `camera` props only when they change, so the camera can be moved', () =>
    {
        const { view, render } = createTestRoot();
        const scene = (fov: number) => <pixiView3D camera={{ fov, position: { x: 0, y: 0, z: 4 } }} camera-rotation-y={0.5} />;

        render(scene(40));
        view().camera.position.z = 10;
        view().camera.rotation.y = 1;

        render(scene(40));
        expect([view().camera.position.z, view().camera.rotation.y]).toEqual([10, 1]);

        render(scene(50));
        expect([view().camera.fov, view().camera.position.z, view().camera.rotation.y]).toEqual([50, 10, 1]);
    });

    it('removes an event handler dropped from the `camera` object', () =>
    {
        const { view, render } = createTestRoot();
        const onClick = () => undefined;

        render(<pixiView3D camera={{ onClick }} />);
        expect((view().camera as any).onclick).toBe(onClick);

        render(<pixiView3D camera={{}} />);
        expect((view().camera as any).onclick).toBeFalsy();
    });

    it('falls back when React removes a rig the app moved into another view', () =>
    {
        const { stage, render } = createTestRoot();
        const views = () => stage.children as unknown as View3D[];
        const scene = (rig: boolean) => (
            <>
                <pixiView3D key="a">
                    {rig && (
                        <pixiContainer3D key="rig" label="rig">
                            <pixiCamera3D label="rigCamera" />
                        </pixiContainer3D>
                    )}
                </pixiView3D>
                <pixiView3D key="b" />
            </>
        );

        render(scene(true));
        const [a, b] = views();
        const own = b.camera;
        const rig = a.root.children.find((child) => child.label === 'rig')!;

        b.root.addChild(rig);
        b.camera = rig.children[0] as Camera3D;

        render(scene(false));
        expect(b.camera).toBe(own);
    });

    it('configures a replacement own camera with the same `camera` props', () =>
    {
        const { view, render } = createTestRoot();
        const scene = (rig: boolean) => (
            <pixiView3D camera={{ fov: 30 }} camera-position-z={4}>
                {rig && <pixiContainer3D key="rig" label="rig" />}
            </pixiView3D>
        );

        render(scene(true));
        view().root.children.find((child) => child.label === 'rig')!.addChild(view().camera);
        render(scene(false));

        expect([view().camera.fov, view().camera.position.z]).toEqual([30, 4]);
        expect(view().camera.view3d).toBe(view());
    });

    it('ignores a `root` prop, with a warning', () =>
    {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const { view, render } = createTestRoot();
        const root = new Container3D();

        // @ts-expect-error The types leave it out too
        render(<pixiView3D root={root} root-position-x={5} />);

        expect(view().root).not.toBe(root);
        expect(view().root.position.x).toEqual(0);
        expect(warn.mock.calls.map(([message]) => message).join('\n')).toContain('`root`');
    });

    it('hides and reveals 3D nodes', () =>
    {
        const { view, render } = createTestRoot();

        render(<pixiView3D><pixiContainer3D label="node" /></pixiView3D>);
        const node = view().root.children.find((child) => child.label === 'node')!;

        hideInstance(node as any);
        expect(node.visible).toBe(false);

        unhideInstance(node as any);
        expect(node.visible).toBe(true);
    });

    it('resets removed props to their defaults', () =>
    {
        const { view, render } = createTestRoot();

        render(<pixiView3D><pixiContainer3D label="node" position={{ x: 1, y: 2, z: 3 }} scale={2} visible={false} /></pixiView3D>);
        render(<pixiView3D><pixiContainer3D label="node" /></pixiView3D>);

        const node = view().root.children.find((child) => child.label === 'node')!;

        expect([node.position.x, node.position.y, node.position.z]).toEqual([0, 0, 0]);
        expect([node.scale.x, node.scale.y, node.scale.z]).toEqual([1, 1, 1]);
        expect(node.visible).toBe(true);
    });

    it('types 3D elements, their children and their event handlers', () =>
    {
        const element = (
            <pixiView3D autoResize camera={{ fov: 40 }}>
                <pixiContainer3D onPointerDown={(event) =>
                {
                    const hit: Pointer3DEvent = event;

                    return hit;
                }}
                >
                    <pixiContainer3D />
                </pixiContainer3D>
            </pixiView3D>
        );

        expect(element.type).toEqual('pixiView3D');
    });
});
