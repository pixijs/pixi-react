import { Stage, Container, AnimatedSprite } from '@pixi/react';
import makeAnimatedSpriteTextures from './makeAnimatedSpriteTextures';

const textures = makeAnimatedSpriteTextures();

export default function App() {
    return (
        <Stage width={300} height={300} options={{ backgroundColor: 0xeef1f5 }}>
            <Container position={[150, 150]}>
                <AnimatedSprite
                    anchor={0.5}
                    textures={textures}
                    isPlaying={true}
                    initialFrame={0}
                    animationSpeed={0.1}
                />
            </Container>
        </Stage>
    );
}
