import { TYPES, PixiComponent } from './utils/element'
import { render } from './render'
import Stage from './stage'
import { PixiFiber } from './reconciler'
import { Context as AppContext, AppProvider, AppConsumer, withPixiApp } from './stage/provider'
import { useTick, useApp } from './hooks'
import { withFilters } from './hoc'
import { eventHandlers } from './utils/pixi'
import { applyDefaultProps } from './utils/props'

/**
 * -------------------------------------------
 * Public API
 * -------------------------------------------
 */

export { render, Stage, withPixiApp, PixiComponent, PixiFiber }
export { AppProvider, AppConsumer, AppContext }
export { useTick, useApp }
export { withFilters }
export { applyDefaultProps }
export { eventHandlers }

export const BitmapText = TYPES.BitmapText
export const Container = TYPES.Container
export const Graphics = TYPES.Graphics
export const NineSlicePlane = TYPES.NineSlicePlane
export const ParticleContainer = TYPES.ParticleContainer
export const Sprite = TYPES.Sprite
export const AnimatedSprite = TYPES.AnimatedSprite
export const Text = TYPES.Text
export const TilingSprite = TYPES.TilingSprite
export const SimpleMesh = TYPES.SimpleMesh
export const SimpleRope = TYPES.SimpleRope
