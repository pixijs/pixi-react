import * as PIXI from 'pixi.js';
import * as React from 'react';

// Reconciler API
interface Reconciler<Instance, TextInstance, Container, PublicInstance> {
  updateContainerAtExpirationTime(
    element: any,
    container: any,
    parentComponent: React.Component<any, any> | null | undefined,
    expirationTime: any,
    callback: () => void | null | undefined
  ): any;
  createContainer(containerInfo: any, isConcurrent: boolean, hydrate: boolean): any;
  updateContainer(
    element: any,
    container: any,
    parentComponent: React.Component<any, any> | null | undefined,
    callback: () => void | null | undefined
  ): any;
  flushRoot(root: any, expirationTime: any): void;
  requestWork(root: any, expirationTime: any): void;
  computeUniqueAsyncExpiration(): any;
  batchedUpdates<A>(fn: () => A): A;
  unbatchedUpdates<A>(fn: () => A): A;
  deferredUpdates<A>(fn: () => A): A;
  syncUpdates<A>(fn: () => A): A;
  interactiveUpdates<A>(fn: () => A): A;
  flushInteractiveUpdates(): void;
  flushControlled(fn: () => any): void;
  flushSync<A>(fn: () => A): A;
  getPublicRootInstance(container: any): React.Component<any, any> | PublicInstance | null;
  findHostInstance(component: object): PublicInstance | null;
  findHostInstanceWithNoPortals(component: any): PublicInstance | null;
  injectIntoDevTools(devToolsConfig: any): boolean;
}

interface ReconcilerConfig {
  getRootHostContext(rootContainerInstance: any): any;
  getChildHostContext(): any;
  getChildHostContextForEventComponent(parentHostContext: any): any;
  getPublicInstance(getPublicInstance: any): any;
  prepareForCommit(): void;
  resetAfterCommit(): void;
  createInstance(...args: any[]): any;
  hideInstance(ins: any): void;
  unhideInstance(ins: any, props: any): void;
  appendInitialChild(...args: any[]): any;
  finalizeInitialChildren(doFinalize: boolean): boolean;
  prepareUpdate(...args: any): any;
  shouldSetTextContent(type: any, props: any): boolean;
  shouldDeprioritizeSubtree(type: any, props: any):boolean;
  createTextInstance(): void;
  mountEventComponent(): void;
  updateEventComponent(): void;
  handleEventTarget(): void;
  scheduleTimeout(...args: any[]): any;
  cancelTimeout(...args: any[]): any;
  appendChild(...args: any[]): any;
  appendChildToContainer(...args: any[]): any;
  removeChild(...args: any[]): any;
  removeChildFromContainer(...args: any[]): any;
  insertBefore(...args: any[]): any;
  insertInContainerBefore(...args: any[]): any;
  commitUpdate(...args: any[]): any;
  commitMount(...args: any[]): any;
  commitTextUpdate(...args: any[]): any;
  resetTextContent(...args: any[]): any;
}

// private
declare namespace _ReactPixi {
  type FunctionTypes<T> = {
    [P in keyof T]: ((...args: any) => any) extends T[P] ? P : never;
  }[keyof T];

  type IfEquals<X, Y, A=X, B=never> =
    (<T>() => T extends X ? 1 : 2) extends
      (<T>() => T extends Y ? 1 : 2) ? A : B;

  type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
  }[keyof T];

  type ApplicationOptions = ConstructorParameters<typeof PIXI.Application>[0];
  type PointLike =
    | PIXI.Point
    | PIXI.ObservablePoint
    | [number, number]
    | [number]
    | number
    | { x: number, y: number };
  type ImageSource = string | HTMLImageElement;
  type VideoSource = string | HTMLVideoElement;
  type AnySource = number | ImageSource | VideoSource | HTMLCanvasElement | PIXI.Texture;
  type WithPointLike<T extends keyof any> = { [P in T]: PointLike };

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
    source?: AnySource;
  }

  type InteractionEventTypes =
    | 'click'
    | 'mousedown'
    | 'mousemove'
    | 'mouseout'
    | 'mouseover'
    | 'mouseup'
    | 'mouseupoutside'
    | 'tap'
    | 'touchstart'
    | 'touchmove'
    | 'touchend'
    | 'touchendoutside'
    | 'pointercancel'
    | 'pointerout'
    | 'pointerover'
    | 'pointertap'
    | 'pointerdown'
    | 'pointerup'
    | 'pointerupoutside'
    | 'pointermove'
    | 'rightclick'
    | 'rightdown'
    | 'rightup'
    | 'rightupoutside'
    | 'touchcancel'
    | 'touchendoutside'
    | 'touchmove'
    | 'touchstart';

  type InteractionEvents = {
    [P in InteractionEventTypes]?: (
      event: PIXI.InteractionEvent
    ) => void;
  };

  type P = 'position' | 'scale' | 'pivot' | 'anchor' | 'skew';

  type Container<T extends PIXI.DisplayObject, U = {}> = Partial<
    Omit<T, 'children' | P | ReadonlyKeys<T> | keyof U> &
    WithPointLike<P>
    > & U & InteractionEvents & { ref?: React.Ref<T> };

  type IContainer = Container<PIXI.Container>;
  type ISprite = Container<PIXI.Sprite, WithSource>;
  type IText = Container<PIXI.Text, WithSource>;
  type IGraphics = Container<PIXI.Graphics, {
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
  }>;

  type IBitmapText = Container<
    PIXI.BitmapText,
    {
      /**
       * Set the style object
       *
       * @example
       *
       * style={{ font: '50px Desyrel' }}
       */
      style?: ConstructorParameters<typeof PIXI.BitmapText>[1];
    }
    >;

  type INineSlicePlane = Container<PIXI.NineSlicePlane, WithSource>;
  type IParticleContainer = Container<
    PIXI.ParticleContainer,
    {
      maxSize?: ConstructorParameters<typeof PIXI.ParticleContainer>[0];
      properties?: ConstructorParameters<typeof PIXI.ParticleContainer>[1];
      batchSize?: ConstructorParameters<typeof PIXI.ParticleContainer>[2];
      autoResize?: ConstructorParameters<typeof PIXI.ParticleContainer>[3];
    }
    >;

  type ITilingSprite = Container<
    PIXI.TilingSprite,
    WithSource & {
    tileScale?: PointLike;
    tilePosition: PointLike;
  }
    >;

  type ISimpleRope = Container<PIXI.SimpleRope, WithSource>;
  type ISimpleMesh = Container<
    PIXI.SimpleMesh,
    WithSource & {
    uvs?: ConstructorParameters<typeof PIXI.SimpleMesh>[2];
    indices?: ConstructorParameters<typeof PIXI.SimpleMesh>[3];
  }
    >;

  type IAnimatedSprite = Container<
    PIXI.AnimatedSprite,
    WithSource & {
    isPlaying: boolean;
    images?: string[];
    initialFrame?: number;
  }
    >;

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
     * Render the PIXI stage on React component changes.
     * You'll need to set raf={false}.
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

  interface ICustomComponent<
    P extends { [key: string]: any },
    PixiInstance extends PIXI.DisplayObject
    > {
    /**
     * Create the PIXI instance
     * The component is created during React reconciliation.
     *
     * @param props passed down props
     * @returns {PIXI.DisplayObject}
     */
    create(props: P): PixiInstance;

    /**
     * Instance mounted
     * This is called during React reconciliation.
     *
     * @param {PIXI.DisplayObject} instance
     * @param {PIXI.Container} parent
     */
    didMount?(instance: PixiInstance, parent: PIXI.Container): void;

    /**
     * Instance will unmount
     * This is called during React reconciliation.
     *
     * @param {PIXI.DisplayObject} instance
     * @param {PIXI.Container} parent
     */
    willUnmount?(instance: PixiInstance, parent: PIXI.Container): void;

    /**
     * Apply props for this custom component.
     * This is called during React reconciliation.
     *
     * @param {PIXI.DisplayObject} instance
     * @param oldProps
     * @param newProps
     */
    applyProps?(
      instance: PixiInstance,
      oldProps: Readonly<P>,
      newProps: Readonly<P>
    ): void;
  }
}

// components
export const Text: React.FC<_ReactPixi.IText>;
export const Sprite: React.FC<_ReactPixi.ISprite>;
export const Container: React.FC<_ReactPixi.IContainer>;
export const Graphics: React.FC<_ReactPixi.IGraphics>;
export const BitmapText: React.FC<_ReactPixi.IBitmapText>;
export const NineSlicePlane: React.FC<_ReactPixi.INineSlicePlane>;
export const ParticleContainer: React.FC<_ReactPixi.IParticleContainer>;
export const TilingSprite: React.FC<_ReactPixi.ITilingSprite>;
export const SimpleRope: React.FC<_ReactPixi.ISimpleRope>;
export const SimpleMesh: React.FC<_ReactPixi.ISimpleMesh>;
export const AnimatedSprite: React.FC<_ReactPixi.IAnimatedSprite>;

// renderer
export const render: (
  element: React.ReactElement | React.ReactElement[] | React.Factory<any>,
  container: PIXI.Container,
  callback?: (...args: any) => void
) => any;

// unmount component
export const unmountComponentAtNode: (container: PIXI.Container) => void;

// context
export const AppContext: React.Context<PIXI.Application>;
export const AppProvider: React.ComponentType<React.ProviderProps<PIXI.Application>>;
export const AppConsumer: React.ComponentType<React.ConsumerProps<PIXI.Application>>;

// fiber
export const PixiFiber: (
  eventsMap?: { [P in keyof ReconcilerConfig]: (...args: any) => void }
) => Reconciler<any, any, any, any>;

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
) => React.FC<Props & { ref?: React.Ref<PixiInstance> }>;

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
  Component extends React.ComponentType<
    _ReactPixi.Container<PIXI.DisplayObject, any>
  >,
  Filters extends { [filterKey: string]: any }
>(
  WrapperComponent: Component,
  filters: Filters
) => React.ComponentType<
  React.ComponentProps<Component> &
    Partial<
      {
        [P in keyof Filters]: Partial<InstanceType<Filters[P]> & { construct: ConstructorParameters<Filters[P]> }>
      }
    >
>

/**
 * Get the component instance ref
 *
 * @example
 *
 * const App = () => {
 *   const containerRef = React.useRef<PixiRef<typeof Container>>(null);
 *
 *   return <Container ref={containerRef} />
 * };
 */
export type PixiRef<T extends React.ComponentType<any>> = Extract<
  React.ComponentProps<T>['ref'],
  React.RefObject<any>
  > extends React.Ref<infer R>
  ? R
  : never;
