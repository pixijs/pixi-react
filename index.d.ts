import * as PIXI from 'pixi.js'
import * as React from 'react'

declare namespace _ReactPixi {
  type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

  interface ObjectWithChildren {
    children?: any
  }

  type Childless<T extends ObjectWithChildren> = Omit<T, 'children'>

  interface ChildrenProperties {
    children?: React.ReactNode
  }
}

/**
 * -------------------------------------------
 * Public API
 * -------------------------------------------
 */
declare namespace ReactPixi {
  /**
   * -------------------------------------------
   * Stage
   * -------------------------------------------
   */

  interface StageProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
    children?: React.ReactNode

    width?: number
    height?: number

    onMount?(callback: () => PIXI.Application): void

    raf?: boolean
    renderOnComponentChange?: boolean

    options?: PIXI.ApplicationOptions
  }
  const Stage: React.ComponentType<StageProps>

  function render(
    reactPixiElement:
      React.ReactElement<any> |
      React.ReactElement<any>[] |
      React.Factory<any>,
    pixiContainer: PIXI.Container,
    callback?: Function
  ): void

  function withPixiApp<P extends { app: PIXI.Application }>(
    baseComponent: React.ComponentType<P>
  ): React.ComponentType<_ReactPixi.Omit<P, 'app'>>

  /**
   * -------------------------------------------
   * Providers
   * -------------------------------------------
   */

  interface ProviderProps {
    children(app: PIXI.Application): React.ReactNode
  }
  const Provider: React.ComponentType<ProviderProps>

  /**
   * -------------------------------------------
   * Component types
   * -------------------------------------------
   */

  type ChildlessComponent<T extends _ReactPixi.ObjectWithChildren> = Partial<_ReactPixi.Childless<T>>

  type Component<T extends _ReactPixi.ObjectWithChildren> = ChildlessComponent<T> & _ReactPixi.ChildrenProperties

  /**
   * -------------------------------------------
   * Custom Component
   * -------------------------------------------
   */

  interface LifeCycleMethods<P, PixiInstance extends PIXI.DisplayObject> {
    create(props: P): PixiInstance
    didMount?(instance: PixiInstance, parent: PIXI.Container): void
    willUnmount?(instance: PixiInstance, parent: PIXI.Container): void
    applyProps?(instance: PixiInstance, oldProps: Readonly<P>, newProps: Readonly<P>): void
  }

  // e.g. const Circle = PixiComponent<{radius: number}, PIXI.Graphics>(...)
  function PixiComponent<P, PixiInstance extends PIXI.DisplayObject>(
    type: string,
    lifecycle: LifeCycleMethods<P, PixiInstance>
  ): React.ComponentType<P>

  /**
   * -------------------------------------------
   * PIXI Components
   * -------------------------------------------
   */

  interface BitmapTextProperties extends ChildlessComponent<PIXI.extras.BitmapText> {
    text: string
  }
  const BitmapText: React.ComponentType<BitmapTextProperties>

  interface ContainerProperties extends Component<PIXI.Container> {}
  const Container: React.ComponentType<ContainerProperties>

  interface GraphicsProperties extends ChildlessComponent<PIXI.Graphics> {
    draw(graphics: PIXI.Graphics): void
  }
  const Graphics: React.ComponentType<GraphicsProperties>

  interface ParticleContainerProperties extends Component<PIXI.particles.ParticleContainer> {}
  const ParticleContainer: React.ComponentType<ParticleContainerProperties>

  interface SpriteProperties extends ChildlessComponent<PIXI.Sprite> {
    texture?: PIXI.Texture
    image?: string
  }
  const Sprite: React.ComponentType<SpriteProperties>

  interface TextProperties extends ChildlessComponent<PIXI.Text> {}
  const Text: React.ComponentType<TextProperties>

  interface TilingSpriteProperties extends ChildlessComponent<PIXI.extras.TilingSprite> {
    texture?: PIXI.Texture
    image?: string
  }
  const TilingSprite: React.ComponentType<TilingSpriteProperties>

  interface MeshProperties extends ChildlessComponent<PIXI.mesh.Mesh> {}
  const Mesh: React.ComponentType<MeshProperties>

  interface RopeProperties extends ChildlessComponent<PIXI.mesh.Rope> {
    texture?: PIXI.Texture
    image?: string
  }
  const Rope: React.ComponentType<RopeProperties>

  interface NineSlicePlaneProperties extends ChildlessComponent<PIXI.mesh.NineSlicePlane> {
    texture?: PIXI.Texture
    image?: string
  }
  const NineSlicePlane: React.ComponentType<NineSlicePlaneProperties>
}

export = ReactPixi
export as namespace ReactPixi
