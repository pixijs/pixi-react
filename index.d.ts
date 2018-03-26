import * as React from 'react';
import * as PIXI from 'pixi.js';

declare var ReactPixi: ReactPixi.ReactPixiStatic;

export = ReactPixi;
export as namespace ReactPixi;

declare namespace ReactPixi {

  type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];

  type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

  interface ObjectWithChildren { children?: any; }

  type Childless<T extends ObjectWithChildren> = Omit<T, 'children'>;

  interface ChildrenProperties {
    children?: React.ReactNode;
  }

  /**
   * -------------------------------------------
   * Component types
   * -------------------------------------------
   */

  type ChildlessComponent<T extends ObjectWithChildren> = Partial<Childless<T>>;

  type Component<T extends ObjectWithChildren> = ChildlessComponent<T> & ChildrenProperties;

  /**
   * -------------------------------------------
   * PIXI Components
   * -------------------------------------------
   */

  interface BitmapTextProperties extends ChildlessComponent<PIXI.extras.BitmapText> { text: string; }

  class BitmapText extends React.Component<BitmapTextProperties> {}

  interface ContainerProperties extends Component<PIXI.Container> {}

  class Container extends React.Component<ContainerProperties> {}

  interface GraphicsProperties extends ChildlessComponent<PIXI.Graphics> {
    draw(graphics: PIXI.Graphics): void;
  }

  class Graphics extends React.Component<GraphicsProperties> {}

  interface ParticleContainerProperties extends Component<PIXI.particles.ParticleContainer> {}

  class ParticleContainer extends React.Component<ParticleContainerProperties> {}

  interface SpriteProperties extends ChildlessComponent<PIXI.Sprite> {
    texture?: PIXI.Texture;
    image?: string;
  }

  class Sprite extends React.Component<SpriteProperties> {}

  interface TextProperties extends ChildlessComponent<PIXI.Text> {}

  class Text extends React.Component<TextProperties> {}

  interface TilingSpriteProperties extends ChildlessComponent<PIXI.extras.TilingSprite> {
    texture?: PIXI.Texture;
    image?: string;
  }

  class TilingSprite extends React.Component<TilingSpriteProperties> {}

  interface MeshProperties extends ChildlessComponent<PIXI.mesh.Mesh> {}

  class Mesh extends React.Component<MeshProperties> {}

  interface RopeProperties extends ChildlessComponent<PIXI.mesh.Rope> {
    texture?: PIXI.Texture;
    image?: string;
  }

  class Rope extends React.Component<RopeProperties> {}

  interface NineSlicePlaneProperties extends ChildlessComponent<PIXI.mesh.NineSlicePlane> {
    texture?: PIXI.Texture;
    image?: string;
  }

  class NineSlicePlane extends React.Component<NineSlicePlaneProperties> {}

  /**
   * -------------------------------------------
   * Stage
   * -------------------------------------------
   */

  interface StageProps {
    children: React.ReactNode;

    width?: number;
    height?: number;

    onMount?(callback: () => PIXI.Application): void;

    raf?: boolean;
    renderOnComponentChange?: boolean;

    options?: {
      antialias?: boolean;
      autoStart?: boolean;
      width?: number;
      height?: number;
      transparent?: boolean;
      preserveDrawingBuffer?: boolean;
      resolution?: number;
      forceCanvas?: boolean;
      backgroundColor?: number;
      clearBeforeRender?: boolean;
      roundPixels?: boolean;
      forceFXAA?: boolean;
      legacy?: boolean;
      powerPreference?: string;
      sharedTicker?: boolean;
      sharedLoader?: boolean;
      view?: HTMLCanvasElement;
    }
  }

  class Stage extends React.Component<StageProps> {
  }

  interface ProviderProps {
    children(app: PIXI.Application): React.ReactNode;
  }

  /**
   * -------------------------------------------
   * Providers
   * -------------------------------------------
   */

  class Provider extends React.Component<ProviderProps> {}

  /**
   * -------------------------------------------
   * Custom Component
   * -------------------------------------------
   */

  interface LifeCycleMethods {
    create(props: object): PIXI.DisplayObject;
    didMount(instance: PIXI.DisplayObject, parent: PIXI.Container): void;
    willUnmount(instance: PIXI.DisplayObject, parent: PIXI.Container): void;
    applyProps(instance: PIXI.DisplayObject, oldProps: object, newProps: object): void;
  }

  /**
   * -------------------------------------------
   * Public API
   * -------------------------------------------
   */

  interface ReactPixiStatic {
    Stage: Stage;

    render(pixiElement: PIXI.DisplayObject | PIXI.DisplayObject[], pixiContainer: PIXI.Container, callback?: Function): void;

    withPixiApp(baseComponent: React.Component): React.Component;

    PixiComponent<T extends string>(type: T, lifecycle: LifeCycleMethods): T;

    Provider: Provider;

    BitmapText: BitmapText;

    Text: Text;

    Sprite: Sprite;

    NineSlicePlane: NineSlicePlane;

    Graphics: Graphics;

    Container: Container;

    Rope: Rope;

    Mesh: Mesh;

    TilingSprite: TilingSprite;

    ParticleContainer: ParticleContainer;
  }

}
