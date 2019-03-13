import * as PIXI from "pixi.js";
import * as React from "react";

// private
declare namespace _ReactPixi {
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

  type InteractionEvents = {
    [P in PIXI.interaction.InteractionEventTypes]?: (
      event: PIXI.interaction.InteractionEvent
    ) => void
  };

  type PointLike =
    | PIXI.Point | PIXI.ObservablePoint
    | [number, number] | [number]
    | number;

  type Container<T> = Partial<
    Omit<T, "children" | "position" | "scale" | "pivot">
  > &
    InteractionEvents & {
      /**
       * The coordinate of the object relative to the local coordinates of the parent.
       * Assignment by value since pixi-v4.
       *
       * @example
       *
       * position={100}
       * position={[100, 100]}
       * position={{x: 100, y: 100}}
       * position={new PIXI.Point(100, 100)}
       * position={new PIXI.ObservablePoint(100, 100)}
       */
      position?: PointLike;

      /**
       * The scale factor of the object.
       * Assignment by value since pixi-v4.
       *
       * @example
       *
       * scale={0.5}
       * scale={[0.5, 0.5]}
       * scale={{x: 0.5, y: 0.5}}
       * scale={new PIXI.Point(0.5, 0.5)}
       * scale={new PIXI.ObservablePoint(0.5, 0.5)}
       */
      scale?: PointLike;

      /**
       * The pivot point of the displayObject that it rotates around.
       * Assignment by value since pixi-v4.
       *
       * @example
       *
       * pivot={100}
       * pivot={[100, 100]}
       * pivot={{x: 100, y: 100}}
       * pivot={new PIXI.Point(100, 100)}
       * pivot={new PIXI.ObservablePoint(100, 100)}
       */
      pivot?: PointLike;
    };

  interface ISprite
    extends Container<Omit<PIXI.Sprite, "anchor" | "roundPixels">> {
    /**
     * The anchor sets the origin point.
     * The default is `(0,0)`, this means the sprite's origin is the top left.
     * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
     *
     * @example
     *
     * anchor={0.5}
     * anchor={[0.5, 0.5]}
     * anchor={new PIXI.ObservablePoint(0.5, 0.5)}
     */
    anchor?: PointLike;

    /**
     * Directly apply an image to a Sprite.
     * The image will be automatically texturized and chached.
     *
     * @example
     *
     * image="./image.png"
     */
    image?: string;

    /**
     * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
     * Advantages can include sharper image quality (like text) and faster rendering on canvas.
     * The main disadvantage is movement of objects may appear less smooth.
     */
    roundPixels?: boolean;
  }

  interface IText extends Container<Omit<PIXI.Text, "anchor">> {
    /**
     * The anchor sets the origin point of the text.
     * The default is `(0,0)`, this means the text's origin is the top left.
     * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
     *
     * @example
     *
     * anchor={0.5}
     * anchor={[0.5, 0.5]}
     * anchor={new PIXI.ObservablePoint(0.5, 0.5)}
     */
    anchor?: PointLike;
  }

  interface IGraphics extends Container<PIXI.Graphics> {
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
  }

  interface IBitmapText
    extends Container<Omit<PIXI.extras.BitmapText, "anchor">> {
    /**
     * The anchor sets the origin point of the text.
     * The default is `(0,0)`, this means the text's origin is the top left.
     * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
     *
     * @example
     *
     * anchor={0.5}
     * anchor={[0.5, 0.5]}
     * anchor={new PIXI.ObservablePoint(0.5, 0.5)}
     */
    anchor?: PointLike;

    /**
     * Set the style object
     *
     * @example
     *
     * style={{ font: '50px Desyrel' }}
     */
    style?: PIXI.extras.BitmapTextStyle;
  }

  interface INineSlicePlane extends Container<PIXI.mesh.NineSlicePlane> {
    /**
     * Image to use for the nine-slice-plane.
     * The image will be automatically texturized and chached.
     *
     * @example
     *
     * image="./image.png"
     */
    image?: string;
  }

  interface IParticleContainer
    extends Container<PIXI.particles.ParticleContainer> {
    /**
     * Max particles size
     */
    maxSize?: number;

    /**
     * Batch size
     */
    batchSize?: number;

    /**
     * Enable auto resize?
     */
    autoResize?: boolean;

    /**
     * Particle container properties to apply.
     *
     * @example
     *
     * properties={{ vertices: true, position: true, rotation: false }}
     */
    properties?: PIXI.particles.ParticleContainerProperties;
  }

  interface ITilingSprite
    extends Container<
      Omit<PIXI.extras.TilingSprite, "tileScale" | "tilePosition">
    > {
    /**
     * The scale factor of the tile.
     * Assignment by value since pixi-v4.
     *
     * @example
     *
     * scale={0.5}
     * scale={[0.5, 0.5]}
     * scale={{x: 0.5, y: 0.5}}
     * scale={new PIXI.Point(0.5, 0.5)}
     * scale={new PIXI.ObservablePoint(0.5, 0.5)}
     */
    tileScale?: PointLike;

    /**
     * The coordinate offset of the tile
     * Assignment by value since pixi-v4.
     *
     * @example
     *
     * tilePosition={100}
     * tilePosition={[100, 100]}
     * tilePosition={{x: 100, y: 100}}
     * tilePosition={new PIXI.Point(100, 100)}
     * tilePosition={new PIXI.ObservablePoint(100, 100)}
     */
    tilePosition: PointLike;

    /**
     * Tile image.
     * The image will be automatically texturized and chached.
     *
     * @example
     *
     * image="./image.png"
     */
    image?: string;
  }

  interface IRope extends Container<PIXI.mesh.Rope> {
    /**
     * Directly apply an image to the Rope.
     * The image will be automatically texturized and chached.
     *
     * @example
     *
     * image="./image.png"
     */
    image?: string;
  }

  interface IMesh extends Container<PIXI.mesh.Mesh> {
    /**
     * Directly apply an image to a Mesh.
     * The image will be automatically texturized and chached.
     *
     * @example
     *
     * image="./image.png"
     */
    image?: string;
  }

  interface IDevtoolsConfig {
    bundleType: 0 | 1;
    version: string;
    rendererPackageName: string;

    findFiberByHostInstance(instance: any): object;
    getInspectorDataForViewTag(tag: number): object;
  }

  interface IReactFiber {
    createContainer(
      containerInfo: PIXI.Container,
      isAsync: boolean,
      hydrate: boolean
    ): object;
    updateContainer(
      element: React.ReactNode,
      container: object,
      parentComponent: React.Component<any, any>,
      callback?: () => void
    ): number;
    getPublicRootInstance(container: object): React.Component<any, any> | null;
    findHostInstance(component: object): any;
    injectIntoDevTools(devToolsConfig: IDevtoolsConfig): boolean;
  }

  interface IStageProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
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
    options?: PIXI.ApplicationOptions;

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
  }

  interface ICustomComponent<
    P extends { [key: string]: any },
    PixiInstance extends PIXI.DisplayObject
  > {
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
    applyProps?(
      instance: PixiInstance,
      oldProps: Readonly<P>,
      newProps: Readonly<P>
    ): void;
  }
}

// public
declare namespace ReactPixi {
  // components
  class Sprite extends React.Component<_ReactPixi.ISprite> {}
  class Text extends React.Component<_ReactPixi.IText> {}
  class Container extends React.Component<
    _ReactPixi.Container<PIXI.Container>
  > {}
  class Graphics extends React.Component<_ReactPixi.IGraphics> {}
  class BitmapText extends React.Component<_ReactPixi.IBitmapText> {}
  class NineSlicePlane extends React.Component<_ReactPixi.INineSlicePlane> {}
  class ParticleContainer extends React.Component<
    _ReactPixi.IParticleContainer
  > {}
  class TilingSprite extends React.Component<_ReactPixi.ITilingSprite> {}
  class Rope extends React.Component<_ReactPixi.IRope> {}
  class Mesh extends React.Component<_ReactPixi.IMesh> {}

  // renderer
  const render: (
    element:
      | React.ReactElement<any>
      | Array<React.ReactElement<any>>
      | React.Factory<any>,
    container: PIXI.Container,
    callback?: () => void
  ) => any;

  // context
  const AppContext: React.Context<PIXI.Application>;
  const AppProvider: React.ComponentType<React.ProviderProps<PIXI.Application>>;
  const AppConsumer: React.ComponentType<React.ConsumerProps<PIXI.Application>>;

  // fiber
  const PixiFiber: _ReactPixi.IReactFiber;

  // stage
  class Stage extends React.Component<_ReactPixi.IStageProps> {}

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
  const PixiComponent: <P, PixiInstance extends PIXI.DisplayObject>(
    componentName: string,
    lifecycle: _ReactPixi.ICustomComponent<P, PixiInstance>
  ) => React.ComponentClass<P>;

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
  const useTick: (tick: (delta?: number) => void) => void;

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
  const useApp: () => PIXI.Application;

  /**
   * Higher Order Component to attach the {PIXI.Application} to `app` prop.
   *
   * @example
   *
   * const MyComp: FC<{ app: PIXI.Application }> = ({ app }) => <Sprite />;
   * export default withPixiApp(MyComp);
   */
  const withPixiApp: <P extends { app: PIXI.Application }>(
    WrappedComponent: React.ComponentType<P>
  ) => React.ComponentClass<_ReactPixi.Omit<P, "app">>;
}

export = ReactPixi;
export as namespace ReactPixi;
