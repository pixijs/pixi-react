import {
    Application,
    useTick,
} from '@pixi/react';
import { useState } from 'react'

function ChildComponent() {
    const [rotation, setRotation] = useState(0)

    useTick(() => setRotation(previousState => previousState + 1));

    return (
        <pixiSprite rotation={rotation} />
    );
};

export default function App() {
    return (
        <Application>
            <ChildComponent />
        </Application>
    )
};
