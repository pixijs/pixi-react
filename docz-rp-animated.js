import * as RP1 from './src/index-animated'
// import RP2 from './animated/react-pixi.umd'
const RP2 = null

const empty = () => null

let RP

if (process.env.NODE_ENV === 'development') {
  RP = RP1
} else {
  RP = RP2
}

export const Stage = RP.Stage || empty
export const Container = RP.Container || empty
export const Sprite = RP.Sprite || empty
export const AnimatedSprite = RP.AnimatedSprite || empty
export const BitmapText = RP.BitmapText || empty
export const Text = RP.Text || empty
export const Graphics = RP.Graphics || empty
export const NineSlicePlane = RP.NineSlicePlane || empty
export const ParticleContainer = RP.ParticleContainer || empty
export const SimpleMesh = RP.SimpleMesh || empty
export const SimpleRope = RP.SimpleRope || empty
export const TilingSprite = RP.TilingSprite || empty
export const useTick = RP.useTick || empty
export const useApp = RP.useApp || empty
export const withFilters = RP.withFilters || empty
