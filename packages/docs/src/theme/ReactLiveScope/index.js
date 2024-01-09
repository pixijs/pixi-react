import React from 'react';
import * as PIXI from 'pixi.js';
import { Point, TextStyle, Texture } from 'pixi.js';
import * as ReactPixi from '@pixi/react';
import { BitmapText, Graphics, Text } from '@pixi/react';
import * as ReactPixiAnimated from '@pixi/react-animated';
import { Spring } from 'react-spring';
import times from 'lodash.times';

import makeAnimatedSpriteTextures from './makeAnimatedSpriteTextures';
import makeSimpleMeshData from './makeSimpleMeshData';
import ExampleAssetLoader from './ExampleAssetLoader';
import useIteration from './useIteration';

const ReactLiveScope = {
    React,
    ...React,
    ...ReactPixi,
    ReactPixiAnimated,
    Spring,
    PIXI,
    BitmapText,
    Graphics,
    Point,
    TextStyle,
    Text,
    Texture,
    ExampleAssetLoader,
    makeAnimatedSpriteTextures,
    makeSimpleMeshData,
    lodash: {
        times
    },
    useIteration,
};

export default ReactLiveScope;
