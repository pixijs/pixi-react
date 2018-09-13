import * as PIXI from 'pixi.js';
import * as React from 'react';

// private
declare namespace _ReactPixi {
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

  type InteractionEvents = {
    [P in PIXI.interaction.InteractionEventTypes]?: () => void;
  }

  type Container<T> = Partial<Omit<T, 'children'>> & InteractionEvents

  interface ISprite extends Container<PIXI.Sprite> {
    image?: string;
  }

  interface IGraphics extends Container<PIXI.Graphics> {
    draw?(graphics: PIXI.Graphics): void;
  }

  interface IBitmapText extends Container<PIXI.extras.BitmapText> {
    style?: PIXI.extras.BitmapTextStyle;
  }

  interface INineSlicePlane extends Container<PIXI.mesh.NineSlicePlane> {
    image?: string;
  }

  interface IParticleContainer extends Container<PIXI.particles.ParticleContainer> {
    maxSize?: number;
    batchSize?: number;
    autoResize?: boolean;
    properties?: PIXI.particles.ParticleContainerProperties
  }

  interface ITilingSprite extends Container<PIXI.extras.TilingSprite> {
    image?: string;
  }

  interface IRope extends Container<PIXI.mesh.Rope> {
    image?: string;
  }

  interface IMesh extends Container<PIXI.mesh.Mesh> {
    image?: string;
  }

  interface IProvider {
    children(app: PIXI.Application): React.ReactNode | React.ReactNodeArray
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
    updateContainer(element: React.ReactNode, container: object, parentComponent: React.Component<any, any>, callback?: () => void): number;
    getPublicRootInstance(container: object): React.Component<any, any> | null;
    findHostInstance(component: object): any;
    injectIntoDevTools(devToolsConfig: IDevtoolsConfig): boolean;
  }

  interface IStageProps {
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
  const Sprite: React.ComponentType<_ReactPixi.ISprite>
  const Text: React.ComponentType<_ReactPixi.Container<PIXI.Text>>
  const Container: React.ComponentType<_ReactPixi.Container<PIXI.Container>>
  const Graphics: React.ComponentType<_ReactPixi.IGraphics>
  const BitmapText: React.ComponentType<_ReactPixi.IBitmapText>
  const NineSlicePlane: React.ComponentType<_ReactPixi.INineSlicePlane>
  const ParticleContainer: React.ComponentType<_ReactPixi.IParticleContainer>
  const TilingSprite: React.ComponentType<_ReactPixi.ITilingSprite>
  const Rope: React.ComponentType<_ReactPixi.IRope>
  const Mesh: React.ComponentType<_ReactPixi.IMesh>

  // renderer
  const render: (
    element:
      | React.ReactElement<any>
      | React.ReactElement<any>[]
      | React.Factory<any>,
    container: PIXI.Container,
    callback?: () => void
  ) => any

  // context provider
  const Provider: React.ComponentType<_ReactPixi.IProvider>

  // context HOC
  const withPixiApp: (baseComponent: React.ComponentClass<{ app: PIXI.Application }>) => React.ComponentClass<any>

  // fiber
  const PixiFiber: _ReactPixi.IReactFiber

  // stage
  const Stage: React.ComponentType<_ReactPixi.IStageProps>

  // custom component
  const PixiComponent: <P, PixiInstance extends PIXI.DisplayObject>(
    componentName: string,
    lifecycle: _ReactPixi.ICustomComponent<P, PixiInstance>
  ) => React.ComponentType<P>;
}

export = ReactPixi
export as namespace ReactPixi
