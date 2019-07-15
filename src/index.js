import { TYPES, PixiComponent } from './utils/element'
import { render } from './render'
import Stage from './stage'
import { PixiFiber } from './reconciler'
import { Context as AppContext, AppProvider, AppConsumer, withPixiApp } from './stage/provider'
import { useTick, useApp } from './hooks'

/**
 * -------------------------------------------
 * Public API
 * -------------------------------------------
 */

export { render, Stage, withPixiApp, PixiComponent, PixiFiber }
export { AppProvider, AppConsumer, AppContext }
export { useTick, useApp }

export const BitmapText = TYPES.BitmapText
export const Container = TYPES.Container
export const Graphics = TYPES.Graphics
export const NineSlicePlane = TYPES.NineSlicePlane
export const ParticleContainer = TYPES.ParticleContainer
export const Sprite = TYPES.Sprite
export const Text = TYPES.Text
export const TilingSprite = TYPES.TilingSprite
export const Mesh = TYPES.Mesh
export const Rope = TYPES.Rope
export const Star = TYPES.Star
