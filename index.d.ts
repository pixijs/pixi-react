import * as PIXI from 'pixi.js';
import * as React from 'react';

// Reconciler API
interface Reconciler<Instance, TextInstance, Container, PublicInstance> {
  updateContainerAtExpirationTime(
    element: any,
    container: any,
    parentComponent: React.Component<any, any> | null | undefined,
    expirationTime: any,
    callback: () => void | null | undefined,
  ): any;
  createContainer(
    containerInfo: any,
    isConcurrent: boolean,
    hydrate: boolean,
  ): any;
  updateContainer(
    element: any,
    container: any,
    parentComponent: React.Component<any, any> | null | undefined,
    callback: () => void | null | undefined
  ): any
  flushRoot(root: any, expirationTime: any): void
  requestWork(root: any, expirationTime: any): void
  computeUniqueAsyncExpiration(): any
  batchedUpdates<A>(fn: () => A): A
  unbatchedUpdates<A>(fn: () => A): A
  deferredUpdates<A>(fn: () => A): A
  syncUpdates<A>(fn: () => A): A
  interactiveUpdates<A>(fn: () => A): A
  flushInteractiveUpdates(): void
  flushControlled(fn: () => any): void
  flushSync<A>(fn: () => A): A
  getPublicRootInstance(container: any): React.Component<any, any> | PublicInstance | null
  findHostInstance(component: object): PublicInstance | null
  findHostInstanceWithNoPortals(component: any): PublicInstance | null
  injectIntoDevTools(devToolsConfig: any): boolean
}

// private
declare namespace _ReactPixi {
  type ApplicationOptions = ConstructorParameters<typeof PIXI.Application>[0];
  type RequiredProperty<T, I extends keyof T> = Omit<T, I> & { [P in I]-?: T[I] };
  type PointLike = PIXI.Point | PIXI.ObservablePoint | [number, number] | [number] | number;
  type WithPointLike<O extends object, T extends keyof any> = Omit<O, T> & { [P in T]?: PointLike };

  type ImageSource = string | HTMLImageElement;
  type VideoSource = string | HTMLVideoElement;
  type AllSource = number | ImageSource | VideoSource | HTMLCanvasElement | PIXI.Texture;

  interface WithSource {
    /**
     * Directly apply an image
     *
     * @example
     *
     * image="./image.png"
     */
    image?: ImageSource;

    /**
     * Directly apply a video
     *
     * @example
     *
     * video="./video.mp4"
     */
    video?: VideoSource;

    /**
     * Directly apply a source.
     * Can be an image, video, canvas, frame id or even a texture
     *
     * @example
     *
     * source="./image.jpg"
     * source="./video.mp4"
     * source={document.querySelector('img')}
     * source={document.querySelector('video')}
     * source={document.querySelector('canvas')}
     */
    source?: AllSource;
  }

  type InteractionEvents = {
    [P in PIXI.interaction.InteractionEventTypes]?: (event: PIXI.interaction.InteractionEvent) => void
  };

  type Container<T extends { [key: string]: any }> = WithPointLike<
    Omit<Partial<T>, 'children'>,
    'position' | 'scale' | 'pivot'
  > & InteractionEvents;

  type ISprite = WithPointLike<Container<PIXI.Sprite>, 'anchor'> & WithSource;
  type IText = WithPointLike<Container<PIXI.Text>, 'anchor'>;
  type IContainer = Container<PIXI.Container>;
  type IGraphics = Container<PIXI.Graphics> & {
    /**
     * Draw a graphic with imperative callback.
     *
     * @param {PIXI.Graphics} graphics - The graphics instance to draw on
     * @example
     *
     * draw={g => {
     *   g.beginFill(0xff0000);
     *   g.drawRect(0,0,100,100);
     *   g.endFill();
     * }}
     */
    draw?(graphics: PIXI.Graphics): void;

    /**
     * Set `preventRedraw` to true to force the component to be drawn only once
     *
     * @example
     *
     * preventRedraw={true}
     */
    preventRedraw?: boolean;
  };

  type IBitmapText = Container<WithPointLike<PIXI.BitmapText, 'anchor'>> & {
    /**
     * Set the style object
     *
     * @example
     *
     * style={{ font: '50px Desyrel' }}
     */
    style?: ConstructorParameters<typeof PIXI.BitmapText>[1];
  };

  type INineSlicePlane = Container<PIXI.NineSlicePlane> & WithSource;

  type IParticleContainer = Container<PIXI.ParticleContainer> & {
    maxSize?: ConstructorParameters<typeof PIXI.ParticleContainer>[0];
    properties?: ConstructorParameters<typeof PIXI.ParticleContainer>[1];
    batchSize?: ConstructorParameters<typeof PIXI.ParticleContainer>[2];
    autoResize?: ConstructorParameters<typeof PIXI.ParticleContainer>[3];
  };

  type ITilingSprite = RequiredProperty<
    Container<WithPointLike<PIXI.TilingSprite, 'tileScale' | 'tilePosition'>> & WithSource,
    'tilePosition'
  >;

  type ISimpleRope = Container<PIXI.SimpleRope> & WithSource;

  type ISimpleMesh = Container<PIXI.SimpleMesh> & WithSource & {
    uvs?: ConstructorParameters<typeof PIXI.SimpleMesh>[2];
    indices?: ConstructorParameters<typeof PIXI.SimpleMesh>[3];
  };

  type IStage = React.CanvasHTMLAttributes<HTMLCanvasElement> & {
    /**
     * Width of the Stage and canvas
     */
    width?: number;

    /**
     * Height of the Stage and canvas
     */
    height?: number;

    /**
     * Enable the {@see PIXI.Application} ticker? [default=true].
     * Automatically renders the stage on request animation frame.
     */
    raf?: boolean;

    /**
     * Update the PIXI renderer on component updates [default=true]
     * For this to work you need to disable raf.
     *
     * @deprecated this is experimental
     */
    renderOnComponentChange?: boolean;

    /**
     * The PIXI application options.
     *
     * @see PIXI.ApplicationOptions
     * @example
     *
     * options={{ antialias: true, roundPixels: true }}
     */
    options?: ApplicationOptions;

    /**
     * Callback when the component is successfully mounted
     *
     * @param {PIXI.Application} app
     */
    onMount?(app: PIXI.Application): void;

    /**
     * Callback when the component is successfully unmounted
     *
     * @param {PIXI.Application} app
     */
    onUnmount?(app: PIXI.Application): void;
  };

  interface ICustomComponent<P extends { [key: string]: any }, PixiInstance extends PIXI.DisplayObject> {
    /**
     * Create the PIXI instance
     * The component is created during React reconciliation.
     *
     * @param props passed down props
     * @returns {PixiInstance}
     */
    create(props: P): PixiInstance;

    /**
     * Instance mounted
     * This is called during React reconciliation.
     *
     * @param {PixiInstance} instance
     * @param {PIXI.Container} parent
     */
    didMount?(instance: PixiInstance, parent: PIXI.Container): void;

    /**
     * Instance will unmount
     * This is called during React reconciliation.
     *
     * @param {PixiInstance} instance
     * @param {PIXI.Container} parent
     */
    willUnmount?(instance: PixiInstance, parent: PIXI.Container): void;

    /**
     * Apply props for this custom component.
     * This is called during React reconciliation.
     *
     * @param {PixiInstance} instance
     * @param oldProps
     * @param newProps
     */
    applyProps?(instance: PixiInstance, oldProps: Readonly<P>, newProps: Readonly<P>): void;
  }
}

// components
export class Sprite extends React.Component<_ReactPixi.ISprite> {}
export class Text extends React.Component<_ReactPixi.IText> {}
export class Container extends React.Component<_ReactPixi.IContainer> {}
export class Graphics extends React.Component<_ReactPixi.IGraphics> {}
export class BitmapText extends React.Component<_ReactPixi.IBitmapText> {}
export class NineSlicePlane extends React.Component<_ReactPixi.INineSlicePlane> {}
export class ParticleContainer extends React.Component<_ReactPixi.IParticleContainer> {}
export class TilingSprite extends React.Component<_ReactPixi.ITilingSprite> {}
export class SimpleRope extends React.Component<_ReactPixi.ISimpleRope> {}
export class SimpleMesh extends React.Component<_ReactPixi.ISimpleMesh> {}

// renderer
export const render: (
  element: React.ReactElement | React.ReactElement[] | React.Factory<any>,
  container: PIXI.Container,
  callback?: (...args: any) => void
) => any;

// context
export const AppContext: React.Context<PIXI.Application>;
export const AppProvider: React.ComponentType<React.ProviderProps<PIXI.Application>>;
export const AppConsumer: React.ComponentType<React.ConsumerProps<PIXI.Application>>;

// fiber
export const PixiFiber: Reconciler<any, any, any, any>;

// stage
export class Stage extends React.Component<_ReactPixi.IStage> {}

/**
 * Create a Custom PIXI Component
 *
 * @example
 *
 * type RectangleProps = { x: number, y: number, color: number };
 *
 * const Rectangle = PixiComponent<RectangleProps, PIXI.Graphics>('Rectangle', {
 *   create() {
 *     return new PIXI.Graphics();
 *   }
 *   applyProps(ins: PIXI.Graphics, oldProps: RectangleProps, newProps: RectangleProps) {
 *     ins.clear();
 *     ins.beginFill(newProps.color);
 *     ins.drawRect(newProps.x, newProps.y, 100, 100);
 *     ins.endFill();
 *   }
 * });
 */
export const PixiComponent: <Props, PixiInstance extends PIXI.DisplayObject>(
  componentName: string,
  lifecycle: _ReactPixi.ICustomComponent<Props, PixiInstance>
) => React.ComponentClass<Props>;

/**
 * Tap into the {PIXI.Application} ticker raf.
 *
 * @example
 *
 * const MyComponent = () => {
 *   const [x, setX] = useState(0);
 *   useTick(() => setX(x + 1));
 *
 *   return <Sprite x={x} />
 * }
 */
export const useTick: (tick: (delta?: number) => void, enabled?: boolean) => void;

/**
 * Get the {<Stage>} {PIXI.Application} instance.
 *
 * @example
 *
 * const MyComponent = () => {
 *   const app = useApp(); // app = PIXI.Application
 *
 *   return <Sprite x={x} />
 * }
 *
 */
export const useApp: () => PIXI.Application;

/**
 * Higher Order Component to attach the {PIXI.Application} to `app` prop.
 *
 * @example
 *
 * interface Props {
 *   app: PIXI.Application
 * }
 *
 * export default withPixiApp(
 *   ({ app }) => (
 *     //
 *   )
 * );
 */
export const withPixiApp: <P extends { app: PIXI.Application }>(
  WrappedComponent: React.ComponentType<P>
) => React.ComponentClass<Omit<P, 'app'>>;

/**
 * Apply default props. Useful in Custom Components.
 *
 * @example
 *
 * const Rectangle = PixiComponent('Rectangle', {
 *   create() {
 *     return new PIXI.Graphics();
 *   },
 *   applyProps(instance, oldProps, newProps) {
 *     applyDefaultProps(instance, oldProps, newProps);
 *   }
 * });
 */
export const applyDefaultProps: <P extends object>(
  instance: PIXI.DisplayObject,
  oldProps: P,
  newProps: P
) => void;

/**
 * Create a filter wrapper to easily facilitate filter arguments as props
 * in a declarative way.
 *
 * @example
 *
 * render() {
 *   return (
 *     <Container>
 *       <BlurAndAdjustmentFilter
 *         blurFilter={{'blur': 5}}
 *         adjustmentFilter={{'gamma': 3, 'brightness': 5}}
 *       >
 *         <Sprite texture={texture} />
 *       </BlurAndAdjustmentFilter>
 *     </Container>
 *   )
 * }
 */
export const withFilters: <
  Component extends React.ComponentType<_ReactPixi.IContainer>,
  Filters extends { [filterKey: string]: any }
>(WrapperComponent: Component, filters: Filters) => React.ComponentType<
  React.ComponentProps<Component> & Partial<{
    [P in keyof Filters]: Partial<InstanceType<Filters[P]>>
  }>
>;
