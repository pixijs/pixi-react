import { BlurFilter } from 'pixi.js';
import { useMemo } from 'react';
import { Stage, Container, Sprite, Text } from '@pixi/react';

export const MyComponent = () =>
{
    const blurFilter = useMemo(() => new BlurFilter(4), []);

    return (
        <Stage options={{ background: 0xffffff }}>
            <Sprite
                image="https://pixijs.io/pixi-react/img/bunny.png"
                x={400}
                y={270}
                anchor={{ x: 0.5, y: 0.5 }}
            />

            <Container x={400} y={330}>
                <Text text="Hello World" anchor={{ x: 0.5, y: 0.5 }} filters={[blurFilter]} />
            </Container>
        </Stage>
    );
};

function App()
{
    return (
        <MyComponent />
    );
}

export default App;
