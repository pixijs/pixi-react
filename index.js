import CustomPIXIComponent from './lib/CustomPIXIComponent'
import Stage from './lib/Stage'
import { TYPES } from './lib/types'
import render from './lib/render'

/* Public API */

export { CustomPIXIComponent, Stage, render }

export const BitmapText = TYPES.BITMAP_TEXT
export const Container = TYPES.CONTAINER
export const Graphics = TYPES.GRAPHICS
export const ParticleContainer = TYPES.PARTICLE_CONTAINER
export const Sprite = TYPES.SPRITE
export const Text = TYPES.TEXT
export const TilingSprite = TYPES.TILING_SPRITE
