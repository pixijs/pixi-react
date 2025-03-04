import { ParticleContainer, Sprite, Stage } from '@pixi/react';
import ExampleAssetLoader from './ExampleAssetLoader';

export default function ParticleContainerExample() {
    return (
        <ExampleAssetLoader name='bunny' url='https://react.pixijs.io/img/bunny.png'>
            <Stage width={300} height={300} options={{ backgroundColor: 0xffffff }}>
                <ParticleContainer position={[150, 150]} properties={{ position: true }}>
                    <Sprite anchor={0.5} x={-75} y={-75} image='bunny' />
                    <Sprite anchor={0.5} x={0} y={0} image='bunny' />
                    <Sprite anchor={0.5} x={75} y={75} image='bunny' />
                </ParticleContainer>
            </Stage>
        </ExampleAssetLoader>
    );
}
