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
  const Stage: React.SFC<StageProps>

  function render(
    pixiElement: PIXI.DisplayObject | PIXI.DisplayObject[],
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
  const Provider: React.SFC<ProviderProps>

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
  ): React.SFC<P>

  /**
   * -------------------------------------------
   * PIXI Components
   * -------------------------------------------
   */

  interface BitmapTextProperties extends ChildlessComponent<PIXI.extras.BitmapText> {
    text: string
  }
  const BitmapText: React.SFC<BitmapTextProperties>

  interface ContainerProperties extends Component<PIXI.Container> {}
  const Container: React.SFC<ContainerProperties>

  interface GraphicsProperties extends ChildlessComponent<PIXI.Graphics> {
    draw(graphics: PIXI.Graphics): void
  }
  const Graphics: React.SFC<GraphicsProperties>

  interface ParticleContainerProperties extends Component<PIXI.particles.ParticleContainer> {}
  const ParticleContainer: React.SFC<ParticleContainerProperties>

  interface SpriteProperties extends ChildlessComponent<PIXI.Sprite> {
    texture?: PIXI.Texture
    image?: string
  }
  const Sprite: React.SFC<SpriteProperties>

  interface TextProperties extends ChildlessComponent<PIXI.Text> {}
  const Text: React.SFC<TextProperties>

  interface TilingSpriteProperties extends ChildlessComponent<PIXI.extras.TilingSprite> {
    texture?: PIXI.Texture
    image?: string
  }
  const TilingSprite: React.SFC<TilingSpriteProperties>

  interface MeshProperties extends ChildlessComponent<PIXI.mesh.Mesh> {}
  const Mesh: React.SFC<MeshProperties>

  interface RopeProperties extends ChildlessComponent<PIXI.mesh.Rope> {
    texture?: PIXI.Texture
    image?: string
  }
  const Rope: React.SFC<RopeProperties>

  interface NineSlicePlaneProperties extends ChildlessComponent<PIXI.mesh.NineSlicePlane> {
    texture?: PIXI.Texture
    image?: string
  }
  const NineSlicePlane: React.SFC<NineSlicePlaneProperties>
}

export = ReactPixi
export as namespace ReactPixi
