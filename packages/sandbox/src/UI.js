import { AppProvider, Container, Text, useTick } from '@pixi/react';
import React, { useRef, useState } from 'react';

const RED = '#ff0000';
const GREEN = '#00ff00';

export function UI()
{
    const iteration = useRef(0);
    const [textStyle, setTextStyle] = useState({
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: RED,
    });

    useTick((delta) =>
    {
        iteration.current += delta;

        if (iteration.current >= 100)
        {
            iteration.current = 0;
            setTextStyle((textStyle) =>
            {
                const nextFill = textStyle.fill === RED ? GREEN : RED;

                return {
                    ...textStyle,
                    fill: nextFill,
                };
            });
        }
    });

    return (
        <Container>
            <Text position={{ x: 20, y: 20 }} anchor={{ x: 0, y: 0 }} style={textStyle} text="Hello" />
            <Text position={{ x: 780, y: 20 }} anchor={{ x: 1, y: 0 }} style={textStyle} text="World" />
        </Container>
    );
}

export function UIWithAppProvider({ app })
{
    return (
        <AppProvider value={app}>
            <UI />
        </AppProvider>
    );
}
