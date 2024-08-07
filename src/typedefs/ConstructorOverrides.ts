import type {
    AlphaFilter,
    AlphaFilterOptions,
    BlurFilter,
    BlurFilterOptions,
    BlurFilterPass,
    BlurFilterPassOptions,
    DisplacementFilter,
    DisplacementFilterOptions,
    Filter,
    FilterOptions,
    NoiseFilter,
    NoiseFilterOptions,
    Text,
    TextOptions,
} from 'pixi.js';

export type ConstructorOverrides =
    | [typeof AlphaFilter, AlphaFilterOptions]
    | [typeof BlurFilter, BlurFilterOptions]
    | [typeof BlurFilterPass, BlurFilterPassOptions]
    | [typeof DisplacementFilter, DisplacementFilterOptions]
    | [typeof Filter, FilterOptions]
    | [typeof NoiseFilter, NoiseFilterOptions]
    | [typeof Text, TextOptions]
    | unknown;
