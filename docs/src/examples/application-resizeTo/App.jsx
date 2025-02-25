import { Application } from '@pixi/react';
import { useRef } from 'react';

export default function App() {
    const parentRef = useRef(null);

    return (
        <div ref={parentRef}>
            <Application resizeTo={parentRef} />
        </div>
    );
};
