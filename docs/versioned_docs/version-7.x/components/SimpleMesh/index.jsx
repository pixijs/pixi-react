import { Stage, SimpleMesh } from '@pixi/react';
import { DRAW_MODES } from 'pixi.js';
import makeSimpleMeshData from './makeSimpleMeshData';

const { uvs, vertices, indices } = makeSimpleMeshData();

export default function SimpleMeshExample() {
    return (
        <Stage width={500} height={300} options={{ backgroundColor: 0xeef1f5 }}>
            <SimpleMesh
                image='https://pixijs.io/pixi-react/img/mesh-placeholder.png'
                uvs={uvs}
                vertices={vertices}
                indices={indices}
                drawMode={DRAW_MODES.TRIANGLES}
            />
        </Stage>
    );
}
