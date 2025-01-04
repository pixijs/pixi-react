import {
    type BitmapText,
    type BlurFilter,
    type BlurFilterOptions,
    type DisplacementFilter,
    type DisplacementFilterOptions,
    type HTMLText,
    type HTMLTextOptions,
    type Mesh,
    type MeshGeometry,
    type MeshGeometryOptions,
    type MeshOptions,
    type NineSliceSprite,
    type NineSliceSpriteOptions,
    type PlaneGeometry,
    type PlaneGeometryOptions,
    type Text,
    type TextOptions,
    type TilingSprite,
    type TilingSpriteOptions,
} from 'pixi.js';

export type ConstructorOverrides =
    | [typeof BitmapText, TextOptions]
    | [typeof BlurFilter, BlurFilterOptions]
    | [typeof DisplacementFilter, DisplacementFilterOptions]
    | [typeof HTMLText, HTMLTextOptions]
    | [typeof Mesh, MeshOptions]
    | [typeof MeshGeometry, MeshGeometryOptions]
    | [typeof NineSliceSprite, NineSliceSpriteOptions]
    | [typeof PlaneGeometry, PlaneGeometryOptions]
    | [typeof TilingSprite, TilingSpriteOptions]
    | [typeof Text, TextOptions];

