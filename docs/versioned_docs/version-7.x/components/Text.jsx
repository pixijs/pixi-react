import { Stage, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';

export default function TextExample() {
    return (
        <Stage width={300} height={300} options={{ backgroundColor: 0xeef1f5 }}>
            <Text
                text='Hello World'
                anchor={0.5}
                x={150}
                y={150}
                style={
                    new TextStyle({
                        align: 'center',
                        fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                        fontSize: 50,
                        fontWeight: '400',
                        fill: ['#ffffff', '#00ff99'], // gradient
                        stroke: '#01d27e',
                        strokeThickness: 5,
                        letterSpacing: 20,
                        dropShadow: true,
                        dropShadowColor: '#ccced2',
                        dropShadowBlur: 4,
                        dropShadowAngle: Math.PI / 6,
                        dropShadowDistance: 6,
                        wordWrap: true,
                        wordWrapWidth: 440,
                    })
                }
            />
        </Stage>
    );
}
