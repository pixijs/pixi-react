import * as PIXI from 'pixi.js';
import * as React from 'react';

// private
declare namespace _ReactPixi {
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

  type InteractionEvents = {
    [P in PIXI.interaction.InteractionEventTypes]?: (event: PIXI.interaction.InteractionEvent) => void
  };

  type PointLike = PIXI.Point | PIXI.ObservablePoint | number[] | number;

  type Container<T> = Partial<Omit<T, 'children' | 'position' | 'scale' | 'pivot'>> &
    InteractionEvents & {
      position?: PointLike;
      scale?: PointLike;
      pivot?: PointLike;
    };

  interface ISprite extends Container<Omit<PIXI.Sprite, 'anchor' | 'roundPixels'>> {
    anchor?: PointLike;
    image?: string;
    roundPixels?: boolean;
  }

  interface IGraphics extends Container<PIXI.Graphics> {
    draw?(graphics: PIXI.Graphics): void;
  }

  interface IBitmapText extends Container<Omit<PIXI.extras.BitmapText, 'anchor'>> {
    anchor: PointLike;
    style?: PIXI.extras.BitmapTextStyle;
  }

  interface INineSlicePlane extends Container<PIXI.mesh.NineSlicePlane> {
    image?: string;
  }

  interface IParticleContainer extends Container<PIXI.particles.ParticleContainer> {
    maxSize?: number;
    batchSize?: number;
    autoResize?: boolean;
    properties?: PIXI.particles.ParticleContainerProperties;
  }

  interface ITilingSprite extends Container<Omit<PIXI.extras.TilingSprite, 'tileScale' | 'tilePosition'>> {
    tileScale?: PointLike;
    tilePosition: PointLike;
    image?: string;
  }

  interface IRope extends Container<PIXI.mesh.Rope> {
    image?: string;
  }

  interface IMesh extends Container<PIXI.mesh.Mesh> {
    image?: string;
  }

  interface IProvider {
    children(app: PIXI.Application): React.ReactNode | React.ReactNodeArray;
  }

  interface IDevtoolsConfig {
    bundleType: 0 | 1;
    version: string;
    rendererPackageName: string;

    findFiberByHostInstance(instance: any): object;
    getInspectorDataForViewTag(tag: number): object;
  }

  interface IReactFiber {
    createContainer(containerInfo: PIXI.Container, isAsync: boolean, hydrate: boolean): object;
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
    width?: number;
    height?: number;
    raf?: boolean;
    renderOnComponentChange?: boolean;
    options?: PIXI.ApplicationOptions;

    onMount?(app: PIXI.Application): void;
    onUnmount?(app: PIXI.Application): void;
  }

  interface ICustomComponent<P, PixiInstance extends PIXI.DisplayObject> {
    create(props: P): PixiInstance;
    didMount?(instance: PixiInstance, parent: PIXI.Container): void;
    willUnmount?(instance: PixiInstance, parent: PIXI.Container): void;
    applyProps?(instance: PixiInstance, oldProps: Readonly<P>, newProps: Readonly<P>): void;
  }
}

// public
declare namespace ReactPixi {
  // components
  class Sprite extends React.Component<_ReactPixi.ISprite> {}
  class Text extends React.Component<_ReactPixi.Container<PIXI.Text>> {}
  class Container extends React.Component<_ReactPixi.Container<PIXI.Container>> {}
  class Graphics extends React.Component<_ReactPixi.IGraphics> {}
  class BitmapText extends React.Component<_ReactPixi.IBitmapText> {}
  class NineSlicePlane extends React.Component<_ReactPixi.INineSlicePlane> {}
  class ParticleContainer extends React.Component<_ReactPixi.IParticleContainer> {}
  class TilingSprite extends React.Component<_ReactPixi.ITilingSprite> {}
  class Rope extends React.Component<_ReactPixi.IRope> {}
  class Mesh extends React.Component<_ReactPixi.IMesh> {}

  // renderer
  const render: (
    element: React.ReactElement<any> | React.ReactElement<any>[] | React.Factory<any>,
    container: PIXI.Container,
    callback?: () => void
  ) => any;

  // context
  const AppContext: React.Context<PIXI.Application>;
  const AppProvider: React.ComponentType<React.ProviderProps<PIXI.Application>>;
  const AppConsumer: React.ComponentType<React.ConsumerProps<PIXI.Application>>;

  // context HOC
  const withPixiApp: <P extends { app: PIXI.Application }>(
    WrappedComponent: React.ComponentType<P>
  ) => React.ComponentClass<_ReactPixi.Omit<P, 'app'>>;

  // fiber
  const PixiFiber: _ReactPixi.IReactFiber;

  // stage
  class Stage extends React.Component<_ReactPixi.IStageProps> {}

  // custom component
  const PixiComponent: <P, PixiInstance extends PIXI.DisplayObject>(
    componentName: string,
    lifecycle: _ReactPixi.ICustomComponent<P, PixiInstance>
  ) => React.ComponentClass<P>;

  // hooks
  const useTick: (tick: (delta?: number) => void) => void;
  const useApp: () => PIXI.Application;
}

export = ReactPixi;
export as namespace ReactPixi;
