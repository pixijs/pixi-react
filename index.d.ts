import * as React from 'react';
import * as PIXI from 'pixi.js';

declare module '@inlet/react-pixi' {

  export type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];

  export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

  interface ObjectWithChildren { children?: any; }

  export type Childless<T extends ObjectWithChildren> = Omit<T, 'children'>;

  export interface ChildrenProperties {
    children?: React.ReactNode;
  }

  /**
   * -------------------------------------------
   * Component types
   * -------------------------------------------
   */

  export type ChildlessComponent<T extends ObjectWithChildren> = Partial<Childless<T>>;

  export type Component<T extends ObjectWithChildren> = ChildlessComponent<T> & ChildrenProperties;

  /**
   * -------------------------------------------
   * PIXI Components
   * -------------------------------------------
   */

  export interface BitmapTextProperties extends ChildlessComponent<PIXI.extras.BitmapText> { text: string; }

  export class BitmapText extends React.Component<BitmapTextProperties> {}

  export interface ContainerProperties extends Component<PIXI.Container> {}

  export class Container extends React.Component<ContainerProperties> {}

  export interface GraphicsProperties extends ChildlessComponent<PIXI.Graphics> {
    draw(graphics: PIXI.Graphics): void;
  }

  export class Graphics extends React.Component<GraphicsProperties> {}

  export interface ParticleContainerProperties extends Component<PIXI.particles.ParticleContainer> {}

  export class ParticleContainer extends React.Component<ParticleContainerProperties> {}

  export interface SpriteProperties extends ChildlessComponent<PIXI.Sprite> {
    texture?: PIXI.Texture;
    image?: string;
  }

  export class Sprite extends React.Component<SpriteProperties> {}

  export interface TextProperties extends ChildlessComponent<PIXI.Text> {}

  export class Text extends React.Component<TextProperties> {}

  export interface TilingSpriteProperties extends ChildlessComponent<PIXI.extras.TilingSprite> {
    texture?: PIXI.Texture;
    image?: string;
  }

  export class TilingSprite extends React.Component<TilingSpriteProperties> {}

  export interface MeshProperties extends ChildlessComponent<PIXI.mesh.Mesh> {}

  export class Mesh extends React.Component<MeshProperties> {}

  export interface RopeProperties extends ChildlessComponent<PIXI.mesh.Rope> {
    texture?: PIXI.Texture;
    image?: string;
  }

  export class Rope extends React.Component<RopeProperties> {}

  export interface NineSlicePlaneProperties extends ChildlessComponent<PIXI.mesh.NineSlicePlane> {
    texture?: PIXI.Texture;
    image?: string;
  }

  export class NineSlicePlane extends React.Component<NineSlicePlaneProperties> {}

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

  export class Stage extends React.Component<StageProps> {
  }

  interface ProviderProps {
    children(app: PIXI.Application): React.ReactNode;
  }

  /**
   * -------------------------------------------
   * Providers
   * -------------------------------------------
   */

  export class Provider extends React.Component<ProviderProps> {
  }

  export function withPixiApp(baseComponent: React.Component): React.Component;

  /**
   * -------------------------------------------
   * Renderer
   * -------------------------------------------
   */

  export function render(pixiElement: PIXI.DisplayObject | PIXI.DisplayObject[],
                         pixiContainer: PIXI.Container,
                         callback?: Function): void;

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

  export function PixiComponent<T extends string>(type: T, lifecycle: LifeCycleMethods): T

}
