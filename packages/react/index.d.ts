import * as React from 'react';
import { Application as PixiApplication } from '@pixi/app'
import { Texture as PixiTexture } from '@pixi/core'
import { Container as PixiContainer, DisplayObject as PixiDisplayObject } from '@pixi/display'
import { Graphics as PixiGraphics } from '@pixi/graphics'
import { Point as PixiPoint, ObservablePoint as PixiObservablePoint } from '@pixi/math'
import {
    NineSlicePlane as PixiNineSlicePlane,
    SimpleRope as PixiSimpleRope,
    SimpleMesh as PixiSimpleMesh,
} from '@pixi/mesh-extras'
import { Text as PixiText } from '@pixi/text'
import { BitmapText as PixiBitmapText } from '@pixi/text-bitmap'
import { Ticker as PixiTicker } from '@pixi/ticker'
import { Sprite as PixiSprite } from '@pixi/sprite'
import { TilingSprite as PixiTilingSprite } from '@pixi/sprite-tiling'
import { AnimatedSprite as PixiAnimatedSprite } from '@pixi/sprite-animated'
import { ParticleContainer as PixiParticleContainer } from '@pixi/particle-container'

// Reconciler API
interface Reconciler<Instance, TextInstance, Container, PublicInstance>
{
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

interface ReconcilerConfig
{
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
    shouldDeprioritizeSubtree(type: any, props: any): boolean;
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

export type InteractionEventTypes =
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

export type InteractionEvents = {
    [P in InteractionEventTypes]?: (
        event: any
    ) => void;
};

export const TYPES:Record<string, string>;

// private
declare namespace _ReactPixi
{
  type FunctionTypes<T> = {
      [P in keyof T]: ((...args: any) => any) extends T[P] ? P : never;
  }[keyof T];

  type IfEquals<X, Y, A=X, B=never> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;

  type ReadonlyKeys<T> = {
      [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
  }[keyof T];

  type ApplicationOptions = ConstructorParameters<typeof PixiApplication>[0];
  type PointLike =
    | PixiPoint
    | PixiObservablePoint
    | [number, number]
    | [number]
    | number
    | { x: number, y: number };
  type ImageSource = string | HTMLImageElement;
  type VideoSource = string | HTMLVideoElement;
  type AnySource = number | ImageSource | VideoSource | HTMLCanvasElement | PixiTexture;
  type WithPointLike<T extends keyof any> = { [P in T]: PointLike };

  interface WithSource
  {
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

  type P = 'position' | 'scale' | 'pivot' | 'anchor' | 'skew';

  type Container<T extends PixiDisplayObject, U = {}> = Partial<
  Omit<T, 'children' | P | ReadonlyKeys<T> | keyof U> &
  WithPointLike<P>
  > & U & InteractionEvents & { ref?: React.Ref<T> };

  type IContainer = Container<PixiContainer>;
  type ISprite = Container<PixiSprite, WithSource>;
  type IText = Container<PixiText, WithSource>;
  type IGraphics = Container<PixiGraphics, {
      /**
     * Draw a graphic with imperative callback.
     *
     * @param {PixiGraphics} graphics - The graphics instance to draw on
     * @example
     *
     * draw={g => {
     *   g.beginFill(0xff0000);
     *   g.drawRect(0,0,100,100);
     *   g.endFill();
     * }}
     */
      draw?(graphics: PixiGraphics): void;
  }>;

  type IBitmapText = Container<
  PixiBitmapText,
  {
      /**
       * Set the style object
       *
       * @example
       *
       * style={{ font: '50px Desyrel' }}
       */
      style?: ConstructorParameters<typeof PixiBitmapText>[1];
  }
  >;

  type INineSlicePlane = Container<PixiNineSlicePlane, WithSource>;
  type IParticleContainer = Container<
  PixiParticleContainer,
  {
      maxSize?: ConstructorParameters<typeof PixiParticleContainer>[0];
      properties?: ConstructorParameters<typeof PixiParticleContainer>[1];
      batchSize?: ConstructorParameters<typeof PixiParticleContainer>[2];
      autoResize?: ConstructorParameters<typeof PixiParticleContainer>[3];
  }
  >;

  type ITilingSprite = Container<
  PixiTilingSprite,
  WithSource & {
      tileScale?: PointLike;
      tilePosition: PointLike;
  }
  >;

  type ISimpleRope = Container<PixiSimpleRope, WithSource>;
  type ISimpleMesh = Container<
  PixiSimpleMesh,
  WithSource & {
      uvs?: ConstructorParameters<typeof PixiSimpleMesh>[2];
      indices?: ConstructorParameters<typeof PixiSimpleMesh>[3];
  }
  >;

  type IAnimatedSprite = Container<
  PixiAnimatedSprite,
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
     * Enable the {@see PixiApplication} ticker? [default=true].
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
     * @see PixiApplicationOptions
     * @example
     *
     * options={{ antialias: true, roundPixels: true }}
     */
      options?: ApplicationOptions;

      /**
     * Callback when the component is successfully mounted
     *
     * @param {PixiApplication} app
     */
      onMount?(app: PixiApplication): void;

      /**
     * Callback when the component is successfully unmounted
     *
     * @param {PixiApplication} app
     */
      onUnmount?(app: PixiApplication): void;
  };

  interface ICustomComponent<
      P extends { [key: string]: any },
      PixiInstance extends PixiDisplayObject
  >
  {
      /**
     * Create the PIXI instance
     * The component is created during React reconciliation.
     *
     * @param props passed down props
     * @returns {PixiDisplayObject}
     */
      create(props: P): PixiInstance;

      /**
     * Instance mounted
     * This is called during React reconciliation.
     *
     * @param {PixiDisplayObject} instance
     * @param {PixiContainer} parent
     */
      didMount?(instance: PixiInstance, parent: PixiContainer): void;

      /**
     * Instance will unmount
     * This is called during React reconciliation.
     *
     * @param {PixiDisplayObject} instance
     * @param {PixiContainer} parent
     */
      willUnmount?(instance: PixiInstance, parent: PixiContainer): void;

      /**
     * Apply props for this custom component.
     * This is called during React reconciliation.
     *
     * @param {PixiDisplayObject} instance
     * @param oldProps
     * @param newProps
     */
      applyProps?(
          instance: PixiInstance,
          oldProps: Readonly<P | object>,
          newProps: Readonly<P>
      ): void;

      /**
     * Reconcile config
     */
      config?: {
      /**
       * Destroy instance on unmount?
       * @default true
       */
          destroy?: boolean;

          /**
       * Destroy child instances?
       * @default true
       */
          destroyChildren?: boolean
      };
  }
}

// components
export const Text: React.FC<_ReactPixi.IText>;
export const Sprite: React.FC<React.PropsWithChildren<_ReactPixi.ISprite>>;
export const Container: React.FC<React.PropsWithChildren<_ReactPixi.IContainer>>;
export const Graphics: React.FC<_ReactPixi.IGraphics>;
export const BitmapText: React.FC<_ReactPixi.IBitmapText>;
export const NineSlicePlane: React.FC<_ReactPixi.INineSlicePlane>;
export const ParticleContainer: React.FC<React.PropsWithChildren<_ReactPixi.IParticleContainer>>;
export const TilingSprite: React.FC<_ReactPixi.ITilingSprite>;
export const SimpleRope: React.FC<_ReactPixi.ISimpleRope>;
export const SimpleMesh: React.FC<_ReactPixi.ISimpleMesh>;
export const AnimatedSprite: React.FC<_ReactPixi.IAnimatedSprite>;

export interface ReactPixiRoot {
    render(element: React.ReactElement | React.ReactElement[] | React.Factory<any>): any
    unmount(): void
}

export const createRoot: (container: PixiContainer) => ReactPixiRoot

// renderer
export const render: (
    element: React.ReactElement | React.ReactElement[] | React.Factory<any>,
    container: PixiContainer,
    callback?: (...args: any) => void
) => any;

// unmount component
export const unmountComponentAtNode: (container: PixiContainer) => void;

// context
export const AppContext: React.Context<PixiApplication>;
export const AppProvider: React.ComponentType<React.ProviderProps<PixiApplication>>;
export const AppConsumer: React.ComponentType<React.ConsumerProps<PixiApplication>>;

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
 * const Rectangle = PixiComponent<RectangleProps, PixiGraphics>('Rectangle', {
 *   create() {
 *     return new PixiGraphics();
 *   }
 *   applyProps(ins: PixiGraphics, oldProps: RectangleProps, newProps: RectangleProps) {
 *     ins.clear();
 *     ins.beginFill(newProps.color);
 *     ins.drawRect(newProps.x, newProps.y, 100, 100);
 *     ins.endFill();
 *   }
 * });
 */
export const PixiComponent: <Props extends { [key: string]: any; }, PixiInstance extends PixiDisplayObject>(
    componentName: string,
    lifecycle: _ReactPixi.ICustomComponent<Props, PixiInstance>
) => React.FC<Props & { ref?: React.Ref<PixiInstance> }>;

/**
 * Tap into the {PixiApplication} ticker raf.
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
export const useTick: (
    tick: (this: PixiTicker, delta: number, ticker: PixiTicker) => void,
    enabled?: boolean
) => void;

/**
 * Get the {<Stage>} {PixiApplication} instance.
 *
 * @example
 *
 * const MyComponent = () => {
 *   const app = useApp(); // app = PixiApplication
 *
 *   return <Sprite x={x} />
 * }
 *
 */
export const useApp: () => PixiApplication;

/**
 * Higher Order Component to attach the {PixiApplication} to `app` prop.
 *
 * @example
 *
 * interface Props {
 *   app: PixiApplication
 * }
 *
 * export default withPixiApp(
 *   ({ app }) => (
 *     //
 *   )
 * );
 */
export const withPixiApp: <P extends { app: PixiApplication }>(
    WrappedComponent: React.ComponentType<P>
) => React.ComponentClass<Omit<P, 'app'>>;

/**
 * Apply default props. Useful in Custom Components.
 *
 * @example
 *
 * const Rectangle = PixiComponent('Rectangle', {
 *   create() {
 *     return new PixiGraphics();
 *   },
 *   applyProps(instance, oldProps, newProps) {
 *     applyDefaultProps(instance, oldProps, newProps);
 *   }
 * });
 */
export const applyDefaultProps: <P extends object>(
    instance: PixiDisplayObject,
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
    _ReactPixi.Container<PixiDisplayObject, any>
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
>;

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
