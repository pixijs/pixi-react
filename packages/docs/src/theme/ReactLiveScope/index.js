import React from 'react';
import * as PIXI from 'pixi.js';
import * as ReactPixi from '@pixi/react-pixi';
import * as ReactPixiAnimated from '@pixi/react-pixi-animated';
import { Spring } from 'react-spring';
import times from 'lodash.times';

import makeAnimatedSpriteTextures from './makeAnimatedSpriteTextures';
import makeSimpleMeshData from './makeSimpleMeshData';
import PIXILoader from './PIXILoader';
import useIteration from './useIteration';

const ReactLiveScope = {
    React,
    ...React,
    ...ReactPixi,
    ReactPixiAnimated,
    Spring,
    PIXI,
    PIXILoader,
    makeAnimatedSpriteTextures,
    makeSimpleMeshData,
    lodash: {
        times
    },
    useIteration,
};

export default ReactLiveScope;
