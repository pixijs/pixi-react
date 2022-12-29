import React from 'react';
import * as PIXI from 'pixi.js';
import * as ReactPixi from '@pixi/react-pixi';
import times from 'lodash.times';

import makeAnimatedSpriteTextures from './makeAnimatedSpriteTextures';
import makeSimpleMeshData from './makeSimpleMeshData';
import PIXILoader from './PIXILoader';
import useIteration from './useIteration';

const ReactLiveScope = {
    React,
    ...React,
    ...ReactPixi,
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
