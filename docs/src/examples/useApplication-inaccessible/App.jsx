import {
    Application,
    useApplication,
} from '@pixi/react';

export default function App() {
    // This will cause an invariant violation.
    const { app } = useApplication();

    return <Application />;
};
