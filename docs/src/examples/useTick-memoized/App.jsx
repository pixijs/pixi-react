import {
    Application,
    useTick,
} from '@pixi/react';
import { useCallback, useState } from 'react'

function ChildComponent() {
    const [rotation, setRotation] = useState(0)

    const animateRotation = useCallback(() => setRotation(previousState => previousState + 1), []);

    useTick(animateRotation);

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
