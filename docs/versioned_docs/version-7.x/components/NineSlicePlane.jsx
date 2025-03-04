import { Stage, NineSlicePlane } from '@pixi/react';

export default function NineSlicePlaneExample() {
    return (
        <Stage width={500} height={300} options={{ backgroundColor: 0xeef1f5 }}>
            <NineSlicePlane
                anchor={[200, 100]}
                pivot={[200, 100]}
                leftWidth={50}
                topHeight={30}
                rightWidth={60}
                bottomHeight={180}
                width={400}
                height={300}
                x={250}
                y={120}
                image='https://react.pixijs.io/img/speech-bubble.png'
            />
        </Stage>
    );
}
