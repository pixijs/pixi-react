import { BlurFilter } from "pixi.js";
import { Stage, Container, Sprite, Text } from "@pixi/react";
import { useMemo } from "react";

export const MyComponent = () => {
    const blurFilter = useMemo(() => new BlurFilter({ strength: 4 }), []);

    return (
        <Stage options={{ background: 0xffffff, preference: 'webgl' }}>
            <Sprite
                image="https://pixijs.io/pixi-react/img/bunny.png"
                x={400}
                y={270}
                anchor={{ x: 0.5, y: 0.5 }}
            />

            <Container x={400} y={330}>
                <Text
                    text="Hello World"
                    anchor={{ x: 0.5, y: 0.5 }}
                    filters={[blurFilter]}
                    isSprite={true}
                />
            </Container>
        </Stage>
    );
};

function App() {
    return <MyComponent />;
}

export default App;
